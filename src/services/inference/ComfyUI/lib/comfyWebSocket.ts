import axios from 'axios';
import WebSocket from 'ws';
import { ENV } from '../../../../config/env';
import { logger } from '../../../../lib/logger';
import type { ComfyOutputs } from './types';

const GPU_PROXY_WS_URL = ENV.GPU_PROXY_URL.replace(
  'https://',
  'wss://',
).replace('http://', 'ws://');

type ComfyWSCallbacks = {
  onExecuting: () => void;
  onExecuted: (outputs: ComfyOutputs) => void;
  onError: (err: Error) => void;
};

async function fetchComfyOutputs(promptId: string): Promise<ComfyOutputs> {
  const res = await axios.get(`${ENV.GPU_PROXY_URL}/history/${promptId}`, {
    timeout: 10000,
    headers: { 'x-api-key': ENV.GPU_KEY },
  });
  const record = res.data?.[promptId];
  if (!record?.outputs || Object.keys(record.outputs).length === 0) {
    throw new Error('No outputs in history');
  }
  return record.outputs as ComfyOutputs;
}

export function listenToComfyUI(
  promptId: string,
  callbacks: ComfyWSCallbacks,
): () => void {
  const TIMEOUT_MS = 300000;
  let resolved = false;
  let executingFired = false;

  const ws = new WebSocket(
    `${GPU_PROXY_WS_URL}/ws?clientId=${promptId}&x-api-key=${ENV.GPU_KEY}`,
  );

  const timeout = setTimeout(() => {
    if (!resolved) {
      resolved = true;
      ws.close();
      callbacks.onError(new Error('Timeout waiting for ComfyUI result'));
    }
  }, TIMEOUT_MS);

  const cleanup = () => {
    resolved = true;
    clearTimeout(timeout);
    ws.close();
  };

  ws.on('open', () => {
    logger.info('WS connected');
  });

  ws.on('message', async (data) => {
    try {
      const msg = JSON.parse(data.toString());

      if (
        msg.type === 'progress' &&
        msg.data?.prompt_id === promptId &&
        !executingFired
      ) {
        executingFired = true;
        callbacks.onExecuting();
      }

      if (
        msg.type === 'status' &&
        msg.data?.status?.exec_info?.queue_remaining === 0 &&
        executingFired &&
        !resolved
      ) {
        resolved = true;
        clearTimeout(timeout);
        ws.close();
        try {
          const outputs = await fetchComfyOutputs(promptId);
          callbacks.onExecuted(outputs);
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          logger.warn('Failed to parse WS message', message);
          if (!resolved) {
            cleanup();
            callbacks.onError(
              new Error('Failed to fetch history from ComfyUI'),
            );
          }
        }
      }

      if (msg.type === 'execution_error' && msg.data?.prompt_id === promptId) {
        if (!resolved) {
          cleanup();
          callbacks.onError(
            new Error(msg.data?.exception_message || 'ComfyUI execution error'),
          );
        }
      }
    } catch (err) {
      logger.warn('Failed to parse WS message', err);
    }
  });

  ws.on('error', (err) => {
    if (!resolved) {
      cleanup();
      callbacks.onError(err);
    }
  });

  ws.on('close', () => {
    if (!resolved) {
      cleanup();
      callbacks.onError(new Error('WS connection closed unexpectedly'));
    }
  });

  return cleanup;
}
