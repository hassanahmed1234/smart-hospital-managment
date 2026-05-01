import Appointment, { AppointmentStatus } from '../models/Appointment.js';
import PatientProfile from '../models/PatientProfile.js';
import DoctorProfile from '../models/DoctorProfile.js';
import { logAudit } from '../utils/audit.js';

export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, slotTime, reason } = req.body;
    const patient = await PatientProfile.findOne({ userId: req.user?.id });
    if (!patient) return res.status(404).json({ message: 'Patient profile not found' });

    const existingAppointment = await Appointment.findOne({
      doctorId,
      date: new Date(date),
      slotTime,
      status: { $nin: [AppointmentStatus.REJECTED_BY_ADMIN, AppointmentStatus.REJECTED_BY_DOCTOR, AppointmentStatus.CANCELLED_BY_PATIENT] }
    });

    if (existingAppointment) return res.status(400).json({ message: 'This slot is already booked or pending' });

    const appointment = new Appointment({
      patientId: patient._id,
      doctorId,
      date: new Date(date),
      slotTime,
      reason,
      status: AppointmentStatus.PENDING_ADMIN_APPROVAL
    });

    await appointment.save();
    res.status(201).json({ message: 'Appointment booked and awaiting admin approval', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const adminApproveReject = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, adminNotes } = req.body;

    const status = action === 'APPROVE' 
      ? AppointmentStatus.PENDING_DOCTOR_ACTION 
      : AppointmentStatus.REJECTED_BY_ADMIN;

    const appointment = await Appointment.findByIdAndUpdate(id, { status, adminNotes }, { new: true });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    await logAudit(req.user?.id, req.user?.role, action, 'Appointment', id, { status, adminNotes }, String(req.ip));

    res.status(200).json({ message: `Appointment ${action === 'APPROVE' ? 'approved' : 'rejected'} by admin`, appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const doctorAcceptReject = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, doctorNotes } = req.body;

    let status = AppointmentStatus.REJECTED_BY_DOCTOR;
    if (action === 'ACCEPT') status = AppointmentStatus.SCHEDULED;
    else if (action === 'COMPLETE') status = AppointmentStatus.COMPLETED;

    const appointment = await Appointment.findByIdAndUpdate(id, { status, doctorNotes }, { new: true });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    await logAudit(req.user?.id, req.user?.role, action, 'Appointment', id, { status, doctorNotes }, String(req.ip));

    res.status(200).json({ message: `Appointment action ${action} processed by doctor`, appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPatientAppointments = async (req, res) => {
  try {
    const patient = await PatientProfile.findOne({ userId: req.user?.id });
    if (!patient) return res.status(404).json({ message: 'Patient profile not found' });

    const appointments = await Appointment.find({ patientId: patient._id })
      .populate('doctorId', 'fullName specialty')
      .sort({ date: -1, slotTime: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAdminQueue = async (req, res) => {
  try {
    const appointments = await Appointment.find({ status: AppointmentStatus.PENDING_ADMIN_APPROVAL })
      .populate('patientId', 'fullName')
      .populate('doctorId', 'fullName specialty')
      .sort({ createdAt: 1 });
    console.log(appointments)
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getDoctorPipeline = async (req, res) => {
  try {
    const doctor = await DoctorProfile.findOne({ userId: req.user?.id });
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });

    const appointments = await Appointment.find({ 
      doctorId: doctor._id,
      status: { $in: [AppointmentStatus.PENDING_DOCTOR_ACTION, AppointmentStatus.SCHEDULED, AppointmentStatus.COMPLETED] }
    })
      .populate('patientId', 'fullName gender dob phone')
      .sort({ date: 1, slotTime: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
