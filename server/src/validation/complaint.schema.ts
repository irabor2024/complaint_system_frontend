import { z } from 'zod';

const categoryValues = [
  'Hygiene',
  'Billing',
  'Staff Behavior',
  'Service Delay',
  'Equipment',
  'Other',
] as const;

export const submitComplaintSchema = z.object({
  patientName: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().min(5).max(40),
  category: z.enum(categoryValues),
  departmentId: z.string().min(1),
  description: z.string().min(10).max(10000),
});

export const updateComplaintStatusSchema = z.object({
  status: z.enum(['Submitted', 'Under Review', 'In Progress', 'Resolved', 'Closed']),
});

export const addComplaintResponseSchema = z.object({
  message: z.string().min(1).max(10000),
});

export const assignComplaintSchema = z.object({
  staffUserId: z.string().min(1),
});

export const setPrioritySchema = z.object({
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
});

export const listComplaintsQuerySchema = z.object({
  departmentId: z.string().optional(),
  status: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});
