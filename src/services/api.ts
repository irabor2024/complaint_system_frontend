import { complaints, staffMembers, notifications } from '@/mock-data';
import { Complaint, ComplaintFormData, ComplaintStatus, StaffMember, Notification } from '@/types';

let localComplaints = [...complaints];
let localNotifications = [...notifications];
let nextId = localComplaints.length + 1;

export const complaintService = {
  getAll: (): Promise<Complaint[]> => Promise.resolve([...localComplaints]),

  getById: (id: string): Promise<Complaint | undefined> =>
    Promise.resolve(localComplaints.find(c => c.id === id)),

  getByTicketId: (ticketId: string): Promise<Complaint | undefined> =>
    Promise.resolve(localComplaints.find(c => c.ticketId.toLowerCase() === ticketId.toLowerCase())),

  getByStaffId: (staffId: string): Promise<Complaint[]> =>
    Promise.resolve(localComplaints.filter(c => c.assignedStaffId === staffId)),

  submit: (data: ComplaintFormData): Promise<Complaint> => {
    nextId++;
    const ticketNum = String(nextId).padStart(4, '0');
    const complaint: Complaint = {
      id: `c${nextId}`,
      ticketId: `CMP-2026-${ticketNum}`,
      patientName: data.patientName,
      email: data.email,
      phone: data.phone,
      category: data.category,
      department: data.department,
      description: data.description,
      status: 'Submitted',
      priority: 'Medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: [],
    };
    localComplaints = [complaint, ...localComplaints];
    return Promise.resolve(complaint);
  },

  updateStatus: (id: string, status: ComplaintStatus, responderName: string): Promise<Complaint | undefined> => {
    const idx = localComplaints.findIndex(c => c.id === id);
    if (idx === -1) return Promise.resolve(undefined);
    localComplaints[idx] = {
      ...localComplaints[idx],
      status,
      updatedAt: new Date().toISOString(),
      responses: [
        ...localComplaints[idx].responses,
        {
          id: `r-${Date.now()}`,
          complaintId: id,
          responderId: 's1',
          responderName,
          responderRole: 'staff',
          message: `Status updated to ${status}.`,
          createdAt: new Date().toISOString(),
          statusChange: status,
        },
      ],
    };
    return Promise.resolve(localComplaints[idx]);
  },

  addResponse: (id: string, message: string, responderName: string): Promise<Complaint | undefined> => {
    const idx = localComplaints.findIndex(c => c.id === id);
    if (idx === -1) return Promise.resolve(undefined);
    localComplaints[idx] = {
      ...localComplaints[idx],
      updatedAt: new Date().toISOString(),
      responses: [
        ...localComplaints[idx].responses,
        {
          id: `r-${Date.now()}`,
          complaintId: id,
          responderId: 's1',
          responderName,
          responderRole: 'staff',
          message,
          createdAt: new Date().toISOString(),
        },
      ],
    };
    return Promise.resolve(localComplaints[idx]);
  },
};

export const staffService = {
  getAll: (): Promise<StaffMember[]> => Promise.resolve([...staffMembers]),
  getById: (id: string): Promise<StaffMember | undefined> =>
    Promise.resolve(staffMembers.find(s => s.id === id)),
};

export const notificationService = {
  getAll: (): Promise<Notification[]> => Promise.resolve([...localNotifications]),
  markAsRead: (id: string): Promise<void> => {
    localNotifications = localNotifications.map(n => n.id === id ? { ...n, read: true } : n);
    return Promise.resolve();
  },
  getUnreadCount: (): Promise<number> =>
    Promise.resolve(localNotifications.filter(n => !n.read).length),
};
