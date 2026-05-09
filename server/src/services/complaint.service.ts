import type { ComplaintStatus } from '@prisma/client';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { access, mkdir, rm, writeFile } from 'node:fs/promises';
import { AppError } from '../common/errors/AppError';
import { mapComplaintToDto } from '../common/mappers/complaint.mapper';
import {
  categoryFromApi,
  complaintStatusFromApi,
  complaintStatusToApi,
  priorityFromApi,
  priorityToApi,
} from '../common/mappers/enums';
import { getUploadRoot } from '../config/env';
import type { ComplaintWithRelations } from '../repositories/complaint.repository';
import { complaintAttachmentRepository } from '../repositories/complaint-attachment.repository';
import { complaintRepository } from '../repositories/complaint.repository';
import { complaintResponseRepository } from '../repositories/complaint-response.repository';
import { departmentRepository } from '../repositories/department.repository';
import { notificationRepository } from '../repositories/notification.repository';
import { userRepository } from '../repositories/user.repository';
import { logger } from '../config/logger';
import type { JwtUserPayload } from './auth.service';
import { resolveComplaintRouting } from './categorization/routing';
import { emailService } from './email.service';

const ALLOWED_UPLOAD_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.txt']);

function excerptDescription(text: string, maxLen: number): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= maxLen) return t;
  return `${t.slice(0, Math.max(0, maxLen - 1))}…`;
}

/** Admin in-app notification after complaint is fully persisted (row + attachments). */
function buildAdminNewComplaintNotification(params: {
  complaintId: string;
  ticketId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  category: string;
  priorityLabel: string;
  departmentName: string;
  statusLabel: string;
  routingSource: string;
  attachmentCount: number;
  description: string;
}): { title: string; message: string } {
  const title = `New complaint ${params.ticketId}`;
  const message = [
    `Complaint ID: ${params.complaintId}`,
    `Ticket ID: ${params.ticketId}`,
    `Patient: ${params.patientName}`,
    `Email: ${params.patientEmail}`,
    `Phone: ${params.patientPhone}`,
    `Category: ${params.category}`,
    `Priority: ${params.priorityLabel}`,
    `Department: ${params.departmentName}`,
    `Status: ${params.statusLabel}`,
    `Routing: ${params.routingSource}`,
    `Attachments: ${params.attachmentCount}`,
    '',
    'Description:',
    excerptDescription(params.description, 600),
  ].join('\n');
  return { title, message };
}

function fileExtensionForUpload(original: string): string {
  const ext = path.extname(original).toLowerCase();
  return ALLOWED_UPLOAD_EXT.has(ext) ? ext : '.bin';
}

function filenameForDisplay(original: string): string {
  const base = path.basename(original).replace(/[\x00-\x1f\x7f]/g, '').slice(0, 200);
  return base || 'attachment';
}

export type ComplaintUploadFile = {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
};

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
    category?: string;
    automaticCategory?: boolean;
    departmentId?: string;
    description: string;
    files?: ComplaintUploadFile[];
  }) {
    const description = input.description.trim();
    const patientEmail = input.email.toLowerCase();
    const departments = await departmentRepository.findAll();
    if (departments.length === 0) {
      throw new AppError(400, 'NO_DEPARTMENTS', 'No departments are configured.');
    }

    /**
     * Flow:
     * 1. Validated submission (middleware)
     * 2. AI routing — category, priority, department from description (or manual overrides)
     * 3. Persist complaint row to the database
     * 4. Persist attachments (if any) — still before notifications
     * 5. Reload complaint from DB (includes attachment rows)
     * 6. Notify admins — always after persistence so `complaintId` and DB-backed fields are final
     * 7. Patient acknowledgment email
     */
    const routing = await resolveComplaintRouting(description, {
      automaticCategory: Boolean(input.automaticCategory),
      manualCategory: input.category,
      manualDepartmentId: input.departmentId,
      departments,
    });

    const dept = await departmentRepository.findById(routing.departmentId);
    if (!dept) throw new AppError(400, 'INVALID_DEPARTMENT', 'Department not found');

    const ticketId = await this.nextTicketId();

    logger.info(
      {
        ticketId,
        category: routing.category,
        priority: routing.priority,
        departmentId: routing.departmentId,
        categorizationMethod: routing.categorizationMethod,
      },
      'Complaint AI routing resolved'
    );

    const complaint = await complaintRepository.create({
      ticketId,
      patientName: input.patientName.trim(),
      patientEmail,
      patientPhone: input.phone.trim(),
      category: categoryFromApi(routing.category),
      description,
      department: { connect: { id: dept.id } },
      status: 'SUBMITTED',
      priority: routing.priority,
    });

    const files = (input.files ?? []).filter(f => f.buffer?.length);
    const dir = path.join(getUploadRoot(), 'complaints', complaint.id);
    if (files.length > 0) {
      await mkdir(dir, { recursive: true });
      try {
        for (const file of files) {
          const storedFileName = `${randomUUID()}${fileExtensionForUpload(file.originalname)}`;
          await complaintAttachmentRepository.create({
            complaintId: complaint.id,
            originalName: filenameForDisplay(file.originalname),
            storedFileName,
            mimeType: file.mimetype,
            sizeBytes: file.size,
          });
          await writeFile(path.join(dir, storedFileName), file.buffer);
        }
      } catch {
        await complaintRepository.deleteById(complaint.id);
        await rm(dir, { recursive: true, force: true }).catch(() => undefined);
        throw new AppError(500, 'UPLOAD_FAILED', 'Could not store attachments. Please try again.');
      }
    }

    const persisted = await complaintRepository.findById(complaint.id);
    if (!persisted) {
      throw new AppError(500, 'INTERNAL', 'Complaint missing after save');
    }

    const routingSource = input.automaticCategory
      ? routing.categorizationMethod === 'hf'
        ? 'Automatic — Transformers.js (DistilBERT-MNLI)'
        : 'Automatic — local NLP'
      : 'Manual — submitter selected category and department';

    const { title: notificationTitle, message: notificationMessage } = buildAdminNewComplaintNotification({
      complaintId: persisted.id,
      ticketId: persisted.ticketId,
      patientName: persisted.patientName,
      patientEmail: persisted.patientEmail,
      patientPhone: persisted.patientPhone,
      category: routing.category,
      priorityLabel: priorityToApi(persisted.priority),
      departmentName: dept.name,
      statusLabel: complaintStatusToApi(persisted.status),
      routingSource,
      attachmentCount: persisted.attachments?.length ?? 0,
      description: persisted.description,
    });

    const admins = await userRepository.listByRole('ADMIN');
    await Promise.all(
      admins.map(admin =>
        notificationRepository.create({
          user: { connect: { id: admin.id } },
          type: 'NEW_COMPLAINT',
          title: notificationTitle,
          message: notificationMessage,
          complaint: { connect: { id: persisted.id } },
        })
      )
    );

    await emailService.sendComplaintSubmitted(patientEmail, ticketId, dept.name);

    return mapComplaintToDto(persisted);
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

  private async assertComplaintReadable(actor: JwtUserPayload, c: ComplaintWithRelations): Promise<void> {
    if (actor.role === 'ADMIN') return;
    if (actor.role === 'STAFF') {
      if (c.assignedStaffId !== actor.sub) {
        throw new AppError(403, 'FORBIDDEN', 'You can only view complaints assigned to you');
      }
      return;
    }
    const user = await userRepository.findById(actor.sub);
    if (!user || c.patientEmail.toLowerCase() !== user.email.toLowerCase()) {
      throw new AppError(403, 'FORBIDDEN', 'You cannot view this complaint');
    }
  }

  async getById(actor: JwtUserPayload, id: string) {
    const c = await complaintRepository.findById(id);
    if (!c) throw new AppError(404, 'NOT_FOUND', 'Complaint not found');
    await this.assertComplaintReadable(actor, c);
    return mapComplaintToDto(c);
  }

  async getAttachmentFile(actor: JwtUserPayload, complaintId: string, attachmentId: string) {
    const c = await complaintRepository.findById(complaintId);
    if (!c) throw new AppError(404, 'NOT_FOUND', 'Complaint not found');
    await this.assertComplaintReadable(actor, c);

    const att = await complaintAttachmentRepository.findByIdAndComplaint(attachmentId, complaintId);
    if (!att) throw new AppError(404, 'NOT_FOUND', 'Attachment not found');

    const filePath = path.join(getUploadRoot(), 'complaints', complaintId, att.storedFileName);
    try {
      await access(filePath);
    } catch {
      throw new AppError(404, 'NOT_FOUND', 'File is no longer available');
    }

    return {
      stream: createReadStream(filePath),
      downloadName: att.originalName,
      mimeType: att.mimeType,
    };
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
