import React, { useState } from 'react';
import api from '../utils/api';
import { X, UserPlus, Loader2, CheckCircle } from 'lucide-react';

const AddDoctorModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    specialty: '',
    gender: 'Male',
    credentials: '',
    experienceYears: 0,
    fee: 100
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/admin/doctors', formData);
      setSuccessData(response.data);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create doctor account');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccessData(null);
    setFormData({
      fullName: '',
      email: '',
      specialty: '',
      gender: 'Male',
      credentials: '',
      experienceYears: 0,
      fee: 100
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-60 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <UserPlus className="text-blue-500" /> Onboard New Doctor
            </h2>
            <p className="text-sm text-gray-400">Create a new doctor account in the system</p>
          </div>
          <button onClick={handleClose} className="text-gray-500 hover:text-white transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {successData ? (
          <div className="p-12 text-center">
            <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-white w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Doctor Onboarded Successfully!</h3>
            <p className="text-gray-400 mb-4">Please share the following temporary credentials securely.</p>
            <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 inline-block text-left">
              <p className="text-gray-400 text-sm">Email: <span className="text-white font-bold">{formData.email}</span></p>
              <p className="text-gray-400 text-sm">Temp Password: <span className="text-white font-bold">{successData.tempPassword}</span></p>
            </div>
            <div className="mt-8">
              <button onClick={handleClose} className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-bold transition-all">
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-900/30 border border-red-500 text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Dr. John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="doctor@clinic.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Specialty</label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="e.g. Cardiologist"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Credentials</label>
                <input
                  type="text"
                  value={formData.credentials}
                  onChange={(e) => setFormData({...formData, credentials: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="e.g. MD, FACC"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Experience (Years)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({...formData, experienceYears: Number(e.target.value)})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Default Consultation Fee ($)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.fee}
                  onChange={(e) => setFormData({...formData, fee: Number(e.target.value)})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Doctor Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddDoctorModal;
