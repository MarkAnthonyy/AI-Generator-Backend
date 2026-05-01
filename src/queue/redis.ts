import IORedis from 'ioredis';
import { ENV } from '../config/env';

export const redisConnection = new IORedis(ENV.REDIS_URL, {
  maxRetriesPerRequest: null, // ← BullMQ requires this, Worker will break without it
});
