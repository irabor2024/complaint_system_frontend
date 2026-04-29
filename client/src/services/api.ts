import { apiFetch, apiFetchOptional } from '@/lib/apiClient';
import type {
  Complaint,
  ComplaintFormData,
  ComplaintStatus,
  DepartmentEntity,
  Notification,
  StaffMember,
} from '@/types';

export { getToken, setToken } from '@/lib/apiClient';
export { ApiRequestError } from '@/lib/apiClient';

export const complaintService = {
  getAll: (): Promise<Complaint[]> => apiFetch<Complaint[]>('/complaints'),

  getById: (id: string): Promise<Complaint | undefined> =>
    apiFetchOptional<Complaint>(`/complaints/${encodeURIComponent(id)}`),

  getByTicketId: (ticketId: string): Promise<Complaint | undefined> =>
    apiFetchOptional<Complaint>(`/complaints/track/${encodeURIComponent(ticketId)}`, { skipAuth: true }),

  getByStaffId: async (staffId: string): Promise<Complaint[]> => {
    const all = await complaintService.getAll();
    return all.filter(c => c.assignedStaffId === staffId);
  },

  submit: (data: ComplaintFormData): Promise<Complaint> =>
    apiFetch<Complaint>('/complaints', {
      method: 'POST',
      skipAuth: true,
      body: JSON.stringify({
        patientName: data.patientName,
        email: data.email,
        phone: data.phone?.trim() || '000-000-0000',
        category: data.category,
        departmentId: data.departmentId,
        description: data.description,
      }),
    }),

  updateStatus: (id: string, status: ComplaintStatus): Promise<Complaint> =>
    apiFetch<Complaint>(`/complaints/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  addResponse: (id: string, message: string): Promise<Complaint> =>
    apiFetch<Complaint>(`/complaints/${encodeURIComponent(id)}/responses`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),

  assignStaff: (id: string, staffUserId: string): Promise<Complaint> =>
    apiFetch<Complaint>(`/complaints/${encodeURIComponent(id)}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ staffUserId }),
    }),

  setPriority: (id: string, priority: Complaint['priority']): Promise<Complaint> =>
    apiFetch<Complaint>(`/complaints/${encodeURIComponent(id)}/priority`, {
      method: 'PATCH',
      body: JSON.stringify({ priority }),
    }),
};

export const departmentService = {
  list: (): Promise<DepartmentEntity[]> =>
    apiFetch<DepartmentEntity[]>('/departments', { skipAuth: true }),

  getById: (id: string): Promise<DepartmentEntity> =>
    apiFetch<DepartmentEntity>(`/departments/${encodeURIComponent(id)}`, { skipAuth: true }),

  create: (body: { name: string; head?: string; description?: string }): Promise<DepartmentEntity> =>
    apiFetch<DepartmentEntity>('/departments', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  update: (
    id: string,
    body: Partial<{ name: string; head: string; description: string; staffCount: number }>
  ): Promise<DepartmentEntity> =>
    apiFetch<DepartmentEntity>(`/departments/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  remove: (id: string): Promise<void> =>
    apiFetch<void>(`/departments/${encodeURIComponent(id)}`, { method: 'DELETE' }),
};

export const staffService = {
  getAll: (): Promise<StaffMember[]> => apiFetch<StaffMember[]>('/staff'),

  create: (body: {
    name: string;
    email: string;
    password: string;
    departmentId: string;
    jobTitle?: string;
  }): Promise<StaffMember> =>
    apiFetch<StaffMember>('/staff', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};

export const notificationService = {
  getAll: (): Promise<Notification[]> => apiFetch<Notification[]>('/notifications'),

  markAsRead: (id: string): Promise<void> =>
    apiFetch<void>(`/notifications/${encodeURIComponent(id)}/read`, { method: 'PATCH' }),

  getUnreadCount: (): Promise<number> =>
    apiFetch<{ count: number }>('/notifications/unread-count').then(r => r.count),
};

export type AuthUserDto = {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'staff' | 'admin';
  departmentId?: string;
  jobTitle?: string;
};

export const authApi = {
  login: (email: string, password: string): Promise<{ token: string; user: AuthUserDto }> =>
    apiFetch<{ token: string; user: AuthUserDto }>('/auth/login', {
      method: 'POST',
      skipAuth: true,
      body: JSON.stringify({ email, password }),
    }),

  me: (): Promise<AuthUserDto> => apiFetch<AuthUserDto>('/auth/me'),
};
