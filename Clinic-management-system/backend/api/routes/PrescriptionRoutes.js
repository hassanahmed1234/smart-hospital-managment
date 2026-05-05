import { Router } from 'express';
import { createPrescription, getPrescriptionByAppointment } from '../controllers/PrescriptionController.js';
import { protect, authorize } from '../middleware/AuthMiddleware.js';
import { UserRole } from '../models/User.js';

const router = Router();

router.post('/', protect, authorize(UserRole.DOCTOR), createPrescription);
router.get('/appointment/:appointmentId', protect, getPrescriptionByAppointment);

export default router;
