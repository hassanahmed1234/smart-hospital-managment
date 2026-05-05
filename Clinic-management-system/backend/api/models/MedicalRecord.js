import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const MedicalRecordSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    patientId: { type: String, ref: 'PatientProfile', required: true, unique: true },
    allergies: [{ type: String }],
    chronicConditions: [{ type: String }],
    pastDiagnoses: [{ type: String }],
    clinicalNotesHistory: [
      {
        note: { type: String, required: true },
        doctorId: { type: String, ref: 'DoctorProfile', required: true },
        date: { type: Date, default: Date.now },
        appointmentId: { type: String, ref: 'Appointment', required: true },
      },
    ],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('MedicalRecord', MedicalRecordSchema);
