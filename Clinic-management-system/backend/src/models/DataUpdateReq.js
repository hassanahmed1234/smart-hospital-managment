import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export const UpdateRequestStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

const DataUpdateReqSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    doctorId: { type: String, ref: 'DoctorProfile', required: true },
    patientId: { type: String, ref: 'PatientProfile', required: true },
    field: { type: String, required: true },
    oldValue: { type: mongoose.Schema.Types.Mixed },
    newValue: { type: mongoose.Schema.Types.Mixed, required: true },
    justification: { type: String, required: true, minlength: 20 },
    status: { type: String, enum: Object.values(UpdateRequestStatus), default: UpdateRequestStatus.PENDING },
    adminReason: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('DataUpdateReq', DataUpdateReqSchema);
