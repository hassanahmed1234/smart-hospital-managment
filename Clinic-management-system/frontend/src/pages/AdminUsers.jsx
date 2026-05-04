import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Users, AlertCircle, Loader2, CheckCircle, XCircle, UserPlus } from 'lucide-react';
import AddDoctorModal from '../components/AddDoctorModal';

const AdminUsers = () => {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await api.put(`/admin/users/${id}/status`, { status: newStatus });
      fetchUsers();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-blue-500" /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="text-blue-500" /> User Management
          </h1>
          <p className="text-gray-400 mt-1">Manage patients, doctors, and system access</p>
        </div>
        <button
          onClick={() => {
            setIsAddDoctorModalOpen(true)
            AddDoctorModal
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
        >
          <UserPlus className="w-5 h-5" /> Onboard Doctor
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-gray-950 text-xs uppercase font-bold text-gray-500 border-b border-gray-800">
              <tr>
                <th className="px-6 py-4">Name / Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white mb-1">{user.profile?.fullName || 'N/A'}</div>
                    <div className="text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' :
                        user.role === 'DOCTOR' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                          'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                      }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${user.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                        user.status === 'INACTIVE' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                          'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                      }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.role !== 'ADMIN' && (
                      <button
                        onClick={() => toggleStatus(user._id, user.status)}
                        className={`text-xs font-bold px-3 py-1.5 rounded transition-all ${user.status === 'ACTIVE'
                            ? 'text-red-500 hover:bg-red-500/10'
                            : 'text-green-500 hover:bg-green-500/10'
                          }`}
                      >
                        {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      <AddDoctorModal
        isOpen={isAddDoctorModalOpen}
        onClose={() => setIsAddDoctorModalOpen(false)}
        onSuccess={fetchUsers}
      />
    </div>
  );
};

export default AdminUsers;
