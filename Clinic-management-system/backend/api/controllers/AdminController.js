import mongoose from 'mongoose';
import User from '../models/User.js';
import PatientProfile from '../models/PatientProfile.js';
import DoctorProfile from '../models/DoctorProfile.js';

export const createDoctor = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { email, fullName, specialty, gender, credentials, experienceYears, fee } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({ message: 'A user with this email already exists' });
    }

    // Generate a temporary password (e.g., TempPass123!)
    const tempPassword ='password@123';

    const user = new User({
      email,
      passwordHash: tempPassword,
      role: 'DOCTOR',
      status: 'ACTIVE',
    });

    await user.save({ session });

    const doctorProfile = new DoctorProfile({
      userId: user._id.toString(),
      fullName,
      specialty,
      gender,
      credentials,
      experienceYears: Number(experienceYears) || 0,
      fee: Number(fee) || 100,
      schedule: [] 
    });

    await doctorProfile.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: 'Doctor account created successfully',
      tempPassword, // In a real app, email this to the doctor
      doctor: doctorProfile
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-passwordHash');
    
    // We can fetch profiles too for a richer view
    const patients = await PatientProfile.find({});
    const doctors = await DoctorProfile.find({});

    const enrichedUsers = users.map(user => {
      const u = user.toObject();
      if (u.role === 'PATIENT') {
        u.profile = patients.find(p => p.userId === u._id?.toString());
      } else if (u.role === 'DOCTOR') {
        u.profile = doctors.find(d => d.userId === u._id?.toString());
      }
      return u;
    });

    res.status(200).json(enrichedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
export const getAllDoctorsForAdmin = async (req, res) => {
  try {
    
    const doctors = await DoctorProfile.find({});

   
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
export const getAllPendingUsers = async (req, res) => {
  try {
    const users = await User.find({status : 'UNVERIFIED'})
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const user = await User.findByIdAndUpdate(id, { status }, { new: true }).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.status(200).json({ message: 'User status updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
