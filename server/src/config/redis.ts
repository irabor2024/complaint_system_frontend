import Redis from 'ioredis';
import { env, isRedisEnabled } from './env';
import { logger } from './logger';

let client: Redis | null = null;

export function getRedis(): Redis | null {
  if (!isRedisEnabled || !env.REDIS_URL) return null;
  if (!client) {
    client = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 2,
      lazyConnect: true,
      enableReadyCheck: true,
    });
    client.on('error', err => {
      logger.error({ err }, 'Redis connection error');
    });
  }
  return client;
}

export async function disconnectRedis(): Promise<void> {
  if (client) {
    await client.quit().catch(() => undefined);
    client = null;
  }
}
