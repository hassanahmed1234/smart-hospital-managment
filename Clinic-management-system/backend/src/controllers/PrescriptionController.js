import Prescription from '../models/Prescription.js';
import Appointment, { AppointmentStatus } from '../models/Appointment.js';
import DoctorProfile from '../models/DoctorProfile.js';

export const createPrescription = async (req, res) => {
  console.log('REQ ===>>',req.user)
  try {
    const { appointmentId, patientId, medications, generalNotes } = req.body;
    
    const doctor = await DoctorProfile.findOne({ userId: req.user?.id });
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });

    // Check if appointment is COMPLETED
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment || appointment.status !== AppointmentStatus.COMPLETED) {
      return res.status(400).json({ message: 'Prescription can only be created for completed appointments' });
    }

    const prescription = new Prescription({
      appointmentId,
      doctorId: doctor._id,
      patientId,
      medications,
      generalNotes
    });

    await prescription.save();

    // Link prescription to appointment
    appointment.prescriptionId = prescription._id;
    await appointment.save();

    res.status(201).json({ message: 'Prescription created successfully', prescription });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPrescriptionByAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const prescription = await Prescription.findOne({ appointmentId })
      .populate('doctorId', 'fullName specialty credentials')
      .populate('patientId', 'fullName dob gender');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.status(200).json(prescription);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
