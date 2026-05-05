import User from "../models/User.js";
import DoctorProfile from "../models/DoctorProfile.js";
import PatientProfile from "../models/PatientProfile.js";

export const getCurrentUser = async (req, res) => {
  try {
    // 1. Pehle base user dhundo (Auth data ke liye)
    const baseUser = await User.findById(req.user.id)
    

    if (!baseUser || baseUser.isDeleted) {
      return res.status(404).json({ message: "User not found" });
    }

    let profileData = null;

    // 2. Role ke mutabiq relevant collection se data fetch karo
    if (baseUser.role === "DOCTOR") {
      profileData = await DoctorProfile.findOne({ userId: baseUser._id });
    } else if (baseUser.role === "PATIENT") {
      profileData = await PatientProfile.findOne({ userId: baseUser._id });
    }
    

    // 3. Base User aur Profile Data ko merge kardo
    // .toObject() isliye taake hum extra fields add kar sakein
    const userWithProfile = {
      ...baseUser.toObject(),
      ...(profileData ? profileData.toObject() : {}),
    };

    res.status(200).json({
      success: true,
      user: userWithProfile,
    });

  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// module.exports = {
//   getCurrentUser,
// };