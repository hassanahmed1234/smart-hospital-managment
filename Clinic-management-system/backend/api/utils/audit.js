import AuditLog from '../models/AuditLog.js';

export const logAudit = async (
  actorId,
  actorRole,
  action,
  entityType,
  entityId,
  payloadDiff,
  ipAddress
) => {
  try {
    const log = new AuditLog({
      actorId,
      actorRole,
      action,
      entityType,
      entityId,
      payloadDiff,
      ipAddress,
    });
    await log.save();
  } catch (error) {
    console.error('Audit Log Error:', error);
  }
};
