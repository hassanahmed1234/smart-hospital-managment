import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const DoctorProfileSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    userId: { type: String, ref: 'User', required: true, unique: true },
    fullName: { type: String, required: true },
    specialty: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    credentials: { type: String, required: true },
    experienceYears: { type: Number, required: true },
    fee: { type: Number, required: true },
    schedule: [
      {
        day: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        slotDuration: { type: Number, default: 30 },
      },
    ],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('DoctorProfile', DoctorProfileSchema);
