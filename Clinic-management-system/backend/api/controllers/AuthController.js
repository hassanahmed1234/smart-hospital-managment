import User, { UserRole, UserStatus } from '../models/User.js';
import PatientProfile from '../models/PatientProfile.js';
import { generateToken, generateRefreshToken } from '../services/AuthService.js';
import mongoose from 'mongoose';

export const registerPatient = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    // Simplified validation (can be replaced with manual checks if needed)
    const validatedData = req.body;

    const userExists = await User.findOne({ email: validatedData.email });
    if (userExists) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const user = new User({
      email: validatedData.email,
      passwordHash: validatedData.password,
      role: UserRole.PATIENT,
      status: UserStatus.UNVERIFIED,
    });

    await user.save({ session });

    const patientProfile = new PatientProfile({
      userId: user._id,
      fullName: validatedData.fullName,
      dob: new Date(validatedData.dob),
      gender: validatedData.gender,
      phone: validatedData.phone,
      bloodGroup: validatedData.bloodGroup,
      emergencyContact: validatedData.emergencyContact,
    });

    await patientProfile.save({ session });

    await session.commitTransaction();
    session.endSession();

    // In a real app, send verification email here

    res.status(201).json({
      message: 'Registration successful. Please verify your email.',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user || user.isDeleted) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: user._id.toString(), role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id.toString(), role: user.role });

    res.cookie("token", token);

    res.status(200).json({
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
