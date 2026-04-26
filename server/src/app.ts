import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { env } from './config/env';
import { logger } from './config/logger';
import { errorHandler } from './middleware/errorHandler';
import { apiRouter } from './routes';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(',').map(s => s.trim()),
      credentials: true,
    })
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(
    pinoHttp({
      logger,
      autoLogging: true,
      customLogLevel(_req, res, err) {
        if (res.statusCode >= 500 || err) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
      },
    })
  );

  app.get('/health', (_req, res) => {
    res.json({ ok: true, service: 'hospital-compliant-management-api' });
  });

  app.use('/api', apiRouter);

  app.use((_req, res) => {
    res.status(404).json({ success: false, code: 'NOT_FOUND', message: 'Route not found' });
  });

  app.use(errorHandler);

  return app;
}
