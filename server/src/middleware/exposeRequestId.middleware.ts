import type { NextFunction, Request, Response } from 'express';

/** Exposes the request id to the browser for support / error correlation. */
export function exposeRequestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.requestId) {
    res.setHeader('X-Request-Id', req.requestId);
  }
  next();
}
