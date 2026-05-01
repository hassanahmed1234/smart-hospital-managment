import PatientProfile from '../models/PatientProfile.js';
import { UserStatus } from '../models/User.js';

export const getAllPatients = async (req, res) => {
  console.log('Backend')
  try {
  
    // Only get doctors whose users are ACTIVE
    const activePatients = await PatientProfile.find()


    res.status(200).json(activePatients);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};