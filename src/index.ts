import express from 'express';

// Security
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// Admin Auth
import { basicAuth } from './middleware/basicAuth';

// Queueing
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import './queue';
import { mediaQueue } from './queue';

// Config
import { ENV } from './config/env';

// Logger
import { logger } from './lib/logger';

// Routes
import chatRoutes from './routes/chatRoutes';
import generateRoutes from './routes/generateRoutes';
import imageRoutes from './routes/imageRoutes';
import indexRoutes from './routes/indexRoutes';

const app = express();

const allowedOrigins = [
  ENV.LOCALHOST_URL,
  ENV.VERCEL_URL,
  ENV.NEW_LOCALHOST_URL,
  ENV.NEW_VERCEL_URL,
].filter(Boolean) as string[];

if (allowedOrigins.length === 0) {
  logger.warn(
    'No CORS origins configured. Cross-origin requests will be blocked.',
  );
}

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Bull Board
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');
createBullBoard({ queues: [new BullMQAdapter(mediaQueue)], serverAdapter });
app.use('/admin', basicAuth);
app.use('/admin/queues', serverAdapter.getRouter());

// Routes
app.use('/api', indexRoutes);
app.use('/api/generate', limiter, generateRoutes);
app.use('/api/chat', limiter, chatRoutes);
app.use('/image', limiter, imageRoutes);

app.listen(ENV.PORT, () =>
  logger.info('Server is up and running on PORT: 3000'),
);
