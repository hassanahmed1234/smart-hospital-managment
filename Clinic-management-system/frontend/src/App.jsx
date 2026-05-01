import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import DoctorDiscovery from './pages/DoctorDiscovery';
import PatientAppointments from './pages/PatientAppointments';
import AdminQueue from './pages/AdminQueue';
import DoctorPipeline from './pages/DoctorPipeline';
import AdminDashboard from './pages/AdminDashboard';
import MedicalRecords from './pages/MedicalRecords';
import AdminUsers from './pages/AdminUsers';
import PatientDashboard from './components/PatientDashboard';
import { ShieldCheck, Calendar, FileText, UserPlus, Activity } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* --- Navigation --- */}
      <nav className="flex items-center justify-between px-8 py-6 bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Activity className="text-blue-600 w-8 h-8" />
          <span className="text-2xl font-bold tracking-tight">Smart<span className="text-blue-600">Hospital</span></span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-6 py-2.5 font-semibold text-slate-600 hover:text-blue-600 transition-colors">Login</Link>
          <Link to="/register" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-shadow shadow-md shadow-blue-200">Register as Patient</Link>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <header className="py-20 px-8 max-w-7xl mx-auto text-center">
        <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-blue-700 uppercase bg-blue-50 rounded-full border border-blue-100">
          Next-Gen Healthcare Management
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-tight">
          Care that is <span className="text-blue-600">Smarter</span>, <br /> 
          Systems that are Faster.
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          The unified platform where patients book with ease, doctors prescribe with precision, and administrators manage with total security.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="px-10 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-200 transition-transform hover:-translate-y-1">
            Book Your First Appointment
          </Link>
          <button className="px-10 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
            View Live Demo
          </button>
        </div>
      </header>

      {/* --- Features Grid --- */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center mb-16">Designed for Every User</h2>
          <div className="grid md:grid-cols-3 gap-12">
            
            {/* Patient Feature */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Calendar className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">For Patients</h3>
              <ul className="text-slate-600 space-y-2">
                <li className="flex items-center gap-2">✓ Instant Appointment Booking</li>
                <li className="flex items-center gap-2">✓ Personal Medical History</li>
                <li className="flex items-center gap-2">✓ View Digital Prescriptions</li>
              </ul>
            </div>

            {/* Doctor Feature */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <FileText className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">For Doctors</h3>
              <ul className="text-slate-600 space-y-2">
                <li className="flex items-center gap-2">✓ Digital Prescription Writing</li>
                <li className="flex items-center gap-2">✓ Access Patient Records</li>
                <li className="flex items-center gap-2">✓ Manage Daily Schedules</li>
              </ul>
            </div>

            {/* Admin Feature */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <UserPlus className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">For Administrators</h3>
              <ul className="text-slate-600 space-y-2">
                <li className="flex items-center gap-2">✓ Onboard Medical Staff</li>
                <li className="flex items-center gap-2">✓ Total System Governance</li>
                <li className="flex items-center gap-2">✓ Secure Data Encryption</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* --- Testimonials --- */}
      <section className="py-20 px-8 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="bg-slate-900 rounded-3xl p-12 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-blue-400 font-bold mb-4">Trusted by Professionals</p>
              <h2 className="text-3xl font-bold text-white mb-8 italic">
                "Smart Hospital has streamlined our entire workflow. Patients appreciate the transparency of their records, and our admins save hours every week on staffing."
              </h2>
              <div className="flex items-center gap-4 text-white">
                <div className="w-12 h-12 rounded-full bg-slate-700"></div>
                <div>
                  <p className="font-bold">Dr. Sarah Jenkins</p>
                  <p className="text-slate-400 text-sm">Chief of Staff, Metropolitan Health</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-12 px-8 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Activity className="text-blue-600 w-6 h-6" />
            <span className="text-xl font-bold">SmartHospital</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 Smart Hospital Systems. Built for secure healthcare.</p>
          <div className="flex gap-6 text-slate-400 text-sm">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="min-h-screen bg-gray-950">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
          
          <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
            <Route path="/dashboard" element={user?.role === 'ADMIN' ? <AdminDashboard /> : <PatientDashboard/>} />
            
            {/* Patient Routes */}
            {user?.role === 'PATIENT' && (
              <>
                <Route path="/doctors" element={<DoctorDiscovery />} />
                <Route path="/appointments" element={<PatientAppointments />} />
                <Route path="/records" element={<MedicalRecords />} />
              </>
            )}

            {/* Doctor Routes */}
            {user?.role === 'DOCTOR' && (
              <>
                <Route path="/appointments" element={<DoctorPipeline />} />
              </>
            )}

            {/* Admin Routes */}
            {user?.role === 'ADMIN' && (
              <>
                <Route path="/appointments" element={<AdminQueue />} />
                <Route path="/admin" element={<AdminUsers />} />
              </>
            )}
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
