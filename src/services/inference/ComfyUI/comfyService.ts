import axios from 'axios';
import FormData from 'form-data';
import { ENV } from '../../../config/env';
import type {
  AIInferenceService,
  GenerateInput,
  GenerateOutput,
} from '../types';
import { resolveWorkflowFile } from './lib/resolveWorkflowFile';
import { injectWorkflow } from './lib/workflowInjector';
import { loadWorkflowTemplate } from './lib/workflowLoader';

export class ComfyUIInferenceService implements AIInferenceService {
  async generate(input: GenerateInput): Promise<GenerateOutput> {
    const { prompt, image } = input;

    const type = image ? 'img2img' : 'txt2img';
    const workflow = loadWorkflowTemplate(resolveWorkflowFile(type));

    let imageName: string | undefined;

    if (image) {
      imageName = await this.uploadInputImage(image);
    }

    const finalWorkflow = injectWorkflow(
      workflow,
      { prompt },
      imageName ? { image: imageName } : undefined,
    );

    const response = await axios.post(
      `${ENV.GPU_PROXY_URL}/prompt`,
      { prompt: finalWorkflow },
      { timeout: 30000, headers: { 'x-api-key': ENV.GPU_KEY } },
    );

    const promptId = response.data.prompt_id;
    if (!promptId) throw new Error('No prompt_id returned from ComfyUI');

    return { promptId };
  }

  private async uploadInputImage(image: Buffer): Promise<string> {
    const form = new FormData();
    form.append('image', image, 'input.png');

    const res = await axios.post(`${ENV.GPU_PROXY_URL}/upload/image`, form, {
      headers: { ...form.getHeaders(), 'x-api-key': ENV.GPU_KEY },
      timeout: 30000,
    });

    if (!res.data?.name) throw new Error('Failed to upload image to ComfyUI');

    return res.data.name;
  }
}
