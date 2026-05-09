import type { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import multer from 'multer';
import { ZodError } from 'zod';
import { env } from '../../config/env';
import { logger } from '../../config/logger';
import { AppError } from './AppError';

export type ApiErrorEnvelope = {
  success: false;
  error: {
    code: string;
    message: string;
    status: number;
    requestId: string;
    fields?: Record<string, string[]>;
    details?: unknown;
    stack?: string;
  };
};

export function getRequestId(req: Request): string {
  return req.requestId ?? 'unknown';
}

function zodToFieldErrors(err: ZodError): Record<string, string[]> {
  const flat = err.flatten();
  const fields: Record<string, string[]> = {};
  for (const [key, messages] of Object.entries(flat.fieldErrors)) {
    if (messages?.length) fields[key] = messages;
  }
  if (flat.formErrors.length) {
    fields._root = flat.formErrors;
  }
  return fields;
}

function prismaToClientError(err: Prisma.PrismaClientKnownRequestError): {
  status: number;
  code: string;
  message: string;
  fields?: Record<string, string[]>;
  details?: unknown;
} {
  switch (err.code) {
    case 'P2002': {
      const target = err.meta?.target;
      const columns = Array.isArray(target) ? target : target ? [String(target)] : [];
      const fields: Record<string, string[]> = {};
      for (const col of columns) {
        fields[col] = ['This value is already in use'];
      }
      return {
        status: 409,
        code: 'DUPLICATE_ENTRY',
        message: 'A record with this unique value already exists.',
        fields: Object.keys(fields).length ? fields : undefined,
        details: { prismaCode: err.code, target: columns },
      };
    }
    case 'P2025':
      return {
        status: 404,
        code: 'RECORD_NOT_FOUND',
        message: 'The requested record was not found or is no longer available.',
        details: { prismaCode: err.code },
      };
    case 'P2003':
      return {
        status: 400,
        code: 'INVALID_REFERENCE',
        message: 'A related record is missing or cannot be linked.',
        details: { prismaCode: err.code, fieldName: err.meta?.field_name },
      };
    case 'P2014':
      return {
        status: 400,
        code: 'RELATION_VIOLATION',
        message: 'This change would break a required relationship between records.',
        details: { prismaCode: err.code },
      };
    default:
      return {
        status: 400,
        code: 'DATABASE_ERROR',
        message: 'The request could not be completed due to a data constraint.',
        details: { prismaCode: err.code },
      };
  }
}

function isBodyParserJsonError(err: unknown): boolean {
  if (!(err instanceof SyntaxError)) return false;
  const e = err as { status?: number; type?: string };
  if (e.status === 400) return true;
  if (e.type === 'entity.parse.failed') return true;
  return false;
}

export function sendErrorResponse(
  req: Request,
  res: Response,
  status: number,
  code: string,
  message: string,
  extras?: { fields?: Record<string, string[]>; details?: unknown; stack?: string }
): void {
  const payload: ApiErrorEnvelope = {
    success: false,
    error: {
      code,
      message,
      status,
      requestId: getRequestId(req),
      ...(extras?.fields && Object.keys(extras.fields).length ? { fields: extras.fields } : {}),
      ...(extras?.details !== undefined ? { details: extras.details } : {}),
      ...(env.NODE_ENV === 'development' && extras?.stack ? { stack: extras.stack } : {}),
    },
  };
  res.status(status).json(payload);
}

export function handleErrorForResponse(err: unknown, req: Request, res: Response): void {
  if (err instanceof AppError) {
    sendErrorResponse(req, res, err.statusCode, err.code, err.message, {
      ...(err.fieldErrors ? { fields: err.fieldErrors } : {}),
      ...(err.details !== undefined ? { details: err.details } : {}),
    });
    return;
  }

  if (err instanceof ZodError) {
    const fields = zodToFieldErrors(err);
    sendErrorResponse(req, res, 400, 'VALIDATION_ERROR', 'Validation failed', {
      fields,
      details: { issues: err.issues },
    });
    return;
  }

  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? `Each file must be at most ${env.UPLOAD_MAX_FILE_MB} MB`
        : err.code === 'LIMIT_FILE_COUNT'
          ? 'Too many files attached'
          : err.message;
    sendErrorResponse(req, res, 400, 'UPLOAD_ERROR', message);
    return;
  }

  if (err instanceof Error && err.message.startsWith('Unsupported file type')) {
    sendErrorResponse(req, res, 400, 'INVALID_FILE_TYPE', err.message);
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const mapped = prismaToClientError(err);
    sendErrorResponse(req, res, mapped.status, mapped.code, mapped.message, {
      fields: mapped.fields,
      details: mapped.details,
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    sendErrorResponse(req, res, 400, 'INVALID_QUERY', 'Invalid data request', {
      details: env.NODE_ENV === 'development' ? { message: err.message } : undefined,
    });
    return;
  }

  if (isBodyParserJsonError(err)) {
    const hint = err instanceof Error ? err.message : String(err);
    sendErrorResponse(req, res, 400, 'INVALID_JSON', 'Request body must be valid JSON', {
      details: { hint },
    });
    return;
  }

  const message =
    err instanceof Error ? err.message : typeof err === 'string' ? err : 'An unexpected error occurred';

  logger.error(
    { err, requestId: getRequestId(req), path: req.path, method: req.method },
    'Internal server error'
  );

  sendErrorResponse(req, res, 500, 'INTERNAL_ERROR', 'An unexpected error occurred. Please try again later.', {
    ...(env.NODE_ENV === 'development'
      ? { stack: err instanceof Error ? err.stack : undefined, details: { message } }
      : {}),
  });
}
