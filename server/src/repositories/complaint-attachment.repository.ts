import { prisma } from '../infrastructure/prisma';

export type ComplaintAttachmentRow = {
  id: string;
  complaintId: string;
  originalName: string;
  storedFileName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: Date;
};

type CreateInput = {
  complaintId: string;
  originalName: string;
  storedFileName: string;
  mimeType: string;
  sizeBytes: number;
};

export class ComplaintAttachmentRepository {
  async create(data: CreateInput): Promise<ComplaintAttachmentRow> {
    // Delegate exists after `npx prisma generate` (ComplaintAttachment model).
    return (prisma as unknown as { complaintAttachment: { create: (args: { data: CreateInput }) => Promise<ComplaintAttachmentRow> } }).complaintAttachment.create({ data });
  }

  async findByIdAndComplaint(attachmentId: string, complaintId: string): Promise<ComplaintAttachmentRow | null> {
    return (prisma as unknown as { complaintAttachment: { findFirst: (args: { where: { id: string; complaintId: string } }) => Promise<ComplaintAttachmentRow | null> } }).complaintAttachment.findFirst({
      where: { id: attachmentId, complaintId },
    });
  }
}

export const complaintAttachmentRepository = new ComplaintAttachmentRepository();
