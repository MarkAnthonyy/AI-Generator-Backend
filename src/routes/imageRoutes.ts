import axios from 'axios';
import { Router } from 'express';
import type { Request, Response } from 'express';
import { ENV } from '../config/env';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const { filename, type, subfolder } = req.query;

  if (!filename || typeof filename !== 'string') {
    return res.status(400).json({ error: 'filename is required' });
  }

  if (
    filename.includes('..') ||
    (typeof subfolder === 'string' && subfolder.includes('..'))
  ) {
    return res.status(400).json({ error: 'Invalid path' });
  }

  try {
    const response = await axios.get(`${ENV.GPU_PROXY_URL}/view`, {
      params: { filename, type, subfolder },
      responseType: 'stream',
      headers: { 'x-api-key': ENV.GPU_KEY },
    });

    const contentType = response.headers['content-type'] || 'image/png';
    res.setHeader('Content-Type', contentType);
    response.data.pipe(res);
  } catch (err) {
    const status =
      axios.isAxiosError(err) && err.response?.status
        ? err.response.status
        : 500;
    res.status(status).json({ error: 'Failed to fetch image' });
  }
});

export default router;
