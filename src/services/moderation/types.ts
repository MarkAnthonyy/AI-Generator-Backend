export interface ModerationService {
  moderate(text: string): Promise<{ flagged: boolean; reason?: string }>;
}
