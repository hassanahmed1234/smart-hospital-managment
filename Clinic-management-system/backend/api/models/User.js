import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export const UserRole = {
  PATIENT: 'PATIENT',
  DOCTOR: 'DOCTOR',
  ADMIN: 'ADMIN',
};

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  UNVERIFIED: 'UNVERIFIED',
};

const UserSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.PATIENT },
    status: { type: String, enum: Object.values(UserStatus), default: UserStatus.UNVERIFIED },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Encrypt password before saving
UserSchema.pre('save', async function () {
  const user = this;
  if (!user.isModified('passwordHash')) {
    return;
  }
  const salt = await bcrypt.genSalt(12);
  user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
});

// Match password
UserSchema.methods.comparePassword = async function (password) {
  const user = this;
  return await bcrypt.compare(password, user.passwordHash);
};

export default mongoose.model('User', UserSchema);
