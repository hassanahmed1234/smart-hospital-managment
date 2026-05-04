import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User, { UserRole, UserStatus } from './models/User.js';
import PatientProfile from './models/PatientProfile.js';
import DoctorProfile from './models/DoctorProfile.js';
import AdminProfile from './models/AdminProfile.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clinicos');
    

    // Clear existing data
    await User.deleteMany({});
    await PatientProfile.deleteMany({});
    await DoctorProfile.deleteMany({});
    await AdminProfile.deleteMany({});
    

    // 1. Create Admin
    const adminUser = new User({
      email: 'admin@clinicos.com',
      passwordHash: 'Password@123',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    });
    await adminUser.save();

    await AdminProfile.create({
      userId: adminUser._id.toString(),
      fullName: 'System Admin',
    });

    // 2. Create Doctor
    const doctorUser = new User({
      email: 'doctor@clinicos.com',
      passwordHash: 'password@123',
      role: UserRole.DOCTOR,
      status: UserStatus.ACTIVE,
    });
    await doctorUser.save();


    await DoctorProfile.create({
      userId: doctorUser._id.toString(),
      fullName: 'Dr. Sarah Connor',
      specialty: 'Cardiologist',
      gender: 'Female',
      credentials: 'MD, FACC',
      experienceYears: 12,
      fee: 150,
      schedule: [
        { day: 'Monday', startTime: '09:00', endTime: '17:00', slotDuration: 30 },
        { day: 'Wednesday', startTime: '09:00', endTime: '17:00', slotDuration: 30 },
      ],
    });

    // 3. Create Patient
    const patientUser = new User({
      email: 'patient@clinicos.com',
      passwordHash: 'Password@123',
      role: UserRole.PATIENT,
      status: UserStatus.ACTIVE,
    });
    await patientUser.save();

    await PatientProfile.create({
      userId: patientUser._id.toString(),
      fullName: 'John Doe',
      dob: new Date('1990-01-01'),
      gender: 'Male',
      phone: '1234567890',
      bloodGroup: 'O+',
      emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '0987654321',
      },
    });

    
    
    
    
    
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
