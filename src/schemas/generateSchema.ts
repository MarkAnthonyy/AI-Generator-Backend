import { z } from 'zod';

export const generateSchema = z.object({
  prompt: z
    .union([
      z.string().min(1, 'Prompt is required').max(10000, 'Prompt too long'),
      z
        .record(z.string(), z.unknown())
        .refine(
          (val) => JSON.stringify(val).length <= 10000,
          'Prompt object too large',
        ),
    ])
    .transform((val) => (typeof val === 'object' ? JSON.stringify(val) : val)),
  conversationId: z
    .string()
    .regex(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      'Invalid conversation ID',
    ),
});
