import { ENV } from '../../config/env';
import { logger } from '../../lib/logger';
import { HuggingFaceModerationService } from './HuggingFace/huggingFaceModerationService';
import { keywordCheck } from './keywordCheck';
import type { ModerationService } from './types';

export function createModerationService(): ModerationService {
  return {
    async moderate(text: string) {
      // keywords always run first — absolute blocks
      const keywordResult = keywordCheck(text);
      if (keywordResult.flagged) return keywordResult;

      // API handles context-based detection
      try {
        switch (ENV.MODERATION_PROVIDER) {
          case 'huggingface':
            return await new HuggingFaceModerationService().moderate(text);
          default:
            return { flagged: false };
        }
      } catch (err) {
        logger.error('Moderation API failed', err);
        return { flagged: false };
      }
    },
  };
}
