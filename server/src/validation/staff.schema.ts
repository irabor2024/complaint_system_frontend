import { z } from 'zod';

export const createStaffSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  departmentId: z.string().min(1),
  jobTitle: z.string().max(120).optional(),
});
