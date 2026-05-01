export interface UploadFile {
  buffer: Buffer;
  mimetype: string;
}

export interface StorageService {
  upload(buffer: Buffer, filename: string, mimeType: string): Promise<string>;
  download(path: string): Promise<Buffer>;
  delete(filename: string): Promise<void>;
  getSignedUrl(filename: string, expiresIn?: number): Promise<string>;
  uploadInputMedia(generationId: string, file: UploadFile): Promise<string>;
}
