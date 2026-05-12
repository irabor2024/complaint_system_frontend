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

  verifyTwoFactorLogin: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.verifyTwoFactorLogin(req.body);
    res.json({ success: true, data: result });
  }),

  beginTwoFactorSetup: asyncHandler(async (req: Request, res: Response) => {
    const data = await authService.beginTwoFactorSetup(req.auth!.sub);
    res.json({ success: true, data });
  }),

  completeTwoFactorSetup: asyncHandler(async (req: Request, res: Response) => {
    const data = await authService.completeTwoFactorSetup(req.auth!.sub, req.body.code);
    res.json({ success: true, data });
  }),

  disableTwoFactor: asyncHandler(async (req: Request, res: Response) => {
    await authService.disableTwoFactor(req.auth!.sub, req.body.password);
    res.status(204).send();
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.me(req.auth!.sub);
    res.json({ success: true, data: user });
  }),
};
