import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { env } from '../config/env';

const ALLOWED_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
]);

function isMultipart(req: Request): boolean {
  return String(req.headers['content-type'] || '').toLowerCase().includes('multipart/form-data');
}

const complaintMulter = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 5,
    fileSize: env.UPLOAD_MAX_FILE_MB * 1024 * 1024,
  },
  fileFilter(_req, file, cb) {
    if (ALLOWED_MIMES.has(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error(`Unsupported file type: ${file.mimetype}`));
  },
});

/** Parse multipart fields + optional `files` when Content-Type is multipart; otherwise no-op. */
export function complaintUploadWhenMultipart(req: Request, res: Response, next: NextFunction): void {
  if (!isMultipart(req)) {
    next();
    return;
  }
  complaintMulter.array('files', 5)(req, res, next);
}
