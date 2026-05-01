import axios from 'axios';
import { ENV } from '../../../config/env';
import type { ModerationService } from '../types';

export class HuggingFaceModerationService implements ModerationService {
  async moderate(text: string): Promise<{ flagged: boolean; reason?: string }> {
    const response = await axios.post(
      'https://router.huggingface.co/hf-inference/models/KoalaAI/Text-Moderation',
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${ENV.HUGGINGFACE_API_KEY}`,
        },
      },
    );

    const results = response.data[0] as { label: string; score: number }[];
    const threshold = 0.3;

    const flagged = results.find(
      (r) => r.label !== 'OK' && r.score >= threshold,
    );

    if (flagged) {
      return {
        flagged: true,
        reason: 'Huggingface Error',
      };
    }

    return { flagged: false };
  }
}
