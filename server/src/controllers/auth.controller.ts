import type { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authService } from '../services/auth.service';

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, data: result });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    res.json({ success: true, data: result });
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.me(req.auth!.sub);
    res.json({ success: true, data: user });
  }),
};
