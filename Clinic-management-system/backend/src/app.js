import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import dns from 'node:dns';
import authRoutes from './routes/AuthRoutes.js';
import doctorRoutes from './routes/DoctorRoutes.js';
import PatientsRoutes from './routes/PatientRoutes.js';
import appointmentRoutes from './routes/AppointmentRoutes.js';
import medicalRecordRoutes from './routes/MedicalRecordRoutes.js';
import prescriptionRoutes from './routes/PrescriptionRoutes.js';
import adminRoutes from './routes/AdminRoutes.js';

dotenv.config();

dns.setServers([
    '1.1.1.1','8.8.8.8'
]);

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/currentuser', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', PatientsRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/records', medicalRecordRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/admin', adminRoutes);

// Basic Route
app.use('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'ClinicOS API is running' });
});

export default app;
