import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Calendar, Clock, User, MessageSquare, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/appointments/my-appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'PENDING_ADMIN_APPROVAL':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'PENDING_DOCTOR_ACTION':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'SCHEDULED':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'COMPLETED':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'REJECTED_BY_ADMIN':
      case 'REJECTED_BY_DOCTOR':
      case 'CANCELLED_BY_PATIENT':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const formatStatus = (status) => status.replace(/_/g, ' ');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">My Appointments</h1>
        <p className="text-gray-400 mt-1">Track the status of your booking requests and upcoming visits</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      ) : appointments.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {appointments.map((app) => (
            <div key={app._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mb-4 ${getStatusStyle(app.status)}`}>
                  {formatStatus(app.status)}
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-gray-800 p-2 rounded-lg">
                    <User className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{app.doctorId.fullName}</p>
                    <p className="text-gray-500 text-xs">{app.doctorId.specialty}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 flex items-center gap-4">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">Date</p>
                    <p className="text-white font-medium">{new Date(app.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 flex items-center gap-4">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">Time</p>
                    <p className="text-white font-medium">{app.slotTime}</p>
                  </div>
                </div>
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 col-span-1 sm:col-span-2 flex items-start gap-4">
                  <MessageSquare className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">Reason</p>
                    <p className="text-sm text-gray-300 italic">"{app.reason}"</p>
                  </div>
                </div>
              </div>

              <div className="md:w-1/5 flex items-center justify-center border-t md:border-t-0 md:border-l border-gray-800 pt-6 md:pt-0 md:pl-6">
                {(app.status === 'SCHEDULED'  || app.status.includes('COMPLETED')) ? (
                  <div className="text-center">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-xs text-gray-400">Confirmed</p>
                  </div>
                ) : (app.status.includes('REJECTED') || app.status.includes('CANCELLED') || app.status.includes('COMPLETED')) ? (
                  <div className="text-center">
                    <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <p className="text-xs text-gray-400">Closed</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 text-blue-500 mx-auto mb-2 animate-spin" />
                    <p className="text-xs text-gray-400">Processing</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-2xl">
          <AlertCircle className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">You haven't booked any appointments yet.</p>
          <Link to="/doctors" className="text-blue-500 mt-2 inline-block hover:underline">Find a doctor and book now</Link>
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;
