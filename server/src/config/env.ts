import path from 'path';
import { config as loadEnv } from 'dotenv';
import { z } from 'zod';

loadEnv();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  /** Host to bind (default all interfaces). */
  HOST: z.string().default('0.0.0.0'),
  /** Logged on startup; omit trailing slash. Defaults to http://localhost:{PORT}. */
  PUBLIC_BASE_URL: z.string().url().optional(),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  /** Comma-separated browser origins, or `*` to allow any (reflects request origin; use with care in production). */
  CORS_ORIGIN: z.string().default('*'),
  REDIS_URL: z.string().optional(),
  MAIL_HOST: z.string().optional(),
  MAIL_PORT: z.coerce.number().optional(),
  MAIL_SECURE: z
    .string()
    .optional()
    .transform(v => v === 'true'),
  MAIL_USER: z.string().optional(),
  MAIL_PASS: z.string().optional(),
  MAIL_FROM: z.string().default('Hospital CM <noreply@localhost>'),
  /** Directory for complaint uploads (relative to process cwd unless absolute). */
  UPLOAD_DIR: z.string().default('uploads'),
  /** Max size per attachment in MB (multipart complaints). */
  UPLOAD_MAX_FILE_MB: z.coerce.number().positive().max(100).default(5),
  /** Local TF-IDF confidence 0–1; below this, run Transformers.js zero-shot if HF enabled. */
  CATEGORIZATION_LOCAL_THRESHOLD: z.coerce.number().min(0).max(1).default(0.42),
  /** Load DistilBERT-MNLI (etc.) via Transformers.js on demand when local confidence is low. */
  CATEGORIZATION_HF_ENABLED: z.preprocess(v => {
    if (v === undefined || v === '') return true;
    if (typeof v === 'boolean') return v;
    const s = String(v).trim().toLowerCase();
    return s === 'true' || s === '1' || s === 'yes';
  }, z.boolean()),
  /** Hugging Face model id for `@xenova/transformers` zero-shot-classification. */
  CATEGORIZATION_HF_MODEL: z.string().default('Xenova/distilbert-base-uncased-mnli'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

/** Value for the `cors` package `origin` option: `true` = wildcard behavior, else one or many allowed origins. */
export function getCorsOriginOption(): boolean | string | string[] {
  const raw = env.CORS_ORIGIN.trim();
  if (!raw || raw === '*') return true;
  const origins = raw
    .split(',')
    .map(s => s.trim())
    .filter((s): s is string => s.length > 0);
  if (origins.length === 0) return true;
  return origins.length === 1 ? origins[0]! : origins;
}

export const isRedisEnabled = Boolean(parsed.data.REDIS_URL?.trim());
export const isMailConfigured = Boolean(parsed.data.MAIL_HOST?.trim());

export function getUploadRoot(): string {
  const dir = env.UPLOAD_DIR.trim() || 'uploads';
  return path.isAbsolute(dir) ? dir : path.resolve(process.cwd(), dir);
}
