import type { Job } from 'bullmq';
import { Worker } from 'bullmq';
import { supabase } from '../../db/supabase';
import { logger } from '../../lib/logger';
import { createService } from '../../services/inference/aiService';
import { createStorageService } from '../../services/storage/storageService';
import { processJob } from '../../workers/jobWorker';
import { redisConnection } from '../redis';
import { QueueNames } from '../types';
import type { MediaJobData } from './types';

const inferenceService = createService();
const storage = createStorageService();

const processor = async (job: Job<MediaJobData>) => {
  const { generationId, prompt, inputMediaPaths } = job.data;

  let image: Buffer | undefined;

  if (inputMediaPaths && inputMediaPaths.length > 0) {
    image = await storage.download(inputMediaPaths[0]);
  }

  const { promptId } = await inferenceService.generate({ prompt, image });

  await processJob(generationId, promptId);
};

export const mediaWorker = new Worker<MediaJobData>(
  QueueNames.MEDIA,
  processor,
  {
    connection: redisConnection,
    concurrency: 1,
    lockDuration: 10 * 60 * 1000,
  },
);

mediaWorker.on('failed', async (job, err) => {
  logger.error(`Job ${job?.id} failed`, err);

  if (job?.data?.generationId) {
    await supabase
      .from('generations')
      .update({
        status: 'failed',
        error: 'Generation failed. Please try again.',
        updated_at: new Date(),
      })
      .eq('id', job.data.generationId);
  }
});
