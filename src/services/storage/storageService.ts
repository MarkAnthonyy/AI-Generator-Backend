import { ENV } from '../../config/env';
import { SupabaseStorageService } from './Supabase/supabaseStorage';
import type { StorageService } from './types';

export function createStorageService(): StorageService {
  switch (ENV.STORAGE_PROVIDER) {
    case 's3':
      throw new Error('S3 not implemented yet');
    case 'cloudflare':
      throw new Error('Cloudflare R2 not implemented yet');
    case 'supabase':
    default:
      return new SupabaseStorageService();
  }
}
