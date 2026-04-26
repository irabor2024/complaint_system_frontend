import type { Role } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../common/errors/AppError';
import { asyncHandler } from './asyncHandler';

export function requireRole(...allowed: Role[]) {
  return asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      throw new AppError(401, 'UNAUTHORIZED', 'Authentication required');
    }
    if (!allowed.includes(req.auth.role)) {
      throw new AppError(403, 'FORBIDDEN', 'Insufficient permissions');
    }
    next();
  });
}
