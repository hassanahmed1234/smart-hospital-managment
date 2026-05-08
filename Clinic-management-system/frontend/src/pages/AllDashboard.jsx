import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../utils/api';
import {
  Calendar, FileText, Pill, Beaker, Bell,
  MessageCircle, CreditCard, Activity, Heart,
  Download, Video, XCircle, Clock,
  User, Plus, Stethoscope, Briefcase, Users,
  Link
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getInitialUser } from '../store/slices/authSlice';



const AllDashboard = () => {
  // const { user, token } = useSelector((state) => state.auth);
  const [user, setUser] = useState(null)
  const [appointment, setAppointment] = useState([])
  const [todayappointment, setTodayAppointment] = useState([])
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await api.get("/currentuser/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data.user)

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  if (!user) {
    return <div>Please refresh to fetch data.....</div>;
  }



  // Role Check
  const isDoctor = user?.role === 'DOCTOR' || !!user?.specialty;

  // Age Calculation Function
  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    return Math.abs(new Date(difference).getUTCFullYear() - 1970);
  };

  const navigateToDoctor = () => {
    navigate('/doctors')
  }

  // Dynamic Stats based on role
  const stats = isDoctor ? [

    { label: 'Today Appointments', value: todayappointment.length || 'No Appointments', icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Experience', value: `${user?.experienceYears || 0} Yrs`, icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Consultation Fee', value: user?.fee + '/-' + ' Pkr' || '0', icon: CreditCard, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ] : [

    // { label: 'Active Prescriptions', value: '03', icon: Pill, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    // { label: 'Pending Lab Tests', value: '01', icon: Beaker, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    // { label: 'Health Score', value: 'Good', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">

      {/* 1. Header Section (Dynamic) */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          {isDoctor ? <Stethoscope className="w-32 h-32 text-blue-500" /> : <Activity className="w-32 h-32 text-blue-500" />}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className={`w-24 h-24 rounded-2xl ${isDoctor ? 'bg-emerald-600' : 'bg-blue-600'} flex items-center justify-center text-3xl font-bold text-white shadow-lg`}>
            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {user?.fullName || 'User Name'}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-gray-400">
              {isDoctor ? (
                <>
                  <span className="flex items-center gap-1 text-blue-400 font-bold uppercase text-sm tracking-wider">
                    <Stethoscope className="w-4 h-4" /> {user?.specialty}
                  </span>
                  <span className="flex items-center gap-1"><User className="w-4 h-4" /> {user?.credentials}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {user?.experienceYears}+ Years Exp.</span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1"><User className="w-4 h-4" /> Age: {calculateAge(user?.dob)} | {user?.gender}</span>
                  <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-rose-500" /> Blood Group: {user?.bloodGroup}</span>
                </>
              )}
            </div>
          </div>



          {
            isDoctor ?
              null
              : <button
                onClick={navigateToDoctor}
                className={'bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2'}>
                <Plus className="w-5 h-5" />
                Book New Appointment
              </button>
          }
        </div>
      </div>

      {/* Stats Quick Look */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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


    </div>
  );
};

export default AllDashboard;