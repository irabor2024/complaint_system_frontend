import type { Prisma } from '@prisma/client';
import { prisma } from '../infrastructure/prisma';

export class NotificationRepository {
  async create(data: Prisma.NotificationCreateInput) {
    return prisma.notification.create({ data });
  }

  async listForUser(userId: string, params?: { unreadOnly?: boolean }) {
    return prisma.notification.findMany({
      where: {
        userId,
        ...(params?.unreadOnly ? { read: false } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async markRead(userId: string, id: string) {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { read: true },
    });
  }

  async markAllRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  async unreadCount(userId: string): Promise<number> {
    return prisma.notification.count({ where: { userId, read: false } });
  }
}

export const notificationRepository = new NotificationRepository();
