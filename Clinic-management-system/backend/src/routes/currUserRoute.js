import { Router } from 'express';
import { getCurrentUser } from '../controllers/CurrUser.js';
import { protect } from '../middleware/AuthMiddleware.js';

const router = Router();

router.get('/me',protect, getCurrentUser);

export default router;
