import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const AdminProfileSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    userId: { type: String, ref: 'User', required: true, unique: true },
    fullName: { type: String, required: true },
    twoFactorSecret: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('AdminProfile', AdminProfileSchema);
