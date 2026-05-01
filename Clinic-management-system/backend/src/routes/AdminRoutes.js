import { Router } from 'express';
import { getAllUsers, updateUserStatus, createDoctor, getAllPendingUsers } from '../controllers/AdminController.js';
import { protect, authorize } from '../middleware/AuthMiddleware.js';
import { UserRole } from '../models/User.js';

const router = Router();

router.post('/doctors', protect, authorize(UserRole.ADMIN), createDoctor);
router.get('/users', protect, authorize(UserRole.ADMIN), getAllUsers);
router.get('/pendingusers', protect, authorize(UserRole.ADMIN), getAllPendingUsers);
router.put('/users/:id/status', protect, authorize(UserRole.ADMIN), updateUserStatus);

export default router;
