import { supabase } from '../../../db/supabase';
import type { StorageService, UploadFile } from '../types';

export class SupabaseStorageService implements StorageService {
  private bucket = 'generations';

  async upload(
    buffer: Buffer,
    filename: string,
    mimeType: string,
  ): Promise<string> {
    const { error } = await supabase.storage
      .from(this.bucket)
      .upload(filename, buffer, { contentType: mimeType, upsert: false });

    if (error) throw new Error(`Failed to upload image: ${error.message}`);

    return filename;
  }

  async delete(filename: string): Promise<void> {
    const { error } = await supabase.storage
      .from(this.bucket)
      .remove([filename]);

    if (error) throw new Error(`Failed to delete image: ${error.message}`);
  }

  async getSignedUrl(filename: string, expiresIn = 3600): Promise<string> {
    const { data, error } = await supabase.storage
      .from(this.bucket)
      .createSignedUrl(filename, expiresIn);

    if (error || !data)
      throw new Error(`Failed to get signed URL: ${error?.message}`);

    return data.signedUrl;
  }

  async download(path: string): Promise<Buffer> {
    const { data, error } = await supabase.storage
      .from(this.bucket)
      .download(path);

    if (error || !data)
      throw new Error(`Failed to download file: ${error?.message}`);

    const arrayBuffer = await data.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  async uploadInputMedia(
    generationId: string,
    file: UploadFile,
  ): Promise<string> {
    const ext = file.mimetype.split('/')[1];
    const path = `inputs/${generationId}.${ext}`;
    await this.upload(file.buffer, path, file.mimetype);
    return path;
  }
}
