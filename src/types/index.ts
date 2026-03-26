export type Role = 'patient' | 'staff' | 'admin';

export type ComplaintStatus = 'Submitted' | 'Under Review' | 'In Progress' | 'Resolved' | 'Closed';
export type ComplaintCategory = 'Hygiene' | 'Billing' | 'Staff Behavior' | 'Service Delay' | 'Equipment' | 'Other';
export type Department = 'Emergency' | 'Billing' | 'Pharmacy' | 'Laboratory' | 'Ward' | 'Administration';
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Complaint {
  id: string;
  ticketId: string;
  patientName: string;
  email: string;
  phone: string;
  category: ComplaintCategory;
  department: Department;
  description: string;
  status: ComplaintStatus;
  priority: Priority;
  assignedStaffId?: string;
  assignedStaffName?: string;
  createdAt: string;
  updatedAt: string;
  responses: ComplaintResponse[];
  attachments?: string[];
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
  department: Department;
  role: 'staff' | 'admin';
  avatar?: string;
  assignedComplaints: number;
  resolvedComplaints: number;
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
  department: Department;
  totalComplaints: number;
  resolved: number;
  pending: number;
}

export interface ComplaintFormData {
  patientName: string;
  email: string;
  phone: string;
  category: ComplaintCategory;
  department: Department;
  description: string;
  attachments?: FileList;
}
