import type { Request, Response } from 'express';

export const indexController = async (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to the Website',
  });
};
