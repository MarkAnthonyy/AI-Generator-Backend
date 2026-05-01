import { Queue } from 'bullmq';
import { redisConnection } from '../redis';
import { QueueNames } from '../types';
import type { MediaJobData } from './types';

export const mediaQueue = new Queue<MediaJobData>(QueueNames.MEDIA, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 100 },
  },
});

export const addMediaJob = (data: MediaJobData, priority: number = 1) => {
  return mediaQueue.add(data.type, data, { priority });
};
