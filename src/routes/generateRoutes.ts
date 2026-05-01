import { Router } from 'express';
import * as generateControllers from '../controllers/generateController';
import { requireAuth } from '../middleware/auth';
import { upload } from '../middleware/multer';
import { validate } from '../middleware/validate';
import { generateSchema } from '../schemas/generateSchema';

const router = Router();

router.post(
  '/',
  requireAuth,
  upload.single('image'),
  validate(generateSchema),
  generateControllers.generateController,
);

export default router;
