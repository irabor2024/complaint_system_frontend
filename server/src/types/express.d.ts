import type { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      /** Populated by `requireAuth` middleware after JWT verification */
      auth?: {
        sub: string;
        email: string;
        role: Role;
        name: string;
      };
    }
  }
}

export {};
