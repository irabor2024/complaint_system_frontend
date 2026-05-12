import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(120),
  phone: z.preprocess(
    val => (typeof val === 'string' && val.trim() === '' ? undefined : val),
    z.string().trim().min(5).max(40).optional()
  ),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(128),
});

export const twoFactorLoginVerifySchema = z.object({
  tempToken: z.string().min(1),
  code: z.string().min(4).max(16),
});

export const twoFactorSetupCompleteSchema = z.object({
  code: z.string().min(4).max(16),
});

export const twoFactorDisableSchema = z.object({
  password: z.string().min(1).max(128),
});
