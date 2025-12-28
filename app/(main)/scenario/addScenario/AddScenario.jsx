'use client';
import React, { useState, useEffect } from 'react';
import { 
  Save, PlusCircle, Loader2, Target, MessageSquare, 
  Timer, UserCircle, BarChart3, Tag, Briefcase, 
  CheckCircle2, AlertCircle 
} from 'lucide-react';

export default function AddScenario() {
  const baseUrl = 'https://final-pro-api-j1v7.onrender.com';
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' }); 

  const initialFormState = {
    title: '',
    customerType: 'normal',
    difficultyLevel: 'medium',
    role: 'sales',
    objective: '',
    prompt: '',
    expectedDuration: 10,
  };

  const [formData, setFormData] = useState(initialFormState);

  // تنظيف الرسالة بعد فترة تلقائياً
  useEffect(() => {
    if (status.type === 'success') {
      const timer = setTimeout(() => setStatus({ type: null, message: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // تحويل مدة الوقت لرقم لضمان توافق الـ API
    const val = name === 'expectedDuration' ? parseInt(value) || 0 : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
    if (status.type) setStatus({ type: null, message: '' }); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });
    
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Session expired. Please login again.');

      const res = await fetch(`${baseUrl}/api/v1/scenario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token, // تأكد إذا كان الـ API يتطلب 'Bearer ' قبل التوكن
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create scenario');
      }

      setStatus({ 
        type: 'success', 
        message: 'Scenario created successfully! Form has been reset.' 
      });
      
      setFormData(initialFormState); // إعادة ضبط النموذج فوراً

    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500 rounded-2xl text-white shadow-lg shadow-amber-200">
            <PlusCircle size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Add New Scenario</h1>
            <p className="text-slate-500 font-medium">Design your next AI training session</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-8 overflow-hidden">
        
        {/* Status Messages */}
        {status.type && (
          <div className={`flex items-center gap-3 p-4 rounded-2xl border animate-in slide-in-from-top-4 duration-300 ${
            status.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
          }`}>
            {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <p className="text-sm font-bold">{status.message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2 px-1">
              <Tag size={16} className="text-amber-500" /> Scenario Title
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Handling a Refund Request"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all"
              required
            />
          </div>

          {/* Personality & Difficulty */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2 px-1">
              <UserCircle size={16} className="text-amber-500" /> AI Personality
            </label>
            <select
              name="customerType"
              value={formData.customerType}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all cursor-pointer appearance-none"
            >
              <option value="angry">Angry</option>
              <option value="confused">Confused</option>
              <option value="hesitant">Hesitant</option>
              <option value="normal">Normal</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2 px-1">
              <BarChart3 size={16} className="text-amber-500" /> Challenge Level
            </label>
            <select
              name="difficultyLevel"
              value={formData.difficultyLevel}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all cursor-pointer appearance-none"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Role & Duration */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2 px-1">
              <Briefcase size={16} className="text-amber-500" /> Professional Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all cursor-pointer appearance-none"
              required
            >
              <option value="sales">Sales Representative</option>
              <option value="customer_support">Customer Support</option>
              <option value="call_center">Call Center Agent</option>
              <option value="customer_service">Customer Service</option>
              <option value="real_estate">Real Estate Broker</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2 px-1">
              <Timer size={16} className="text-amber-500" /> Duration (Minutes)
            </label>
            <input
              type="number"
              name="expectedDuration"
              min={1}
              value={formData.expectedDuration}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all"
            />
          </div>

          {/* Text Areas */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2 px-1">
              <Target size={16} className="text-amber-500" /> Main Objective
            </label>
            <textarea
              name="objective"
              value={formData.objective}
              onChange={handleChange}
              placeholder="What is the trainee expected to achieve? (e.g., Close the deal, de-escalate the customer)"
              rows={2}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all resize-none"
              required
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2 px-1">
              <MessageSquare size={16} className="text-amber-500" /> Advanced System Prompt
            </label>
            <textarea
              name="prompt"
              value={formData.prompt}
              onChange={handleChange}
              placeholder="Act as a customer who is frustrated because their delivery is late..."
              rows={5}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all resize-none text-sm leading-relaxed"
              required
            />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 font-medium order-2 md:order-1 italic">
            * All fields are required for optimal AI performance.
          </p>
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto min-w-[220px] px-10 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl flex items-center justify-center gap-3 disabled:opacity-60 transition-all shadow-xl shadow-amber-200 hover:shadow-amber-300 active:scale-95 order-1 md:order-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {loading ? 'Creating...' : 'Launch Scenario'}
          </button>
        </div>
      </form>
    </div>
  );
}