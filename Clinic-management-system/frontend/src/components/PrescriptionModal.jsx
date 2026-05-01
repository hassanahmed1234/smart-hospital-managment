import React, { useState } from 'react';
import api from '../utils/api';
import { X, Plus, Trash2, FileText, Loader2, CheckCircle } from 'lucide-react';

const PrescriptionModal = ({ appointmentId, patientId, isOpen, onClose }) => {
  const [medications, setMedications] = useState([
    { name: '', dosage: '', frequency: '', duration: '' }
  ]);
  const [generalNotes, setGeneralNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '' }]);
  };

  const removeMedication = (index) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleMedChange = (index, field, value) => {
    const newMeds = [...medications];
    newMeds[index] = { ...newMeds[index], [field]: value };
    setMedications(newMeds);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/prescriptions', {
        appointmentId,
        patientId,
        medications,
        generalNotes
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create prescription');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <FileText className="text-blue-500" /> Issue Prescription
            </h2>
            <p className="text-sm text-gray-400">Add medications and instructions for the patient</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {success ? (
            <div className="py-20 text-center">
              <div className="bg-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-900/20">
                <CheckCircle className="text-white w-10 h-10" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">Prescription Issued!</h3>
              <p className="text-gray-400">The patient can now view and download their prescription.</p>
            </div>
          ) : (
            <form id="presc-form" onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-900/30 border border-red-500 text-red-400 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider text-xs">Medications</h3>
                  <button 
                    type="button" 
                    onClick={addMedication}
                    className="flex items-center gap-2 text-blue-500 hover:text-blue-400 text-sm font-bold transition-all"
                  >
                    <Plus className="w-4 h-4" /> Add Another
                  </button>
                </div>

                {medications.map((med, index) => (
                  <div key={index} className="bg-gray-950 p-6 rounded-2xl border border-gray-800 relative group transition-all hover:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Medication Name</label>
                        <input
                          type="text"
                          value={med.name}
                          onChange={(e) => handleMedChange(index, 'name', e.target.value)}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Paracetamol 500mg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Dosage</label>
                        <input
                          type="text"
                          value={med.dosage}
                          onChange={(e) => handleMedChange(index, 'dosage', e.target.value)}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="1 tablet"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Frequency</label>
                        <input
                          type="text"
                          value={med.frequency}
                          onChange={(e) => handleMedChange(index, 'frequency', e.target.value)}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="3 times a day"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Duration</label>
                        <input
                          type="text"
                          value={med.duration}
                          onChange={(e) => handleMedChange(index, 'duration', e.target.value)}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="5 days"
                          required
                        />
                      </div>
                    </div>
                    {medications.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeMedication(index)}
                        className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-all lg:opacity-0 lg:group-hover:opacity-100"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-500 uppercase mb-2">General Notes & Instructions</label>
                <textarea
                  value={generalNotes}
                  onChange={(e) => setGeneralNotes(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-white h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Any additional advice for the patient..."
                />
              </div>
            </form>
          )}
        </div>

        {!success && (
          <div className="p-6 border-t border-gray-800 bg-gray-900/50 flex justify-end">
            <button
              type="submit"
              form="presc-form"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-3 rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Issue Prescription'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionModal;
