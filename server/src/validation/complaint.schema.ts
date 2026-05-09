import { z } from 'zod';

const categoryValues = [
  'Hygiene',
  'Billing',
  'Staff Behavior',
  'Service Delay',
  'Equipment',
  'Other',
] as const;

function boolFromForm(v: unknown): boolean {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') {
    const s = v.trim().toLowerCase();
    return s === 'true' || s === '1' || s === 'yes' || s === 'on';
  }
  return false;
}

export const submitComplaintSchema = z
  .object({
    patientName: z.string().min(1).max(120),
    email: z.string().email(),
    phone: z.string().min(5).max(40),
    category: z.preprocess(
      v => (v === '' || v === undefined || v === null ? undefined : v),
      z.enum(categoryValues).optional()
    ),
    automaticCategory: z.preprocess(boolFromForm, z.boolean().optional().default(false)),
    departmentId: z.preprocess(
      v => (v === '' || v === undefined || v === null ? undefined : v),
      z.string().min(1).optional()
    ),
    description: z.string().min(10).max(10000),
  })
  .superRefine((data, ctx) => {
    if (!data.automaticCategory) {
      if (!data.category) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'category is required when automatic routing is disabled',
          path: ['category'],
        });
      }
      if (!data.departmentId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'departmentId is required when automatic routing is disabled',
          path: ['departmentId'],
        });
      }
    }
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
