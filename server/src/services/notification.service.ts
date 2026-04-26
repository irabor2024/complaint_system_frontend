import { notificationTypeToApi } from '../common/mappers/enums';
import { notificationRepository } from '../repositories/notification.repository';

export class NotificationService {
  async list(userId: string) {
    const rows = await notificationRepository.listForUser(userId);
    return rows.map(n => ({
      id: n.id,
      type: notificationTypeToApi(n.type),
      title: n.title,
      message: n.message,
      read: n.read,
      createdAt: n.createdAt.toISOString(),
      complaintId: n.complaintId ?? undefined,
    }));
  }

  async unreadCount(userId: string) {
    return notificationRepository.unreadCount(userId);
  }

  async markRead(userId: string, id: string) {
    const res = await notificationRepository.markRead(userId, id);
    if (res.count === 0) {
      return false;
    }
    return true;
  }

  async markAllRead(userId: string) {
    await notificationRepository.markAllRead(userId);
  }
}

export const notificationService = new NotificationService();
