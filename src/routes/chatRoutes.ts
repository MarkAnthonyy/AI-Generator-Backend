import { Router } from 'express';
import { chatController } from '../controllers/chatController';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { chatSchema } from '../schemas/chatSchema';

const router = Router();

router.post('/', requireAuth, validate(chatSchema), chatController);

export default router;
