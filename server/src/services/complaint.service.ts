import type { ComplaintStatus } from '@prisma/client';
import { AppError } from '../common/errors/AppError';
import { mapComplaintToDto } from '../common/mappers/complaint.mapper';
import {
  categoryFromApi,
  complaintStatusFromApi,
  priorityFromApi,
} from '../common/mappers/enums';
import type { JwtUserPayload } from './auth.service';
import { complaintRepository } from '../repositories/complaint.repository';
import { complaintResponseRepository } from '../repositories/complaint-response.repository';
import { departmentRepository } from '../repositories/department.repository';
import { notificationRepository } from '../repositories/notification.repository';
import { userRepository } from '../repositories/user.repository';
import { emailService } from './email.service';

export class ComplaintService {
  private async nextTicketId(): Promise<string> {
    const year = new Date().getFullYear();
    for (let attempt = 0; attempt < 8; attempt++) {
      const count = await complaintRepository.count();
      const ticketId = `CMP-${year}-${String(count + 1 + attempt).padStart(4, '0')}`;
      const clash = await complaintRepository.findByTicketId(ticketId);
      if (!clash) return ticketId;
    }
    return `CMP-${year}-${Date.now().toString(36).toUpperCase()}`;
  }

  async submitPublic(input: {
    patientName: string;
    email: string;
    phone: string;
    category: string;
    departmentId: string;
    description: string;
  }) {
    const dept = await departmentRepository.findById(input.departmentId);
    if (!dept) throw new AppError(400, 'INVALID_DEPARTMENT', 'Department not found');

    const patientEmail = input.email.toLowerCase();
    const ticketId = await this.nextTicketId();

    const complaint = await complaintRepository.create({
      ticketId,
      patientName: input.patientName.trim(),
      patientEmail,
      patientPhone: input.phone.trim(),
      category: categoryFromApi(input.category),
      description: input.description.trim(),
      department: { connect: { id: dept.id } },
      status: 'SUBMITTED',
      priority: 'MEDIUM',
    });

    const admins = await userRepository.listByRole('ADMIN');
    await Promise.all(
      admins.map(admin =>
        notificationRepository.create({
          user: { connect: { id: admin.id } },
          type: 'NEW_COMPLAINT',
          title: 'New complaint',
          message: `${input.patientName} submitted ${ticketId}.`,
          complaint: { connect: { id: complaint.id } },
        })
      )
    );

    await emailService.sendComplaintSubmitted(patientEmail, ticketId, input.patientName);

    return mapComplaintToDto(complaint);
  }

  async trackByTicket(ticketId: string) {
    const c = await complaintRepository.findByTicketId(ticketId);
    if (!c) throw new AppError(404, 'NOT_FOUND', 'Complaint not found');
    return mapComplaintToDto(c);
  }

  async list(actor: JwtUserPayload, query: { departmentId?: string; status?: string; limit?: number }) {
    const take = Math.min(query.limit ?? 50, 100);
    if (actor.role === 'ADMIN') {
      const rows = await complaintRepository.list({
        take,
        departmentId: query.departmentId,
        status: query.status ? complaintStatusFromApi(query.status) : undefined,
      });
      return rows.map(mapComplaintToDto);
    }
    if (actor.role === 'STAFF') {
      const rows = await complaintRepository.list({
        take,
        assignedStaffId: actor.sub,
        status: query.status ? complaintStatusFromApi(query.status) : undefined,
      });
      return rows.map(mapComplaintToDto);
    }
    const user = await userRepository.findById(actor.sub);
    if (!user) throw new AppError(401, 'UNAUTHORIZED', 'User not found');
    const rows = await complaintRepository.list({
      take,
      patientEmail: user.email.toLowerCase(),
      status: query.status ? complaintStatusFromApi(query.status) : undefined,
    });
    return rows.map(mapComplaintToDto);
  }

  async getById(actor: JwtUserPayload, id: string) {
    const c = await complaintRepository.findById(id);
    if (!c) throw new AppError(404, 'NOT_FOUND', 'Complaint not found');

    if (actor.role === 'ADMIN') {
      return mapComplaintToDto(c);
    }
    if (actor.role === 'STAFF') {
      if (c.assignedStaffId !== actor.sub) {
        throw new AppError(403, 'FORBIDDEN', 'You can only view complaints assigned to you');
      }
      return mapComplaintToDto(c);
    }
    const user = await userRepository.findById(actor.sub);
    if (!user || c.patientEmail.toLowerCase() !== user.email.toLowerCase()) {
      throw new AppError(403, 'FORBIDDEN', 'You cannot view this complaint');
    }
    return mapComplaintToDto(c);
  }

  async updateStatus(actor: JwtUserPayload, id: string, statusRaw: string) {
    const c = await complaintRepository.findById(id);
    if (!c) throw new AppError(404, 'NOT_FOUND', 'Complaint not found');
    const status = complaintStatusFromApi(statusRaw) as ComplaintStatus;

    if (actor.role === 'STAFF' && c.assignedStaffId !== actor.sub) {
      throw new AppError(403, 'FORBIDDEN', 'Not assigned to this complaint');
    }
    if (actor.role === 'PATIENT') {
      throw new AppError(403, 'FORBIDDEN', 'Patients cannot change status');
    }

    const author = await userRepository.findById(actor.sub);
    if (!author) throw new AppError(401, 'UNAUTHORIZED', 'User not found');

    await complaintResponseRepository.create({
      complaint: { connect: { id: c.id } },
      author: { connect: { id: author.id } },
      message: `Status updated to ${statusRaw}.`,
      statusChange: status,
    });

    const updated = await complaintRepository.update(id, { status });

    await emailService.sendStatusUpdate(c.patientEmail, c.ticketId, statusRaw);

    return mapComplaintToDto(updated);
  }

  async addResponse(actor: JwtUserPayload, id: string, message: string) {
    const c = await complaintRepository.findById(id);
    if (!c) throw new AppError(404, 'NOT_FOUND', 'Complaint not found');
    if (actor.role === 'PATIENT') {
      throw new AppError(403, 'FORBIDDEN', 'Patients cannot add staff responses here');
    }
    if (actor.role === 'STAFF' && c.assignedStaffId !== actor.sub) {
      throw new AppError(403, 'FORBIDDEN', 'Not assigned to this complaint');
    }

    const author = await userRepository.findById(actor.sub);
    if (!author) throw new AppError(401, 'UNAUTHORIZED', 'User not found');

    await complaintResponseRepository.create({
      complaint: { connect: { id: c.id } },
      author: { connect: { id: author.id } },
      message: message.trim(),
    });

    const updated = await complaintRepository.update(id, { updatedAt: new Date() });

    return mapComplaintToDto(updated);
  }

  async assignStaff(actor: JwtUserPayload, id: string, staffUserId: string) {
    if (actor.role !== 'ADMIN') {
      throw new AppError(403, 'FORBIDDEN', 'Only administrators can assign staff');
    }
    const c = await complaintRepository.findById(id);
    if (!c) throw new AppError(404, 'NOT_FOUND', 'Complaint not found');
    const staff = await userRepository.findById(staffUserId);
    if (!staff || staff.role !== 'STAFF') {
      throw new AppError(400, 'INVALID_STAFF', 'Invalid staff user');
    }
    const updated = await complaintRepository.update(id, {
      assignedStaff: { connect: { id: staff.id } },
    });

    await notificationRepository.create({
      user: { connect: { id: staff.id } },
      type: 'ASSIGNMENT',
      title: 'Complaint assigned',
      message: `You were assigned ${c.ticketId}.`,
      complaint: { connect: { id: c.id } },
    });

    return mapComplaintToDto(updated);
  }

  async setPriority(actor: JwtUserPayload, id: string, priorityRaw: string) {
    if (actor.role !== 'ADMIN') {
      throw new AppError(403, 'FORBIDDEN', 'Only administrators can set priority');
    }
    const c = await complaintRepository.findById(id);
    if (!c) throw new AppError(404, 'NOT_FOUND', 'Complaint not found');
    const priority = priorityFromApi(priorityRaw);
    const updated = await complaintRepository.update(id, { priority });
    return mapComplaintToDto(updated);
  }
}

export const complaintService = new ComplaintService();
