export interface GenerateInput {
  prompt: string;
  image?: Buffer;
}

export interface GenerateOutput {
  promptId: string;
}

export interface AIInferenceService {
  generate(input: GenerateInput): Promise<GenerateOutput>;
}
