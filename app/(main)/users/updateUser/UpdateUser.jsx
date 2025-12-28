'use client';
import React, { useState } from 'react';
import { 
  User, Mail, Shield, Save, Loader2, AlertCircle, 
  Lock, Calendar, Phone, Hash 
} from 'lucide-react';

export default function UpdateUser({ user, onClose }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age || '',
    birthDay: user?.birthDay ? new Date(user.birthDay).toISOString().split('T')[0] : '',
    phoneNumber: user?.phoneNumber || '',
    role: user?.role || 'user'
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });



    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://final-pro-api-j1v7.onrender.com/api/v1/user/${user._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log(data);
      
      if (data.status) {
        setMessage({ type: 'success', text: 'User updated successfully!' });
        setTimeout(() => onClose(), 1500);
      } else {
        throw new Error(data.message || 'Update failed');
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-2 custom-scrollbar">
      {message.text && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-wider ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
        }`}>
          {message.type === 'success' ? <Save size={16} /> : <AlertCircle size={16} />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-sm" placeholder="John Doe" required />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-sm" placeholder="email@example.com" required />
          </div>
        </div>

    

        {/* Age */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Age</label>
          <div className="relative">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-sm" placeholder="23" />
          </div>
        </div>

        {/* Birthday */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Birthday</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="date" name="birthDay" value={formData.birthDay} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-sm" />
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-sm" placeholder="+201234567890" />
          </div>
        </div>

        {/* Role */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">System Role</label>
          <div className="relative">
            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select name="role" value={formData.role} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-sm appearance-none">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-6">
        <button type="button" onClick={onClose} className="flex-1 px-6 py-3.5 border border-gray-100 text-gray-400 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-gray-50 transition-all">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="flex-[2] px-6 py-3.5 bg-gray-900 hover:bg-black text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl shadow-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> Save Changes</>}
        </button>
      </div>
    </form>
  );
}