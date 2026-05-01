import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const required = [
  'GPU_PROXY_URL',
  'GPU_KEY',
  'API_URL',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_KEY',
  'REDIS_URL',
  'HUGGINGFACE_API_KEY',
] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const ENV = {
  PORT: process.env.PORT,
  GPU_PROXY_URL: process.env.GPU_PROXY_URL!,
  LOCALHOST_URL: process.env.LOCALHOST_URL,
  NEW_LOCALHOST_URL: process.env.NEW_LOCALHOST_URL,
  VERCEL_URL: process.env.VERCEL_URL,
  NEW_VERCEL_URL: process.env.NEW_VERCEL_URL,
  GPU_KEY: process.env.GPU_KEY!,
  API_URL: process.env.API_URL!,
  AI_SERVICE: process.env.AI_SERVICE ?? 'comfyui',
  STORAGE_PROVIDER: process.env.STORAGE_PROVIDER ?? 'supabase',
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
  NODE_ENV: process.env.NODE_ENV,
  REDIS_URL: process.env.REDIS_URL!,
  BULL_BOARD_USER: process.env.BULL_BOARD_USER ?? 'admin',
  BULL_BOARD_PASSWORD: process.env.BULL_BOARD_PASSWORD ?? 'admin',
  MODERATION_PROVIDER: process.env.MODERATION_PROVIDER ?? 'openai',
  HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY!,
  CHAT_SERVICE_URL:
    process.env.CHAT_SERVICE_URL ?? 'https://promptbot-vmir.onrender.com',
};
