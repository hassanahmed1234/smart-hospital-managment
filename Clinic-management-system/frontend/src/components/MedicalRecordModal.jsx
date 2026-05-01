import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { X, FileText, AlertCircle, Plus, Loader2, CheckCircle } from 'lucide-react';

const MedicalRecordModal = ({ patientId, patientName, isOpen, onClose, userRole }) => {
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchRecord();
    }
  }, [isOpen, patientId]);

  const fetchRecord = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/records/${patientId}`);
      console.log(response.data)
      setRecord(response.data);
    } catch (error) {
      console.error('Error fetching record:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    
    setSubmittingNote(true);
    try {
      await api.post('/records/update-request', {
        patientId,
        field: 'clinicalNotesHistory',
        oldValue: null,
        newValue: { note, date: new Date() },
        justification: 'New clinical note added after consultation.'
      });
      setSuccessMsg('Clinical note submitted for admin approval.');
      setNote('');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error('Error submitting note:', error);
    } finally {
      setSubmittingNote(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-60 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <FileText className="text-blue-500" /> Medical Record
            </h2>
            <p className="text-sm text-gray-400">Patient: {patientName}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
          ) : record ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Allergies</h4>
                  {record.allergies?.length > 0 ? (
                    <ul className="list-disc pl-4 text-sm text-gray-300">
                      {record.allergies.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                  ) : <p className="text-sm text-gray-600">No known allergies</p>}
                </div>
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Chronic Conditions</h4>
                  {record.chronicConditions?.length > 0 ? (
                    <ul className="list-disc pl-4 text-sm text-gray-300">
                      {record.chronicConditions.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  ) : <p className="text-sm text-gray-600">None reported</p>}
                </div>
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Past Diagnoses</h4>
                  {record.pastDiagnoses?.length > 0 ? (
                    <ul className="list-disc pl-4 text-sm text-gray-300">
                      {record.pastDiagnoses.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                  ) : <p className="text-sm text-gray-600">No past diagnoses</p>}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-800 pb-2">Clinical Notes History</h3>
                {record.clinicalNotesHistory?.length > 0 ? (
                  <div className="space-y-4">
                    {record.clinicalNotesHistory.map((note, i) => (
                      <div key={i} className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-xs text-blue-500 font-bold">Dr. {note.doctorId?.fullName || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{new Date(note.date).toLocaleDateString()}</p>
                        </div>
                        <p className="text-sm text-gray-300">{note.note}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-950 rounded-xl border border-gray-800">
                    <p className="text-gray-500 text-sm">No clinical notes available.</p>
                  </div>
                )}
              </div>

              {userRole === 'DOCTOR' && (
                <div className="bg-blue-900/10 border border-blue-900/30 p-6 rounded-xl mt-6">
                  <h3 className="text-md font-bold text-white mb-2 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-blue-500" /> Add Clinical Note
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">Notes submitted here will be sent to the Admin Approval Queue before being added to the patient's permanent record.</p>
                  
                  {successMsg && (
                    <div className="mb-4 p-3 bg-green-900/30 border border-green-500/50 text-green-400 rounded-lg flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" /> {successMsg}
                    </div>
                  )}

                  <form onSubmit={handleAddNote}>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 min-h-[100px] mb-3"
                      placeholder="Enter clinical observations..."
                      required
                      minLength={10}
                    />
                    <button 
                      type="submit" 
                      disabled={submittingNote}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {submittingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Note for Approval'}
                    </button>
                  </form>
                </div>
              )}
            </>
          ) : (
             <div className="text-center py-20">
               <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
               <p className="text-gray-400">No medical record found for this patient.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordModal;
