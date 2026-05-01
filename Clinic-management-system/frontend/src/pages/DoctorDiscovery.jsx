import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Search, User, Star, Clock, CreditCard, ChevronRight, Loader2 } from 'lucide-react';
import BookingModal from '../components/BookingModal';

const DoctorDiscovery = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specialty, setSpecialty] = useState('');
  const [search, setSearch] = useState('');
  
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await api.get('/doctors', {
        params: { specialty, search }
      });
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [specialty]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Find a Doctor</h1>
          <p className="text-gray-400 mt-1">Browse through our certified medical professionals</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name..."
              className="bg-gray-950 border border-gray-800 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
            />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all">
            Search
          </button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2 pb-2">
        {['', 'General Physician', 'Dentist', 'Cardiologist', 'Dermatologist', 'Pediatrician'].map((s) => (
          <button
            key={s}
            onClick={() => setSpecialty(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              specialty === s 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-900 text-gray-400 hover:bg-gray-800 border border-gray-800'
            }`}
          >
            {s || 'All Specialties'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      ) : doctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div key={doctor._id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all group shadow-lg">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-gray-800 p-3 rounded-xl group-hover:bg-blue-600/20 transition-all">
                    <User className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded text-xs font-bold">
                    <Star className="w-3 h-3 fill-current" /> 4.8
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{doctor.fullName}</h3>
                <p className="text-blue-500 text-sm font-medium mb-4">{doctor.specialty}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{doctor.experienceYears} Years Experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <CreditCard className="w-4 h-4" />
                    <span>Consultation Fee: <span className="text-white font-bold">PKR : {doctor.fee}/-</span></span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Available Today</p>
                  <button className="flex items-center gap-1 text-blue-500 hover:text-blue-400 text-sm font-bold transition-all">
                    View Profile <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button 
                onClick={() => {
                  setSelectedDoctor(doctor);
                  setIsModalOpen(true);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 transition-all"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-2xl">
          <p className="text-gray-400 text-lg">No doctors found matching your criteria.</p>
          <button 
            onClick={() => {setSpecialty(''); setSearch('');}}
            className="text-blue-500 mt-2 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {selectedDoctor && (
        <BookingModal 
          doctor={selectedDoctor} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default DoctorDiscovery;
