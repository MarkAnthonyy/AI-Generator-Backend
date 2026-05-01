import type { Request, Response } from 'express';
import { supabase } from '../db/supabase';
import { logger } from '../lib/logger';
import { addMediaJob } from '../queue/media/queue';
import { createModerationService } from '../services/moderation/moderationService';
import { createStorageService } from '../services/storage/storageService';

const storage = createStorageService();
const moderation = createModerationService();

export const generateController = async (req: Request, res: Response) => {
  const { prompt, conversationId } = req.body;
  const file = req.file;

  // ZOD Validation

  const { data: activeGeneration } = await supabase
    .from('generations')
    .select('id')
    .eq('user_id', req.user!.id)
    .in('status', ['queued', 'processing'])
    .single();

  if (activeGeneration) {
    return res
      .status(429)
      .json({ error: 'You already have a generation in progress' });
  }

  try {
    const { flagged, reason } = await moderation.moderate(prompt);
    if (flagged) {
      return res.status(400).json({
        error: `${reason}`,
      });
    }
  } catch (err) {
    logger.error('Moderation check failed', err);
    // fail open — allow generation if moderation is unavailable
  }

  const { data: conversation } = await supabase
    .from('conversations')
    .select('id')
    .eq('id', conversationId)
    .eq('owner_id', req.user!.id)
    .single();

  if (!conversation) {
    return res
      .status(403)
      .json({ error: 'Conversation not found or access denied' });
  }

  const { data: generation, error } = await supabase
    .from('generations')
    .insert({
      prompt,
      status: 'queued',
      type: 'image',
      user_id: req.user!.id,
      conversation_id: conversationId,
    })
    .select()
    .single();

  if (error || !generation) {
    return res.status(500).json({ error: 'Failed to create generation' });
  }

  let inputMediaPaths: string[] | undefined;

  if (file) {
    const path = await storage.uploadInputMedia(generation.id, file);
    inputMediaPaths = [path];
  }

  await addMediaJob({
    generationId: generation.id,
    type: 'image',
    prompt,
    inputMediaPaths,
  });

  return res.json({ jobId: generation.id });
};
