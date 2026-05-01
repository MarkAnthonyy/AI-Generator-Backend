export type MediaJobData = {
  generationId: string;
  type: 'image' | 'video' | 'audio';
  prompt: string;
  inputMediaPaths?: string[]; // multiple input files for img2img, img2video, etc.
};
