import axios from 'axios';
import { ENV } from '../config/env';
import { supabase } from '../db/supabase';
import { listenToComfyUI } from '../services/inference/ComfyUI/lib/comfyWebSocket';
import { createStorageService } from '../services/storage/storageService';

const storage = createStorageService();

async function downloadImage(
  filename: string,
  type: string,
  subfolder: string,
): Promise<Buffer> {
  const params = new URLSearchParams({ filename, type, subfolder });
  const response = await axios.get(
    `${ENV.API_URL}/image?${params.toString()}`,
    {
      responseType: 'arraybuffer',
      headers: { 'x-api-key': ENV.GPU_KEY },
    },
  );
  return Buffer.from(response.data);
}

async function saveOutput(generationId: string, buffer: Buffer): Promise<void> {
  const filename = `${generationId}.png`;

  await storage.upload(buffer, filename, 'image/png');

  const publicUrl = `${ENV.SUPABASE_URL}/storage/v1/object/public/generations/${filename}`;

  const { error } = await supabase.from('outputs').insert({
    generation_id: generationId,
    url: publicUrl,
    metadata: { filename },
  });

  if (error) throw new Error('Failed to create output record');
}

export async function processJob(generationId: string, promptId: string) {
  try {
    await new Promise<void>((resolve, reject) => {
      listenToComfyUI(promptId, {
        onExecuting: async () => {
          await supabase
            .from('generations')
            .update({ status: 'processing', updated_at: new Date() })
            .eq('id', generationId);
        },

        onExecuted: async (outputs) => {
          try {
            const imageNode = Object.values(outputs).find(
              (node) => !!node?.images?.length,
            );

            const outputImage = imageNode?.images?.[0];

            if (!outputImage?.filename) {
              reject(new Error('No image returned from ComfyUI'));
              return;
            }

            const buffer = await downloadImage(
              outputImage.filename,
              outputImage.type,
              outputImage.subfolder ?? '',
            );

            await saveOutput(generationId, buffer);

            await supabase
              .from('generations')
              .update({ status: 'done', updated_at: new Date() })
              .eq('id', generationId);

            resolve();
          } catch (err) {
            reject(err);
          }
        },

        onError: reject,
      });
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    await supabase
      .from('generations')
      .update({ status: 'failed', error: message, updated_at: new Date() })
      .eq('id', generationId);
  }
}
