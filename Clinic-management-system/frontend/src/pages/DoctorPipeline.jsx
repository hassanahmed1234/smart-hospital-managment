import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Clock, User, CheckCircle, XCircle, MessageSquare, Loader2, Calendar as CalendarIcon, Phone, CheckCircle2, FileText } from 'lucide-react';
import PrescriptionModal from '../components/PrescriptionModal';
import MedicalRecordModal from '../components/MedicalRecordModal';

const DoctorPipeline = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  
  const [selectedApp, setSelectedApp] = useState(null);
  const [isPrescModalOpen, setIsPrescModalOpen] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  const fetchPipeline = async () => {
    setLoading(true);
    try {
      const response = await api.get('/appointments/doctor-pipeline');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching doctor pipeline:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPipeline();
  }, []);

  const handleAction = async (id, action) => {
    setProcessingId(id);
    try {
      await api.post(`/appointments/doctor/${id}`, { action, doctorNotes: `Action ${action} taken by doctor` });
      fetchPipeline();
    } catch (error) {
      console.error(`Error ${action.toLowerCase()}ing appointment:`, error);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING_DOCTOR_ACTION':
        return <span className="bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded text-xs font-bold border border-yellow-500/20 uppercase">Awaiting Your Action</span>;
      case 'SCHEDULED':
        return <span className="bg-blue-500/10 text-blue-500 px-2 py-1 rounded text-xs font-bold border border-blue-500/20 uppercase">Scheduled</span>;
      case 'COMPLETED':
        return <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs font-bold border border-green-500/20 uppercase">Completed</span>;
      default:
        return <span className="bg-gray-500/10 text-gray-500 px-2 py-1 rounded text-xs font-bold border border-gray-500/20 uppercase">{status.replace(/_/g, ' ')}</span>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Appointment Pipeline</h1>
          <p className="text-gray-400 mt-1">Manage your upcoming consultations and patient requests</p>
        </div>
        <button onClick={fetchPipeline} className="bg-gray-900 hover:bg-gray-800 text-white p-2 rounded-lg border border-gray-800">
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      ) : appointments.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {appointments.map((app) => (
            <div key={app._id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all flex flex-col shadow-xl">
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-600/20 p-3 rounded-xl">
                      <User className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{app.patientId.fullName}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span>{app.patientId.gender}</span>
                        <span>•</span>
                        <span>{new Date().getFullYear() - new Date(app.patientId.dob).getFullYear()} Years Old</span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(app.status)}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-950 p-3 rounded-xl border border-gray-800">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1 flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> Date</p>
                    <p className="text-white font-medium">{new Date(app.date).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-gray-950 p-3 rounded-xl border border-gray-800">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Time</p>
                    <p className="text-white font-medium">{app.slotTime}</p>
                  </div>
                  <div className="bg-gray-950 p-3 rounded-xl border border-gray-800 col-span-2">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1 flex items-center gap-1"><Phone className="w-3 h-3" /> Contact</p>
                    <p className="text-white font-medium">{app.patientId.phone}</p>
                  </div>
                </div>

                <div className="mb-2">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-2 flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Reason for Visit</p>
                  <p className="text-sm text-gray-300 leading-relaxed italic">"{app.reason}"</p>
                </div>
              </div>

              {app.status === 'PENDING_DOCTOR_ACTION' ? (
                <div className="flex border-t border-gray-800">
                  <button
                    onClick={() => handleAction(app._id, 'REJECT')}
                    disabled={processingId === app._id}
                    className="flex-1 py-4 text-red-500 hover:bg-red-900/10 font-bold transition-all flex items-center justify-center gap-2 border-r border-gray-800"
                  >
                    <XCircle className="w-5 h-5" /> Reject
                  </button>
                  <button
                    onClick={() => handleAction(app._id, 'ACCEPT')}
                    disabled={processingId === app._id}
                    className="flex-1 py-4 text-green-500 hover:bg-green-900/10 font-bold transition-all flex items-center justify-center gap-2"
                  >
                    {processingId === app._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />} Accept
                  </button>
                </div>
              ) : app.status === 'SCHEDULED' ? (
                <div className="flex border-t border-gray-800">
                  <button
                    onClick={() => handleAction(app._id, 'COMPLETE')}
                    disabled={processingId === app._id}
                    className="flex-1 py-4 text-green-500 hover:bg-green-900/10 font-bold transition-all flex items-center justify-center gap-2 border-r border-gray-800"
                  >
                    {processingId === app._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />} Mark as Completed
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedApp(app);
                      setIsRecordModalOpen(true);
                    }}
                    className="flex-1 py-4 text-blue-500 hover:bg-blue-900/10 font-bold transition-all flex items-center justify-center gap-2"
                  >
                    Open Record
                  </button>
                </div>
              ) : (
                <div className="flex border-t border-gray-800">
                  <button 
                    onClick={() => {
                      setSelectedApp(app);
                      setIsRecordModalOpen(true);
                    }}
                    className="flex-1 py-4 text-blue-500 hover:bg-blue-900/10 font-bold transition-all flex items-center justify-center gap-2 border-r border-gray-800"
                  >
                    Open Record
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedApp(app);
                      setIsPrescModalOpen(true);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 transition-all flex items-center justify-center gap-2"
                  >
                    <FileText className="w-5 h-5" /> Issue Prescription
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-2xl">
          <p className="text-gray-400 text-lg">No appointments in your pipeline.</p>
        </div>
      )}

      {selectedApp && (
        <PrescriptionModal 
          appointmentId={selectedApp._id}
          patientId={selectedApp.patientId._id}
          isOpen={isPrescModalOpen}
          onClose={() => setIsPrescModalOpen(false)}
        />
      )}

      {selectedApp && (
        <MedicalRecordModal 
          patientId={selectedApp.patientId._id}
          patientName={selectedApp.patientId.fullName}
          isOpen={isRecordModalOpen}
          onClose={() => setIsRecordModalOpen(false)}
          userRole="DOCTOR"
        />
      )}
    </div>
  );
};

export default DoctorPipeline;
