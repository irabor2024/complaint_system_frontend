import { z } from 'zod';

export const createDepartmentSchema = z.object({
  name: z.string().min(1).max(120),
  head: z.string().max(120).optional(),
  description: z.string().max(2000).optional(),
});

export const updateDepartmentSchema = z
  .object({
    name: z.string().min(1).max(120).optional(),
    head: z.string().max(120).optional(),
    description: z.string().max(2000).optional(),
    staffCount: z.coerce.number().int().min(0).optional(),
  })
  .refine(data => Object.values(data).some(v => v !== undefined), {
    message: 'At least one field is required',
  });
