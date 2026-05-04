import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
  Users, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Activity,
  Loader2
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // In a real app, you'd have a dedicated stats endpoint
      // For now, we'll simulate or fetch from existing endpoints
      const response = await Promise.allSettled([
        // api.get('/auth/health'), // Placeholder
        api.get('/admin/pendingusers'),
        api.get('/patients'),
        api.get('/admin/getalldoctors'),
        api.get('/appointments/admin-queue')
      ]);
   
      const [_pts, docs, q, appoint] = await response


      setStats({
        totalPatients: docs.value.data.length, // Mock
        totalDoctors: q.value.data.length,
        pendingAppointments: appoint.value.data.length,
       
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-10 h-10 text-blue-500 animate-spin" /></div>;

  const cards = [
    { title: 'Total Patients', value: stats?.totalPatients, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Active Doctors', value: stats?.totalDoctors, icon: Activity, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Pending Approvals', value: stats?.pendingAppointments, icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    // { title: 'Completed Visits', value: stats?.completedAppointments, icon: CheckCircle, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Overview</h1>
        <p className="text-gray-400 mt-1">Real-time performance and system health</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.title} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl hover:border-gray-700 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.bg} p-3 rounded-xl`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <TrendingUp className="w-4 h-4 text-gray-600" />
            </div>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">{card.title}</p>
            <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        {/* <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Recent System Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-800/50 rounded-xl transition-all border border-transparent hover:border-gray-800">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">New patient registration: Aisha Rehman</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <Activity className="w-16 h-16 text-gray-800 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Performance Analytics</h3>
          <p className="text-gray-500 max-w-xs">Detailed charts and revenue reports will be available here in the full version.</p>
          <button className="mt-6 bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-bold transition-all">
            View Full Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
