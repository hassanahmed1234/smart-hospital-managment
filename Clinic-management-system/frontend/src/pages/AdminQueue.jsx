import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Clock, User, UserCheck, Loader2, AlertCircle, FileEdit, CheckCircle2, XCircle } from 'lucide-react';

const AdminQueue = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'appointments') {
        const response = await api.get('/appointments/admin-queue');
        console.log(response.data)
        setAppointments(response.data);
      } else {
        const response = await api.get('/records/admin/pending');
        setUpdates(response.data);
      }
    } catch (error) {
      console.error('Error fetching admin queue:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleAppointmentAction = async (id, action) => {
    setProcessingId(id);
    try {
      await api.post(`/appointments/admin/${id}`, { action, adminNotes: 'Processed via Admin Queue' });
      setAppointments(prev => prev.filter(app => app._id !== id));
    } catch (error) {
      console.error(`Error ${action.toLowerCase()}ing appointment:`, error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleUpdateAction = async (id, action) => {
    setProcessingId(id);
    try {
      await api.post(`/records/admin/approve/${id}`, { action, adminReason: 'Processed via Admin Queue' });
      setUpdates(prev => prev.filter(up => up._id !== id));
    } catch (error) {
      console.error(`Error ${action.toLowerCase()}ing update:`, error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Approval Workflows</h1>
        <p className="text-gray-400 mt-1">Govern the clinic ecosystem with administrative oversight</p>
      </div>

      <div className="flex gap-4 border-b border-gray-800">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 ${
            activeTab === 'appointments' ? 'text-blue-500 border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-300'
          }`}
        >
          Appointment Requests ({appointments.length})
        </button>
        <button
          onClick={() => setActiveTab('updates')}
          className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 ${
            activeTab === 'updates' ? 'text-blue-500 border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-300'
          }`}
        >
          Data Update Requests ({updates.length})
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      ) : activeTab === 'appointments' ? (
        appointments.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {appointments.map((app) => (
              <div key={app._id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-gray-700 transition-all">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-600/20 p-2 rounded-lg">
                      <User className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{app.patientId.fullName}</h3>
                      <p className="text-gray-500 text-xs">Requested {new Date(app.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <UserCheck className="w-4 h-4 text-gray-500" />
                      <span>Doctor: <span className="text-white">{app.doctorId.fullName}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{new Date(app.date).toLocaleDateString()} at {app.slotTime}</span>
                    </div>
                  </div>
                  <div className="bg-gray-950 p-3 rounded-lg border border-gray-800">
                    <p className="text-sm text-gray-300 italic">"{app.reason}"</p>
                  </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <button onClick={() => handleAppointmentAction(app._id, 'REJECT')} disabled={!!processingId} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-900/20 text-red-500 px-4 py-2 rounded-lg font-bold border border-red-900/50 transition-all">
                    Reject
                  </button>
                  <button onClick={() => handleAppointmentAction(app._id, 'APPROVE')} disabled={!!processingId} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold transition-all">
                    {processingId === app._id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Approve'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-2xl">
            <AlertCircle className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No pending appointments.</p>
          </div>
        )
      ) : (
        updates.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {updates.map((up) => (
              <div key={up._id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-gray-700 transition-all">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-600/20 p-2 rounded-lg">
                      <FileEdit className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">Update Request: {up.field}</h3>
                      <p className="text-gray-500 text-xs">By Dr. {up.doctorId.fullName} for {up.patientId.fullName}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-950 p-3 rounded-lg border border-gray-800">
                      <p className="text-xs text-gray-500 font-bold uppercase mb-1">Old Value</p>
                      <p className="text-white text-sm">{JSON.stringify(up.oldValue) || '(empty)'}</p>
                    </div>
                    <div className="bg-gray-950 p-3 rounded-lg border border-blue-900/30">
                      <p className="text-xs text-blue-500 font-bold uppercase mb-1">Proposed Value</p>
                      <p className="text-white text-sm font-bold">{JSON.stringify(up.newValue)}</p>
                    </div>
                  </div>
                  <div className="bg-gray-950 p-3 rounded-lg border border-gray-800">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">Justification</p>
                    <p className="text-sm text-gray-300 italic">"{up.justification}"</p>
                  </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <button onClick={() => handleUpdateAction(up._id, 'REJECT')} disabled={!!processingId} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-900/20 text-red-500 px-4 py-2 rounded-lg font-bold border border-red-900/50 transition-all">
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                  <button onClick={() => handleUpdateAction(up._id, 'APPROVE')} disabled={!!processingId} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-bold transition-all">
                    {processingId === up._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-2xl">
            <AlertCircle className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No pending data update requests.</p>
          </div>
        )
      )}
    </div>
  );
};

export default AdminQueue;
