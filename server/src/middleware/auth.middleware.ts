import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../common/errors/AppError';
import { authService } from '../services/auth.service';
import { asyncHandler } from './asyncHandler';

export const requireAuth = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    throw new AppError(401, 'UNAUTHORIZED', 'Missing or invalid Authorization header');
  }
  const token = header.slice('Bearer '.length).trim();
  if (!token) {
    throw new AppError(401, 'UNAUTHORIZED', 'Missing token');
  }
  const payload = authService.verifyToken(token);
  req.auth = {
    sub: payload.sub,
    email: payload.email,
    role: payload.role,
    name: payload.name,
  };
  next();
});
