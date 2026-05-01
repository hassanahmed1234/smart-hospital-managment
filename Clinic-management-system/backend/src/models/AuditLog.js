import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const AuditLogSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  actorId: { type: String, ref: 'User', required: true },
  actorRole: { type: String, required: true },
  action: { type: String, required: true },
  entityType: { type: String, required: true },
  entityId: { type: String, required: true },
  payloadDiff: { type: mongoose.Schema.Types.Mixed },
  ipAddress: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('AuditLog', AuditLogSchema);
