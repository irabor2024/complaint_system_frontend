import bcrypt from 'bcryptjs';
import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import { authenticator } from 'otplib';
import type { Role, User } from '@prisma/client';
import { env } from '../config/env';
import { AppError } from '../common/errors/AppError';
import { userRepository } from '../repositories/user.repository';
import { roleToApi } from '../common/mappers/enums';

authenticator.options = { ...authenticator.options, window: 1 };

export type JwtUserPayload = {
  sub: string;
  email: string;
  role: Role;
  name: string;
};

const TWO_FA_PENDING_TYP = '2fa_pending';

type TwoFactorPendingPayload = {
  sub: string;
  typ: typeof TWO_FA_PENDING_TYP;
};

export type LoginResult =
  | { token: string; user: unknown }
  | { requiresTwoFactor: true; tempToken: string };

function mapUserPublic(user: User): unknown {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: roleToApi(user.role),
    twoFactorEnabled: user.twoFactorEnabled,
    ...(user.phone ? { phone: user.phone } : {}),
    ...(user.departmentId ? { departmentId: user.departmentId } : {}),
    ...(user.jobTitle ? { jobTitle: user.jobTitle } : {}),
  };
}

export class AuthService {
  private signToken(user: User): string {
    const payload: JwtUserPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
    return jwt.sign(payload, env.JWT_SECRET as Secret, {
      expiresIn: env.JWT_EXPIRES_IN,
    } as SignOptions);
  }

  private signTwoFactorPendingToken(userId: string): string {
    const payload: TwoFactorPendingPayload = { sub: userId, typ: TWO_FA_PENDING_TYP };
    return jwt.sign(payload, env.JWT_SECRET as Secret, {
      expiresIn: env.JWT_2FA_EXPIRES_IN,
    } as SignOptions);
  }

  private verifyTwoFactorPendingToken(token: string): string {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as TwoFactorPendingPayload & jwt.JwtPayload;
      if (decoded.typ !== TWO_FA_PENDING_TYP || typeof decoded.sub !== 'string') {
        throw new AppError(401, 'INVALID_2FA_TOKEN', 'Invalid or expired verification session');
      }
      return decoded.sub;
    } catch (e) {
      if (e instanceof AppError) throw e;
      throw new AppError(401, 'INVALID_2FA_TOKEN', 'Invalid or expired verification session');
    }
  }

  async register(input: { email: string; password: string; name: string; phone?: string }): Promise<{
    token: string;
    user: unknown;
  }> {
    const email = input.email.toLowerCase();
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new AppError(409, 'EMAIL_IN_USE', 'Email is already registered');
    }
    const passwordHash = await bcrypt.hash(input.password, 12);
    const phone = input.phone?.trim();
    const user = await userRepository.create({
      email,
      passwordHash,
      name: input.name,
      ...(phone ? { phone } : {}),
      role: 'PATIENT',
    });
    const token = this.signToken(user);
    return {
      token,
      user: mapUserPublic(user),
    };
  }

  async login(input: { email: string; password: string }): Promise<LoginResult> {
    const email = input.email.toLowerCase();
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }
    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    if (user.twoFactorEnabled && user.twoFactorSecret) {
      return {
        requiresTwoFactor: true,
        tempToken: this.signTwoFactorPendingToken(user.id),
      };
    }

    const token = this.signToken(user);
    return {
      token,
      user: mapUserPublic(user),
    };
  }

  async verifyTwoFactorLogin(input: { tempToken: string; code: string }): Promise<{ token: string; user: unknown }> {
    const userId = this.verifyTwoFactorPendingToken(input.tempToken);
    const user = await userRepository.findById(userId);
    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      throw new AppError(401, 'INVALID_2FA_TOKEN', 'Invalid or expired verification session');
    }
    const digits = input.code.replace(/\s/g, '');
    const valid = authenticator.verify({ token: digits, secret: user.twoFactorSecret });
    if (!valid) {
      throw new AppError(401, 'INVALID_2FA_CODE', 'Invalid authentication code');
    }
    const token = this.signToken(user);
    return { token, user: mapUserPublic(user) };
  }

  async beginTwoFactorSetup(userId: string): Promise<{ otpAuthUrl: string; manualEntryKey: string }> {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
    if (user.twoFactorEnabled) {
      throw new AppError(400, 'TWO_FACTOR_ALREADY_ENABLED', 'Two-factor authentication is already enabled');
    }
    const secret = authenticator.generateSecret();
    await userRepository.update(userId, {
      twoFactorSecret: secret,
      twoFactorEnabled: false,
    });
    const otpAuthUrl = authenticator.keyuri(user.email, env.TOTP_ISSUER, secret);
    return { otpAuthUrl, manualEntryKey: secret };
  }

  async completeTwoFactorSetup(userId: string, code: string): Promise<{ twoFactorEnabled: true }> {
    const user = await userRepository.findById(userId);
    if (!user?.twoFactorSecret) {
      throw new AppError(400, 'TWO_FACTOR_NOT_STARTED', 'Start setup from Settings first');
    }
    if (user.twoFactorEnabled) {
      throw new AppError(400, 'TWO_FACTOR_ALREADY_ENABLED', 'Two-factor authentication is already enabled');
    }
    const digits = code.replace(/\s/g, '');
    const valid = authenticator.verify({ token: digits, secret: user.twoFactorSecret });
    if (!valid) {
      throw new AppError(401, 'INVALID_2FA_CODE', 'Invalid authentication code');
    }
    await userRepository.update(userId, { twoFactorEnabled: true });
    return { twoFactorEnabled: true };
  }

  async disableTwoFactor(userId: string, password: string): Promise<void> {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new AppError(401, 'INVALID_PASSWORD', 'Invalid password');
    }
    await userRepository.update(userId, {
      twoFactorEnabled: false,
      twoFactorSecret: null,
    });
  }

  verifyToken(token: string): JwtUserPayload {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtUserPayload & { typ?: string };
      if (decoded.typ === TWO_FA_PENDING_TYP) {
        throw new AppError(401, 'INVALID_TOKEN', 'Invalid or expired token');
      }
      return decoded;
    } catch (e) {
      if (e instanceof AppError) throw e;
      throw new AppError(401, 'INVALID_TOKEN', 'Invalid or expired token');
    }
  }

  async me(userId: string): Promise<unknown> {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
    return mapUserPublic(user);
  }
}

export const authService = new AuthService();
