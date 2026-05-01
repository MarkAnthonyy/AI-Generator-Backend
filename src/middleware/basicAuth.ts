import type { NextFunction, Request, Response } from 'express';
import { ENV } from '../config/env';

export const basicAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Bull Board"');
    return res.status(401).send('Unauthorized');
  }

  const base64 = authHeader.split(' ')[1];
  const [user, password] = Buffer.from(base64, 'base64').toString().split(':');

  if (user !== ENV.BULL_BOARD_USER || password !== ENV.BULL_BOARD_PASSWORD) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Bull Board"');
    return res.status(401).send('Unauthorized');
  }

  next();
};
