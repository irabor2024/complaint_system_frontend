import type { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { staffService } from '../services/staff.service';

export const staffController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const data = await staffService.list();
    res.json({ success: true, data });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const data = await staffService.create(req.body);
    res.status(201).json({ success: true, data });
  }),
};
