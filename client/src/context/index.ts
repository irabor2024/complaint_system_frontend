export type Role = 'patient' | 'staff' | 'admin';

export type ComplaintStatus = 'submitted' | 'in-progress' | 'under-review' | 'resolved' | 'closed';
export type Priority = 'low' | 'medium' | 'high';
export type Category = 'billing' | 'treatment' | 'staff-behavior' | 'facilities' | 'wait-time' | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  department?: string;
}

export interface Department {
  id: string;
  name: string;
  head: string;
  staffCount: number;
  description: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  departmentId: string;
  department: string;
  role: string;
  assignedComplaints: number;
  resolvedComplaints: number;
  avatar?: string;
  joinDate: string;
}

export interface TimelineEvent {
  date: string;
  status: ComplaintStatus;
  note: string;
  by?: string;
}

export interface Response {
  id: string;
  by: string;
  role: Role;
  message: string;
  date: string;
}

export interface Complaint {
  id: string;
  ticketId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  category: Category;
  department: string;
  departmentId: string;
  priority: Priority;
  status: ComplaintStatus;
  description: string;
  attachments?: string[];
  assignedStaffId?: string;
  assignedStaffName?: string;
  createdAt: string;
  updatedAt: string;
  slaDeadline: string;
  timeline: TimelineEvent[];
  responses: Response[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  date: string;
  link?: string;
}

export interface DashboardStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  avgResolutionTime: string;
}
