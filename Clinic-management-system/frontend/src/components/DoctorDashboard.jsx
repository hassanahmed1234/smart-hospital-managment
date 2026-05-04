import React from 'react';
import { useSelector } from 'react-redux';
import { 
  Calendar, FileText, Pill, Beaker, Bell, 
  MessageCircle, CreditCard, Activity, Heart, 
  Download, Video, XCircle, Clock, ChevronRight,
  User, Plus
} from 'lucide-react';

const DoctorDashboard = () => {
  // Mock data for the UI
  const stats = [
    { label: 'Medical Reports', value: '12', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Active Prescriptions', value: '03', icon: Pill, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Pending Lab Tests', value: '01', icon: Beaker, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Health Score', value: 'Good', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* 1. Patient Overview (Top Section) */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
            <Activity className="w-32 h-32 text-blue-500" />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="w-24 h-24 rounded-2xl bg-blue-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-blue-600/20">
            {user?.fullName?.charAt(0).toUpperCase() || 'P'}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {user?.fullName || 'Hafiz Hassan'}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-gray-400">
              <span className="flex items-center gap-1"><User className="w-4 h-4" /> Age: 22 | Male</span>
              <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-rose-500" /> O+ Group</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Last Visit: 12 Feb 2026</span>
            </div>
            <p className="mt-3 text-blue-400 font-medium italic">Assigned Specialist: Dr. Ahmed (Cardiologist)</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2">
            <Plus className="w-5 h-5" /> Book New Appointment
          </button>
        </div>
      </div>

      {/* Stats Quick Look */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:border-gray-700 transition-colors">
            <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. Upcoming Appointments (The Core) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" /> Upcoming Appointments
              </h3>
              <button className="text-blue-500 text-sm font-medium hover:underline">View Schedule</button>
            </div>
            <div className="p-6 space-y-4">
              {[1, 2].map((id) => (
                <div key={id} className="bg-gray-800/40 p-4 rounded-xl border border-gray-700/50 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-500/20 p-3 rounded-lg text-blue-500 text-center min-w-[60px]">
                      <p className="text-xs font-bold uppercase">Feb</p>
                      <p className="text-xl font-black">24</p>
                    </div>
                    <div>
                      <h4 className="text-white font-bold">Dr. Ahmed - General Checkup</h4>
                      <p className="text-gray-400 text-sm">10:30 AM - Room 402</p>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Confirmed</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 px-4 text-sm font-bold">
                        <Video className="w-4 h-4" /> Join
                    </button>
                    <button className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 text-sm font-bold px-4">Reschedule</button>
                    <button className="p-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-colors">
                        <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Recent Prescriptions */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl">
             <div className="p-6 border-b border-gray-800">
               <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Pill className="w-5 h-5 text-emerald-500" /> Active Prescriptions
              </h3>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-gray-800/50 text-gray-400 text-xs uppercase">
                   <tr>
                     <th className="px-6 py-4">Medicine</th>
                     <th className="px-6 py-4">Dosage</th>
                     <th className="px-6 py-4">Duration</th>
                     <th className="px-6 py-4">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-800">
                   {[1, 2].map((item) => (
                     <tr key={item} className="hover:bg-white/5 transition-colors">
                       <td className="px-6 py-4 text-white font-medium">Amoxicillin 500mg</td>
                       <td className="px-6 py-4 text-gray-400">1-0-1 (After Food)</td>
                       <td className="px-6 py-4 text-gray-400">7 Days</td>
                       <td className="px-6 py-4">
                         <button className="text-blue-500 flex items-center gap-1 hover:underline text-sm">
                           <Download className="w-4 h-4" /> PDF
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>

        {/* Right Sidebar: Lab Reports & Billing */}
        <div className="space-y-6">
          
          {/* 5. Lab Reports */}
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl">
            <h3 className="text-white font-bold mb-4 flex items-center justify-between">
               Lab Reports <span className="text-xs bg-purple-500/20 text-purple-500 px-2 py-1 rounded">New</span>
            </h3>
            <div className="space-y-4">
              {['Complete Blood Count', 'Thyroid Profile'].map((test, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-800/50">
                  <div>
                    <p className="text-sm text-white font-medium">{test}</p>
                    <p className="text-[10px] text-gray-500 uppercase">Uploaded: 2 days ago</p>
                  </div>
                  <button className="text-gray-400 hover:text-white">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button className="w-full py-2 text-blue-500 text-sm font-bold hover:bg-blue-500/5 rounded-lg transition-colors">
                View Full Medical Record
              </button>
            </div>
          </div>

          {/* 8. Billing / Payments */}
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
               <CreditCard className="w-5 h-5 text-amber-500" /> Pending Bills
            </h3>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center mb-4">
               <p className="text-gray-400 text-xs">Total Outstanding</p>
               <h2 className="text-2xl font-black text-white">$142.00</h2>
            </div>
            <button className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-amber-600/20">
              Pay Now
            </button>
          </div>

          {/* 6. Notifications */}
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl">
             <h3 className="text-white font-bold mb-4 flex items-center gap-2">
               <Bell className="w-5 h-5 text-rose-500" /> Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3 text-sm border-l-2 border-blue-500 pl-3">
                <p className="text-gray-300"><span className="text-white font-bold italic underline">Reminder:</span> Take your morning medicine at 8:00 AM.</p>
              </div>
              <div className="flex gap-3 text-sm border-l-2 border-emerald-500 pl-3">
                <p className="text-gray-300">New prescription uploaded by Dr. Ahmed.</p>
              </div>
            </div>
          </div>

          {/* 7. Chat CTA */}
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-2xl text-white">
             <MessageCircle className="w-8 h-8 mb-4" />
             <h4 className="font-bold text-lg leading-tight">Need help?</h4>
             <p className="text-blue-100 text-sm mt-1 mb-4">Message your doctor directly for follow-up questions.</p>
             <button className="w-full bg-white text-indigo-600 py-2 rounded-lg font-bold text-sm shadow-xl transition-transform active:scale-95">
               Start Chat
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;