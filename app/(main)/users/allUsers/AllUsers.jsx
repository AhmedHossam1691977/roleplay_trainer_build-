'use client';
import React, { useState, useEffect } from 'react';
import { Mail, ShieldCheck, Loader2, Trash2, Eye, RefreshCw, X, UserCheck, Edit3, ChevronLeft, ChevronRight } from 'lucide-react';
import UserDetails from '../userDetails/UserDetails.jsx';
import UpdateUser from '../updateUser/UpdateUser.jsx';

export default function AllUsers({ searchTerm, filters }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationData, setPaginationData] = useState({
    page: 1,
    totalPages: 1,
    length: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState(null);

  useEffect(() => {
    if (isModalOpen || isUpdateModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isModalOpen, isUpdateModalOpen]);

  // دالة جلب البيانات مع دعم رقم الصفحة
  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`https://final-pro-api-j1v7.onrender.com/api/v1/user?page=${page}`, {
        headers: { 'token': token }
      });
      const data = await response.json();
      if (data.status) {
        setUsers(data.users);
        setPaginationData({
          page: data.page,
          totalPages: data.totalPages,
          length: data.length
        });
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleToggleDelete = async (userId, currentDeleteStatus) => {
    const originalUsers = [...users];
    setUsers(currentUsers => 
      currentUsers.map(u => u._id === userId ? { ...u, isDeleted: !currentDeleteStatus } : u)
    );

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://final-pro-api-j1v7.onrender.com/api/v1/user/${userId}`, {
        method: 'DELETE',
        headers: { 'token': `${token}` }
      });
      const data = await response.json();
      if (!response.ok ) throw new Error('فشل التحديث');
    } catch (err) {
      setUsers(originalUsers);
      alert("تعذر تحديث الحالة");
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filters.role ? user.role === filters.role : true;
    const matchesStatus = filters.status ? (filters.status === 'active' ? user.isActive : !user.isActive) : true;
    const matchesDeleted = filters.deletedStatus === 'deleted' ? user.isDeleted : filters.deletedStatus === 'not_deleted' ? !user.isDeleted : true;
    return matchesSearch && matchesRole && matchesStatus && matchesDeleted;
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64">
      <Loader2 className="animate-spin text-blue-600 mb-4 w-10 h-10" />
      <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.3em]"> loading...</p>
    </div>
  );

  return (
    <div className="relative pb-20">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Page</span>
            <span className="text-sm font-black text-gray-800">{paginationData.page} <span className="text-gray-300 mx-1">/</span> {paginationData.totalPages}</span>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Total Users</span>
            <span className="text-sm font-black text-gray-800">{paginationData.length}</span>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Status</span>
            <span className="text-[10px] font-black text-emerald-500 uppercase flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live
            </span>
          </div>
        </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-gray-400 text-xs uppercase font-bold tracking-widest">
              <th className="px-6 py-2">Member</th>
              <th className="px-6 py-2">Role</th>
              <th className="px-6 py-2">Activity</th>
              <th className="px-6 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className={`bg-white shadow-sm border border-gray-50 rounded-2xl transition-all duration-300 hover:shadow-md ${user.isDeleted ? 'opacity-60' : ''}`}>
                <td className="px-6 py-4 rounded-l-[1.5rem] border-y border-l border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black border border-blue-100 uppercase">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className={`font-black text-gray-800 ${user.isDeleted ? 'line-through text-gray-400' : ''}`}>{user.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 border-y border-gray-50 text-[10px] font-black uppercase">
                   <span className="bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 inline-flex items-center gap-1">
                    <ShieldCheck size={12} className="text-purple-500" /> {user.role}
                   </span>
                </td>
                <td className="px-6 py-4 border-y border-gray-50 text-xs font-bold text-gray-700">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-red-500'}`} />
                    {user.isActive ? 'Active' : 'Offline'}
                  </div>
                </td>
                <td className="px-6 py-4 rounded-r-[1.5rem] border-y border-r border-gray-50">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => { setSelectedUserId(user._id); setIsModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"><Eye size={18} /></button>
                    <button onClick={() => { setUserToUpdate(user); setIsUpdateModalOpen(true); }} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"><Edit3 size={18} /></button>
                    <button onClick={() => handleToggleDelete(user._id, user.isDeleted)} className={`p-2 rounded-xl border ${user.isDeleted ? 'text-orange-600 bg-orange-50' : 'text-red-500 bg-red-50'}`}>
                      {user.isDeleted ? <RefreshCw size={18} /> : <Trash2 size={18} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination & Stats Section */}
      <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4 px-2">
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="p-2 rounded-xl hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          
          {[...Array(paginationData.totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                currentPage === i + 1 
                ? 'bg-blue-600 text-white shadow-lg shadow-gray-200' 
                : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button 
            disabled={currentPage === paginationData.totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="p-2 rounded-xl hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Modals remain the same... */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
          <div className="absolute top-0 w-full h-20 bg-white border-b flex items-center justify-between px-12">
            <h2 className="text-lg font-black uppercase tracking-tighter">User Deep Profile</h2>
            <button onClick={() => setIsModalOpen(false)} className="bg-red-50 text-red-600 px-5 py-2 rounded-2xl font-black text-[10px] uppercase">Close</button>
          </div>
          <div className="w-full h-full pt-20 overflow-y-auto bg-gray-50/50 p-12">
            <UserDetails userId={selectedUserId} />
          </div>
        </div>
      )}

      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-black uppercase text-gray-800">Update User</h3>
              <button onClick={() => setIsUpdateModalOpen(false)}><X size={24} /></button>
            </div>
            <div className="p-8">
              <UpdateUser user={userToUpdate} onClose={() => { setIsUpdateModalOpen(false); fetchUsers(currentPage); }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}