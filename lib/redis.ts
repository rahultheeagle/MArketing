import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => console.log('Redis Client Error', err));

export const redis = client;

export const connectRedis = async () => {
  if (!client.isOpen) {
    await client.connect();
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