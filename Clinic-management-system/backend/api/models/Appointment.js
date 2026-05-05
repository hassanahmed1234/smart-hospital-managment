import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export const AppointmentStatus = {
  PENDING_ADMIN_APPROVAL: 'PENDING_ADMIN_APPROVAL',
  PENDING_DOCTOR_ACTION: 'PENDING_DOCTOR_ACTION',
  SCHEDULED: 'SCHEDULED',
  COMPLETED: 'COMPLETED',
  REJECTED_BY_ADMIN: 'REJECTED_BY_ADMIN',
  REJECTED_BY_DOCTOR: 'REJECTED_BY_DOCTOR',
  CANCELLED_BY_PATIENT: 'CANCELLED_BY_PATIENT',
};

const AppointmentSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    patientId: { type: String, ref: 'PatientProfile', required: true },
    doctorId: { type: String, ref: 'DoctorProfile', required: true },
    date: { type: Date, required: true },
    slotTime: { type: String, required: true },
    status: { type: String, enum: Object.values(AppointmentStatus), default: AppointmentStatus.PENDING_ADMIN_APPROVAL },
    reason: { type: String, required: true, minlength: 10 },
    adminNotes: { type: String },
    doctorNotes: { type: String },
    prescriptionId: { type: String, ref: 'Prescription' },
    invoiceId: { type: String, ref: 'Invoice' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Appointment', AppointmentSchema);
