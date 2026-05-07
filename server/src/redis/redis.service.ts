import { Injectable, Inject, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject('REDIS_CLIENT') private readonly client: Redis) {}

  async onModuleInit() {
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  getClient(): Redis {
    return this.client;
  }

  // Generic cache operations
  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as any;
    }
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    if (ttlSeconds) {
      await this.client.setex(key, ttlSeconds, serialized);
    } else {
      await this.client.set(key, serialized);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async delPattern(pattern: string): Promise<void> {
    let cursor = '0';
    do {
      const [newCursor, keys] = await this.client.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
      cursor = newCursor;
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } while (cursor !== '0');
  }

  // Job search caching - matches JobsService expectations
  async getCachedJobs(cacheKey: string): Promise<any[] | null> {
    return this.get<any[]>(`jobs:search:${cacheKey}`);
  }

  async setCachedJobs(cacheKey: string, jobs: any[], ttlSeconds = 3600): Promise<void> {
    await this.set(`jobs:search:${cacheKey}`, jobs, ttlSeconds);
  }

  async invalidateJobCache(userId: string): Promise<void> {
    await this.delPattern(`jobs:search:${userId}:*`);
  }

  // Search alerts
  async addSearchAlert(userId: string, searchId: string): Promise<void> {
    await this.client.sadd(`alerts:user:${userId}`, searchId);
    await this.client.sadd(`alerts:active`, searchId);
  }

  async removeSearchAlert(userId: string, searchId: string): Promise<void> {
    await this.client.srem(`alerts:user:${userId}`, searchId);
    await this.client.srem(`alerts:active`, searchId);
  }

  async getUserSearchAlerts(userId: string): Promise<string[]> {
    return this.client.smembers(`alerts:user:${userId}`);
  }

  async getAllActiveAlerts(): Promise<string[]> {
    return this.client.smembers(`alerts:active`);
  }

  // Rate limiting - matches JobsService expectations
  async incrementRateLimit(key: string, windowSeconds: number): Promise<number> {
    const count = await this.client.incr(key);
    if (count === 1) {
      await this.client.expire(key, windowSeconds);
    }
    return count;
  }

  // Deduplication
  async isDuplicateJob(sourceUrl: string): Promise<boolean> {
    const key = `jobs:seen:${this.hashUrl(sourceUrl)}`;
    const exists = await this.client.exists(key);
    if (!exists) {
      await this.client.setex(key, 86400 * 30, '1'); // 30 days
      return false;
    }
    return true;
  }

  async markJobAsSeen(sourceUrl: string): Promise<void> {
    const key = `jobs:seen:${this.hashUrl(sourceUrl)}`;
    await this.client.setex(key, 86400 * 30, '1');
  }

  private hashUrl(url: string): string {
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
      const char = url.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  // Health check
  async ping(): Promise<boolean> {
    try {
      const result = await this.client.ping();
      return result === 'PONG';
    } catch {
      return false;
    }
  }
}