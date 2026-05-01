import { ENV } from '../../config/env';
import { ComfyUIInferenceService } from './ComfyUI/comfyService';
import { PyTorchInferenceService } from './PyTorch/pytorchService';
import type { AIInferenceService } from './types';

export function createService(): AIInferenceService {
  switch (ENV.AI_SERVICE) {
    case 'comfyui':
      return new ComfyUIInferenceService();
    case 'pytorch':
      return new PyTorchInferenceService();
    default:
      throw new Error(`Unknown AI_SERVICE: "${ENV.AI_SERVICE}"`);
  }
}
