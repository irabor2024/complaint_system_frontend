import type { ComplaintWithRelations } from '../../repositories/complaint.repository';
import {
  categoryToApi,
  complaintStatusToApi,
  priorityToApi,
  roleToApi,
} from './enums';

export function mapComplaintToDto(c: ComplaintWithRelations) {
  return {
    id: c.id,
    ticketId: c.ticketId,
    patientName: c.patientName,
    email: c.patientEmail,
    phone: c.patientPhone,
    category: categoryToApi(c.category),
    department: c.department.name,
    description: c.description,
    status: complaintStatusToApi(c.status),
    priority: priorityToApi(c.priority),
    assignedStaffId: c.assignedStaffId ?? undefined,
    assignedStaffName: c.assignedStaff?.name,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    responses: c.responses.map(r => ({
      id: r.id,
      complaintId: r.complaintId,
      responderId: r.authorId,
      responderName: r.author.name,
      responderRole: roleToApi(r.author.role),
      message: r.message,
      createdAt: r.createdAt.toISOString(),
      ...(r.statusChange ? { statusChange: complaintStatusToApi(r.statusChange) } : {}),
    })),
    attachments: [] as string[],
  };
}
