import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const PrescriptionSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    appointmentId: { type: String, ref: 'Appointment', required: true, unique: true },
    doctorId: { type: String, ref: 'DoctorProfile', required: true },
    patientId: { type: String, ref: 'PatientProfile', required: true },
    medications: [
      {
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: String, required: true },
        notes: { type: String },
      },
    ],
    generalNotes: { type: String },
    pdfUrl: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Prescription', PrescriptionSchema);
