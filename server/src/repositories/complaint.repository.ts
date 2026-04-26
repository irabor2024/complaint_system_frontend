import type { ComplaintStatus, Prisma } from '@prisma/client';
import { prisma } from '../infrastructure/prisma';

const complaintInclude = {
  department: true,
  assignedStaff: { select: { id: true, name: true, email: true } },
  responses: {
    include: { author: { select: { id: true, name: true, role: true } } },
    orderBy: { createdAt: 'asc' as const },
  },
} satisfies Prisma.ComplaintInclude;

export type ComplaintWithRelations = Prisma.ComplaintGetPayload<{ include: typeof complaintInclude }>;

export class ComplaintRepository {
  async count(): Promise<number> {
    return prisma.complaint.count();
  }

  async create(data: Prisma.ComplaintCreateInput): Promise<ComplaintWithRelations> {
    return prisma.complaint.create({ data, include: complaintInclude });
  }

  async findById(id: string): Promise<ComplaintWithRelations | null> {
    return prisma.complaint.findUnique({ where: { id }, include: complaintInclude });
  }

  async findByTicketId(ticketId: string): Promise<ComplaintWithRelations | null> {
    return prisma.complaint.findUnique({
      where: { ticketId: ticketId.trim() },
      include: complaintInclude,
    });
  }

  async list(params: {
    skip?: number;
    take?: number;
    departmentId?: string;
    status?: ComplaintStatus;
    assignedStaffId?: string;
    patientEmail?: string;
  }): Promise<ComplaintWithRelations[]> {
    const { skip = 0, take = 50, departmentId, status, assignedStaffId, patientEmail } = params;
    return prisma.complaint.findMany({
      where: {
        ...(departmentId ? { departmentId } : {}),
        ...(status ? { status } : {}),
        ...(assignedStaffId ? { assignedStaffId } : {}),
        ...(patientEmail ? { patientEmail } : {}),
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: complaintInclude,
    });
  }

  async update(
    id: string,
    data: Prisma.ComplaintUpdateInput
  ): Promise<ComplaintWithRelations> {
    return prisma.complaint.update({ where: { id }, data, include: complaintInclude });
  }

  async countForStaff(staffId: string): Promise<{ assigned: number; resolved: number }> {
    const [assigned, resolved] = await Promise.all([
      prisma.complaint.count({ where: { assignedStaffId: staffId } }),
      prisma.complaint.count({
        where: {
          assignedStaffId: staffId,
          status: { in: ['RESOLVED', 'CLOSED'] },
        },
      }),
    ]);
    return { assigned, resolved };
  }
}

export const complaintRepository = new ComplaintRepository();
