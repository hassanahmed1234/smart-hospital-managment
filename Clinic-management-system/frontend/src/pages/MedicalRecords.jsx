import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../utils/api';
import { FileText, AlertCircle, Loader2 } from 'lucide-react';

const MedicalRecords = () => {
  const { user } = useSelector((state) => state.auth);
  const [record, setRecord] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecord();
  }, []);
  useEffect(() => {
  }, [record]);

  const fetchRecord = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/records/my-record`);
      setRecord([...record, response.data]);

    } catch (error) {
      console.error('Error fetching record:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-blue-500" /></div>;
  }

  if (!record) {
    return (
      <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-2xl">
        <AlertCircle className="w-12 h-12 text-gray-700 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">No medical record found.</p>
        <p className="text-gray-500 text-sm mt-1">Your record will appear here once updated by a doctor.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <FileText className="text-blue-500" /> My Medical Record
        </h1>
        <p className="text-gray-400 mt-1">View your complete medical history and clinical notes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-xl font-bold text-white">Clinical Notes History</h3>
        </div>
        <div className="p-6">
          {record?.length > 0 ? (
            <div className="space-y-6">
              {record.map((note, i) => (
                <div key={i} className="bg-gray-950 p-5 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-blue-500 font-bold">{note.doctorId?.fullName || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">{note.doctorId?.specialty || 'Specialist'}</p>
                    </div>
                    <div className="bg-gray-800 px-3 py-1 rounded-full">
                      <p className="text-xs text-gray-400 font-medium">{new Date(note.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed text-sm">INSTRUCTION :</p>
                  <blockquote> {note.generalNotes}</blockquote>
                  {note.medications.map((medicine) => {
                    return (<>
                  
                      <div className="bg-gray-900 m-1 p-1 rounded-2xl border border-gray-800 shadow-xl">
                        <h4 className="text-sm font-bold text-gray-500 uppercase mb-1 tracking-wider">Presciptions</h4>
                        <ul className=" pl-5 text-gray-300 space-y-1 list-none">
                        <div className="flex justify-around">
                           <li  key={i}>{medicine.name}</li>
                           <li key={i}>{medicine.dosage}</li>
                           <li key={i}>{medicine.frequency}</li>
                           <li key={i}>{medicine.duration}</li>
                        </div>
                        </ul>
                      </div>
                    </>



                    )
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No clinical notes have been added to your record yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;
