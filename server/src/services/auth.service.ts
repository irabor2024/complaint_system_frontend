import bcrypt from 'bcryptjs';
import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import type { Role, User } from '@prisma/client';
import { env } from '../config/env';
import { AppError } from '../common/errors/AppError';
import { userRepository } from '../repositories/user.repository';
import { roleToApi } from '../common/mappers/enums';

export type JwtUserPayload = {
  sub: string;
  email: string;
  role: Role;
  name: string;
};

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
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: roleToApi(user.role),
        ...(user.phone ? { phone: user.phone } : {}),
      },
    };
  }

  async login(input: { email: string; password: string }): Promise<{ token: string; user: unknown }> {
    const email = input.email.toLowerCase();
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }
    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }
    const token = this.signToken(user);
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: roleToApi(user.role),
        ...(user.phone ? { phone: user.phone } : {}),
        ...(user.departmentId ? { departmentId: user.departmentId } : {}),
        ...(user.jobTitle ? { jobTitle: user.jobTitle } : {}),
      },
    };
  }

  verifyToken(token: string): JwtUserPayload {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtUserPayload;
      return decoded;
    } catch {
      throw new AppError(401, 'INVALID_TOKEN', 'Invalid or expired token');
    }
  }

  async me(userId: string): Promise<unknown> {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: roleToApi(user.role),
      ...(user.phone ? { phone: user.phone } : {}),
      departmentId: user.departmentId,
      jobTitle: user.jobTitle,
    };
  }
}

export const authService = new AuthService();
