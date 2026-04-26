import type { Request, Response } from 'express';
import { routeParam } from '../common/http/params';
import { AppError } from '../common/errors/AppError';
import { asyncHandler } from '../middleware/asyncHandler';
import { notificationService } from '../services/notification.service';

export const notificationController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const data = await notificationService.list(req.auth!.sub);
    res.json({ success: true, data });
  }),

  unreadCount: asyncHandler(async (req: Request, res: Response) => {
    const count = await notificationService.unreadCount(req.auth!.sub);
    res.json({ success: true, data: { count } });
  }),

  markRead: asyncHandler(async (req: Request, res: Response) => {
    const ok = await notificationService.markRead(req.auth!.sub, routeParam(req, 'id'));
    if (!ok) throw new AppError(404, 'NOT_FOUND', 'Notification not found');
    res.json({ success: true });
  }),

  markAllRead: asyncHandler(async (req: Request, res: Response) => {
    await notificationService.markAllRead(req.auth!.sub);
    res.json({ success: true });
  }),
};
