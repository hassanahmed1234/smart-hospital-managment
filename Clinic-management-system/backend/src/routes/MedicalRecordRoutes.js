import { Router } from 'express';
import { 
  getMedicalRecord,
  getMyMedicalRecord,
  submitUpdateReq, 
  adminApproveUpdate, 
  getPendingUpdates 
} from '../controllers/MedicalRecordController.js';
import { protect, authorize } from '../middleware/AuthMiddleware.js';
import { UserRole } from '../models/User.js';

const router = Router();

router.get('/my-record', protect, authorize(UserRole.PATIENT), getMyMedicalRecord);
router.get('/:patientId', protect, getMedicalRecord);
router.post('/update-request', protect, authorize(UserRole.DOCTOR), submitUpdateReq);
router.get('/admin/pending', protect, authorize(UserRole.ADMIN), getPendingUpdates);
router.post('/admin/approve/:id', protect, authorize(UserRole.ADMIN), adminApproveUpdate);

export default router;
