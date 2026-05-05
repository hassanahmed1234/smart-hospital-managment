import MedicalRecord from '../models/MedicalRecord.js';
import DataUpdateReq, { UpdateRequestStatus } from '../models/DataUpdateReq.js';
import DoctorProfile from '../models/DoctorProfile.js';
import PatientProfile from '../models/PatientProfile.js';
import { logAudit } from '../utils/audit.js';
import Prescription from '../models/Prescription.js';

export const getMyMedicalRecord = async (req, res) => {
  
  try {
    const patient = await PatientProfile.findOne({ userId: req.user?.id });
 
    if (!patient) return res.status(404).json({ message: 'Patient profile not found' });

    const record = await Prescription.findOne({ patientId: patient._id })
      .populate('doctorId', 'fullName specialty');

    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMedicalRecord = async (req, res) => {
  try {
    const { patientId } = req.params;
    const record = await Prescription.findOne({ patientId })
      .populate('clinicalNotesHistory.doctorId', 'fullName specialty');

    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const submitUpdateReq = async (req, res) => {
  try {
    const { patientId, field, oldValue, newValue, justification } = req.body;
    
    const doctor = await DoctorProfile.findOne({ userId: req.user?.id });
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });

    const updateReq = new DataUpdateReq({
      doctorId: doctor._id,
      patientId,
      field,
      oldValue,
      newValue,
      justification
    });

    await updateReq.save();

    res.status(201).json({ message: 'Update request submitted for admin approval', updateReq });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const adminApproveUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, adminReason } = req.body;

    const updateReq = await DataUpdateReq.findById(id);
    if (!updateReq) return res.status(404).json({ message: 'Request not found' });

    if (action === 'APPROVE') {
      const field = updateReq.field;
      const newValue = updateReq.newValue;

      await MedicalRecord.findOneAndUpdate(
        { patientId: updateReq.patientId },
        { [field]: newValue },
        { upsert: true }
      );

      updateReq.status = UpdateRequestStatus.APPROVED;
    } else {
      updateReq.status = UpdateRequestStatus.REJECTED;
    }

    updateReq.adminReason = adminReason;
    await updateReq.save();

    // Log the audit event
    await logAudit(
      req.user?.id,
      req.user?.role,
      action,
      'MedicalRecordUpdate',
      id,
      { field: updateReq.field, newValue: updateReq.newValue, status: updateReq.status },
      String(req.ip)
    );

    res.status(200).json({ message: `Update request ${action.toLowerCase()}d`, updateReq });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPendingUpdates = async (req, res) => {
  try {
    const updates = await DataUpdateReq.find({ status: UpdateRequestStatus.PENDING })
      .populate('doctorId', 'fullName')
      .populate('patientId', 'fullName');
    res.status(200).json(updates);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
