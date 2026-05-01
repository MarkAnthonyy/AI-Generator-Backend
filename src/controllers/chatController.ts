import axios from 'axios';
import type { Request, Response } from 'express';
import { ENV } from '../config/env';
import { logger } from '../lib/logger';

export const chatController = async (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await axios.post(`${ENV.CHAT_SERVICE_URL}/assist`, {
      prompt: message,
    });

    const data = response.data;

    if (!data?.decision) {
      return res
        .status(500)
        .json({ error: 'Invalid response from AI service' });
    }

    return res.json({ success: true, decision: data.decision });
  } catch (err) {
    logger.error('Chat service error', err);
    if (axios.isAxiosError(err)) {
      return res
        .status(500)
        .json({ error: err.response?.data || 'AI service error' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};
