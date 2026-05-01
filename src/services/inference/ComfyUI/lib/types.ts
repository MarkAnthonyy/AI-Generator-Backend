export type ComfyOutputNode = {
  images?: {
    filename: string;
    type: string;
    subfolder?: string;
  }[];
};

export type ComfyOutputs = Record<string, ComfyOutputNode>;
