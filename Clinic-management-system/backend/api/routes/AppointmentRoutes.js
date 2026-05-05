import { Router } from 'express';
import { 
  bookAppointment, 
  adminApproveReject, 
  doctorAcceptReject, 
  getPatientAppointments, 
  getAdminQueue, 
  getDoctorPipeline 
} from '../controllers/AppointmentController.js';
import { protect, authorize } from '../middleware/AuthMiddleware.js';
import { UserRole } from '../models/User.js';

const router = Router();

router.post('/book', protect, authorize(UserRole.PATIENT), bookAppointment);
router.get('/my-appointments', protect, authorize(UserRole.PATIENT), getPatientAppointments);

router.post('/admin/:id', protect, authorize(UserRole.ADMIN), adminApproveReject);
router.get('/admin-queue', protect, authorize(UserRole.ADMIN), getAdminQueue);

router.post('/doctor/:id', protect, authorize(UserRole.DOCTOR), doctorAcceptReject);
router.get('/doctor-pipeline', protect, authorize(UserRole.DOCTOR), getDoctorPipeline);

export default router;
