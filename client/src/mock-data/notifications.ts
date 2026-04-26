import { Notification } from '@/types';

export const mockNotifications: Notification[] = [
  { id: 'n1', title: 'New Complaint', message: 'A new complaint TKT-1042 has been submitted', type: 'info', read: false, date: new Date().toISOString(), link: '/admin/complaints' },
  { id: 'n2', title: 'Complaint Resolved', message: 'TKT-1015 has been resolved by Dr. Wilson', type: 'success', read: false, date: new Date(Date.now() - 3600000).toISOString() },
  { id: 'n3', title: 'SLA Warning', message: 'TKT-1008 is approaching SLA deadline', type: 'warning', read: false, date: new Date(Date.now() - 7200000).toISOString() },
  { id: 'n4', title: 'Staff Response', message: 'Dr. Chen responded to TKT-1023', type: 'info', read: true, date: new Date(Date.now() - 86400000).toISOString() },
  { id: 'n5', title: 'Complaint Escalated', message: 'TKT-1031 has been escalated to department head', type: 'error', read: true, date: new Date(Date.now() - 172800000).toISOString() },
];
