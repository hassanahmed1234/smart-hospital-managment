import DoctorProfile from '../models/DoctorProfile.js';
import { UserStatus } from '../models/User.js';

export const getAllDoctors = async (req, res) => {
  
  try {
    const { specialty, gender, minFee, maxFee, search } = req.query;
    console.log(req.query)

    const query = { isDeleted: false };

    if (specialty) {
      query.specialty = specialty;
    }

    if (gender) {
      query.gender = gender;
    }

    if (minFee || maxFee) {
      query.fee = {};
      if (minFee) query.fee.$gte = Number(minFee);
      if (maxFee) query.fee.$lte = Number(maxFee);
    }

    if (search) {
      query.fullName = { $regex: search, $options: 'i' };
    }

    // Only get doctors whose users are ACTIVE
    const activeDoctors = await DoctorProfile.find(query).populate({
      path: 'userId',
      match: { status: UserStatus.ACTIVE, isDeleted: false }
    });

    // Filter out profiles where populated userId is null (not ACTIVE or deleted)
    const filteredDoctors = activeDoctors.filter(doc => doc.userId !== null);

    res.status(200).json(filteredDoctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await DoctorProfile.findById(req.params.id).populate({
      path: 'userId',
      select: 'email status'
    });

    if (!doctor || doctor.isDeleted) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getDoctorSchedule = async (req, res) => {
  try {
    const doctor = await DoctorProfile.findOne({ userId: req.params.userId });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    res.status(200).json(doctor.schedule);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateDoctorSchedule = async (req, res) => {
  try {
    const { schedule } = req.body;
    const doctor = await DoctorProfile.findOneAndUpdate(
      { userId: req.params.userId },
      { schedule },
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    res.status(200).json({ message: 'Schedule updated successfully', schedule: doctor.schedule });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateConsultationFee = async (req, res) => {
  try {
    const { fee } = req.body;
    const doctor = await DoctorProfile.findOneAndUpdate(
      { userId: req.params.userId },
      { fee },
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    res.status(200).json({ message: 'Consultation fee updated successfully', fee: doctor.fee });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
