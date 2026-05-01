import { Router } from 'express';
import { getAllDoctors, getDoctorById, getDoctorSchedule, updateDoctorSchedule, updateConsultationFee } from '../controllers/DoctorController.js';
import { protect, authorize } from '../middleware/AuthMiddleware.js';
import { UserRole } from '../models/User.js';

const router = Router();

// Publicly accessible for logged-in patients
router.get('/', protect, getAllDoctors);
router.get('/:id', protect, getDoctorById);

// Doctor specific routes
router.get('/schedule/:userId', protect, authorize(UserRole.DOCTOR, UserRole.ADMIN), getDoctorSchedule);
router.put('/schedule/:userId', protect, authorize(UserRole.DOCTOR), updateDoctorSchedule);
router.put('/fee/:userId', protect, authorize(UserRole.DOCTOR), updateConsultationFee);

export default router;
