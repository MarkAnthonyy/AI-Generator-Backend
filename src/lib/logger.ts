import { ENV } from '../config/env';

const isDev = ENV.NODE_ENV !== 'production';

export const logger = {
  info: (msg: string) => isDev && console.log(`[INFO] ${msg}`),
  warn: (msg: string, err?: unknown) =>
    isDev && console.warn(`[WARN] ${msg}`, err),
  error: (msg: string, err?: unknown) => console.error(`[ERROR] ${msg}`, err),
};
