import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { disconnectRedis } from './config/redis';
import { disconnectPrisma } from './infrastructure/prisma';

const app = createApp();
const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, 'HTTP server listening');
});

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
