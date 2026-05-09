import fs from 'node:fs';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { randomUUID } from 'crypto';
import { getCorsOriginOption, getUploadRoot } from './config/env';
import { logger } from './config/logger';
import { sendErrorResponse } from './common/errors/serializeError';
import { errorHandler } from './middleware/errorHandler';
import { exposeRequestIdMiddleware } from './middleware/exposeRequestId.middleware';
import { requestContextMiddleware } from './middleware/requestContext.middleware';
import { apiRouter } from './routes';

export function createApp() {
  const app = express();

  fs.mkdirSync(getUploadRoot(), { recursive: true });

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(
    cors({
      origin: getCorsOriginOption(),
      credentials: true,
      exposedHeaders: ['X-Request-Id'],
    })
  );
  app.use(requestContextMiddleware);
  app.use(exposeRequestIdMiddleware);
  app.use(
    pinoHttp({
      logger,
      autoLogging: true,
      genReqId: req => req.requestId ?? randomUUID(),
      customLogLevel(_req, res, err) {
        if (res.statusCode >= 500 || err) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
      },
    })
  );
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_req, res) => {
    res.json({ ok: true, service: 'hospital-compliant-management-api' });
  });

  app.use('/api', apiRouter);

  app.use((req, res) => {
    sendErrorResponse(req, res, 404, 'ROUTE_NOT_FOUND', 'The requested resource does not exist.');
  });

  app.use(errorHandler);

  return app;
}
