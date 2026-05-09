export type Role = 'patient' | 'staff' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  /** From account profile when present */
  phone?: string;
  role: Role;
  /** Staff: department record id from API */
  departmentId?: string;
  department?: string;
  jobTitle?: string;
  avatar?: string;
}

/** Department row from API (management + selects). */
export interface DepartmentEntity {
  id: string;
  name: string;
  head: string;
  description: string;
  staffCount: number;
}

export type ComplaintStatus = 'Submitted' | 'Under Review' | 'In Progress' | 'Resolved' | 'Closed';
export type ComplaintCategory = 'Hygiene' | 'Billing' | 'Staff Behavior' | 'Service Delay' | 'Equipment' | 'Other';
export type Department = 'Emergency' | 'Billing' | 'Pharmacy' | 'Laboratory' | 'Ward' | 'Administration';
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface ComplaintAttachment {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}

export interface Complaint {
  id: string;
  ticketId: string;
  patientName: string;
  email: string;
  phone: string;
  category: ComplaintCategory;
  department: string;
  description: string;
  status: ComplaintStatus;
  priority: Priority;
  assignedStaffId?: string;
  assignedStaffName?: string;
  createdAt: string;
  updatedAt: string;
  responses: ComplaintResponse[];
  attachments: ComplaintAttachment[];
}

export interface ComplaintResponse {
  id: string;
  complaintId: string;
  responderId: string;
  responderName: string;
  responderRole: Role;
  message: string;
  createdAt: string;
  statusChange?: ComplaintStatus;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  departmentId: string;
  department: string;
  role: string;
  avatar?: string;
  assignedComplaints: number;
  resolvedComplaints: number;
  joinDate?: string;
}

export interface Notification {
  id: string;
  type: 'assignment' | 'resolution' | 'response' | 'new_complaint';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  complaintId?: string;
}

export interface DepartmentStats {
  department: string;
  totalComplaints: number;
  resolved: number;
  pending: number;
}

export interface ComplaintFormData {
  patientName: string;
  email: string;
  phone: string;
  /** Required when automaticCategory is false */
  category?: ComplaintCategory;
  /** AI assigns category, priority, and department from description (local NLP + optional HF for category) */
  automaticCategory?: boolean;
  /** Required when automaticCategory is false */
  departmentId?: string;
  description: string;
  files?: File[];
}
