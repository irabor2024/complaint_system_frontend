import type { ErrorRequestHandler } from 'express';
import { handleErrorForResponse } from '../common/errors/serializeError';
import { logger } from '../config/logger';

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (res.headersSent) {
    logger.error({ err, requestId: req.requestId }, 'Error handler invoked after response was sent');
    return;
  }

  handleErrorForResponse(err, req, res);
};
