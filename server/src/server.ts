import type { Server } from 'http';
import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { disconnectRedis } from './config/redis';
import { disconnectPrisma, prisma } from './infrastructure/prisma';

async function verifyDatabaseConnection(): Promise<void> {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    logger.fatal({ err }, 'Database connection failed');
    await prisma.$disconnect().catch(() => undefined);
    process.exit(1);
  }
}

function getPublicBaseUrl(): string {
  const base = env.PUBLIC_BASE_URL?.replace(/\/$/, '') ?? `http://localhost:${env.PORT}`;
  return base;
}

async function start(): Promise<void> {
  await verifyDatabaseConnection();

  const app = createApp();
  const publicBaseUrl = getPublicBaseUrl();

  const server = app.listen(env.PORT, env.HOST, () => {
    logger.info(
      {
        database: 'connected',
        serverUrl: publicBaseUrl,
        apiUrl: `${publicBaseUrl}/api/v1`,
        healthUrl: `${publicBaseUrl}/health`,
        bind: { host: env.HOST, port: env.PORT },
      },
      'Server started successfully'
    );
  });

  registerShutdown(server);
}

function registerShutdown(server: Server): void {
  async function shutdown(signal: string) {
    logger.info({ signal }, 'Shutting down');
    await new Promise<void>((resolve, reject) => {
      server.close(err => (err ? reject(err) : resolve()));
    });
    await disconnectRedis();
    await disconnectPrisma();
    process.exit(0);
  }

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

void start().catch(err => {
  logger.fatal({ err }, 'Server failed to start');
  process.exit(1);
});
