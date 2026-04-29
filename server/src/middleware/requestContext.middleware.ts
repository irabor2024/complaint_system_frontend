import { randomUUID } from 'crypto';
import type { NextFunction, Request, Response } from 'express';

/**
 * Assigns a stable `requestId` for the lifetime of the request (logs + error payloads).
 */
export function requestContextMiddleware(req: Request, _res: Response, next: NextFunction): void {
  req.requestId = randomUUID();
  next();
}
