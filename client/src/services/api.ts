import { apiFetch, apiFetchOptional, API_BASE, getToken, ApiRequestError } from '@/lib/apiClient';
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

  submit: (data: ComplaintFormData): Promise<Complaint> => {
    const phone = data.phone?.trim() || '000-000-0000';
    const auto = Boolean(data.automaticCategory);
    const files = data.files?.filter(f => f.size > 0) ?? [];
    if (files.length > 0) {
      const fd = new FormData();
      fd.append('patientName', data.patientName);
      fd.append('email', data.email);
      fd.append('phone', phone);
      fd.append('automaticCategory', auto ? 'true' : 'false');
      if (!auto && data.category) fd.append('category', data.category);
      if (!auto && data.departmentId) fd.append('departmentId', data.departmentId);
      fd.append('description', data.description);
      for (const f of files) {
        fd.append('files', f);
      }
      return apiFetch<Complaint>('/complaints', { method: 'POST', skipAuth: true, body: fd });
    }
    return apiFetch<Complaint>('/complaints', {
      method: 'POST',
      skipAuth: true,
      body: JSON.stringify({
        patientName: data.patientName,
        email: data.email,
        phone,
        automaticCategory: auto,
        ...(!auto && data.category ? { category: data.category } : {}),
        ...(!auto && data.departmentId ? { departmentId: data.departmentId } : {}),
        description: data.description,
      }),
    });
  },

  downloadAttachment: async (complaintId: string, attachmentId: string, fileName: string): Promise<void> => {
    const url = `${API_BASE}/complaints/${encodeURIComponent(complaintId)}/attachments/${encodeURIComponent(attachmentId)}/download`;
    const headers = new Headers();
    const t = getToken();
    if (t) headers.set('Authorization', `Bearer ${t}`);
    const res = await fetch(url, { headers });
    if (!res.ok) {
      const text = await res.text();
      let json: { error?: { code?: string; message?: string } } | undefined;
      try {
        json = text ? (JSON.parse(text) as { error?: { code?: string; message?: string } }) : undefined;
      } catch {
        /* ignore */
      }
      const code = json?.error?.code ?? 'REQUEST_FAILED';
      const message = json?.error?.message ?? 'Download failed';
      throw new ApiRequestError(res.status, code, message);
    }
    const blob = await res.blob();
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = href;
    a.download = fileName;
    a.rel = 'noopener';
    a.click();
    URL.revokeObjectURL(href);
  },

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
  phone?: string;
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
