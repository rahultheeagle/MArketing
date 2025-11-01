import { createClient } from 'redis';

let client: any;

try {
  client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });
  client.on('error', (err) => console.log('Redis Client Error', err));
} catch (error) {
  console.warn('Redis connection failed, using memory cache');
  // Mock Redis for development
  const memoryCache = new Map();
  client = {
    get: (key: string) => Promise.resolve(memoryCache.get(key) || null),
    set: (key: string, value: string) => Promise.resolve(memoryCache.set(key, value)),
    setEx: (key: string, ttl: number, value: string) => Promise.resolve(memoryCache.set(key, value)),
    del: (key: string) => Promise.resolve(memoryCache.delete(key)),
    incr: (key: string) => Promise.resolve((memoryCache.get(key) || 0) + 1),
    expire: (key: string, ttl: number) => Promise.resolve(true),
    publish: (channel: string, message: string) => Promise.resolve(1),
    connect: () => Promise.resolve(),
    isOpen: true
  };
}

export const redis = client;

export const connectRedis = async () => {
  try {
    if (!client.isOpen) {
      await client.connect();
    }
  } catch (error) {
    console.warn('Redis connection failed, using memory cache');
  }
};

export const cacheKey = (key: string) => `campaignpulse:${key}`;

export const rateLimitKey = (ip: string, endpoint: string) => 
  `ratelimit:${ip}:${endpoint}`;

export const pubSubChannels = {
  METRICS_UPDATE: 'metrics:update',
  CAMPAIGN_EVENT: 'campaign:event',
  COMPETITOR_UPDATE: 'competitor:update'
};