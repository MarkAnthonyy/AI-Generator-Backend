const BLOCKED_KEYWORDS = [
  'porn',
  'xxx',
  'nude',
  'naked',
  'explicit',
  'nsfw',
  'kill',
  'murder',
  'terrorist',
  'suicide',
  'rape',
  'child abuse',
  'cp',
  'lolita',
  'minor',
  'underage',
  'pornographic',
  'shota',
  'loli',
];

export function keywordCheck(text: string): {
  flagged: boolean;
  reason?: string;
} {
  const lower = text.toLowerCase();
  const matched = BLOCKED_KEYWORDS.find((word) => lower.includes(word));
  if (matched) {
    return {
      flagged: true,
      reason: 'Your prompt violates our community guidelines',
    };
  }
  return { flagged: false };
}
