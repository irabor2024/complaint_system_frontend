import type { Prisma } from '@prisma/client';
import { prisma } from '../infrastructure/prisma';

export class ComplaintResponseRepository {
  async create(data: Prisma.ComplaintResponseCreateInput) {
    return prisma.complaintResponse.create({
      data,
      include: { author: { select: { id: true, name: true, role: true } } },
    });
  }
}

export const complaintResponseRepository = new ComplaintResponseRepository();
