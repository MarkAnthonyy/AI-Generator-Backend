import { Router } from 'express';
import { indexController } from '../controllers/indexControllers';

const router = Router();

router.get('/', indexController);

export default router;
