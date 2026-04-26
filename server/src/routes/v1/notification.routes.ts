import { Router } from 'express';
import { notificationController } from '../../controllers/notification.controller';
import { requireAuth } from '../../middleware/auth.middleware';

export const notificationRouter = Router();

notificationRouter.use(requireAuth);

notificationRouter.get('/', notificationController.list);
notificationRouter.get('/unread-count', notificationController.unreadCount);
notificationRouter.patch('/:id/read', notificationController.markRead);
notificationRouter.post('/read-all', notificationController.markAllRead);
