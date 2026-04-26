import { getRedis } from '../config/redis';
import { logger } from '../config/logger';

const DEFAULT_TTL_SEC = 60;

export class CacheService {
  async get<T>(key: string): Promise<T | null> {
    const redis = getRedis();
    if (!redis) return null;
    try {
      const raw = await redis.get(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch (err) {
      logger.warn({ err, key }, 'Cache get failed');
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSec = DEFAULT_TTL_SEC): Promise<void> {
    const redis = getRedis();
    if (!redis) return;
    try {
      await redis.set(key, JSON.stringify(value), 'EX', ttlSec);
    } catch (err) {
      logger.warn({ err, key }, 'Cache set failed');
    }
  }

  async del(key: string): Promise<void> {
    const redis = getRedis();
    if (!redis) return;
    try {
      await redis.del(key);
    } catch (err) {
      logger.warn({ err, key }, 'Cache del failed');
    }
  }
}

export const cacheService = new CacheService();

export const CacheKeys = {
  departmentsAll: 'departments:all',
} as const;
