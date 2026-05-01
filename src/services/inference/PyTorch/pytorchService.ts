import type {
  AIInferenceService,
  GenerateInput,
  GenerateOutput,
} from '../types';

export class PyTorchInferenceService implements AIInferenceService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async generate(input: GenerateInput): Promise<GenerateOutput> {
    throw new Error(
      'PyTorchInferenceService is not yet implemented. Set AI_SERVICE=comfyui or implement this service.',
    );
  }
}
