import type { NextFunction, Request, Response } from 'express';
import type { z } from 'zod';
import { asyncHandler } from './asyncHandler';

type Schema = z.ZodTypeAny;

export function validateBody(schema: Schema) {
  return asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    req.body = await schema.parseAsync(req.body);
    next();
  });
}

export function validateQuery(schema: Schema) {
  return asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    req.query = (await schema.parseAsync(req.query)) as Request['query'];
    next();
  });
}
