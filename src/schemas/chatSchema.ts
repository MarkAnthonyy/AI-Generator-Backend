import { z } from 'zod';

export const chatSchema = z.object({
  message: z
    .string()
    .min(2, 'Message is too short — please provide more detail')
    .max(10000, 'Message is too long')
    .trim(),
});
