import { Router } from 'express';
import { getCurrentUser } from '../controllers/CurrUser.js';
import { protect } from '../middleware/AuthMiddleware.js';

const router = Router();

router.post('/me',protect, getCurrentUser);

export default router;
