import { Router } from 'express';

import { protect, authorize } from '../middleware/AuthMiddleware.js';
import { UserRole } from '../models/User.js';
import { getAllPatients } from '../controllers/PatientController.js';

const router = Router();

// Publicly accessible for logged-in patients
router.get('/', protect, getAllPatients);


export default router;
