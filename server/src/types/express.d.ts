import type { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      /** Correlates logs and API error payloads (set by `requestContextMiddleware`). */
      requestId?: string;
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
