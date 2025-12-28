'use client';
import React, { useEffect, useState } from 'react';
import { X, Save, Loader2, Target, MessageSquare, Timer, UserCircle, BarChart3, Tag } from 'lucide-react';


export default function UpdateScenario({ scenarioId, isOpen, onClose, onUpdateSuccess }) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    customerType: 'normal',
    difficultyLevel: 'medium',
    role: 'sales',
    objective: '',
    prompt: '',
    expectedDuration: 10,
  });

  useEffect(() => {
    if (!isOpen || !scenarioId) return;

    const fetchScenario = async () => {
      try {
        setFetching(true);
        const token = localStorage.getItem('token');
        const res = await fetch(
          `https://final-pro-api-j1v7.onrender.com/api/v1/scenario/${scenarioId}`,
          { headers: { token: `${token}` } }
        );
        const { data } = await res.json();
        if (!res.ok) throw new Error(data.message);
        
        setFormData({
          title: data.title || '',
          customerType: data.customerType || 'normal',
          difficultyLevel: data.difficultyLevel || 'medium',
          role: data.role || 'sales',
          objective: data.objective || '',
          prompt: data.prompt || '',
          expectedDuration: data.expectedDuration || 10,
        });
      } catch (err) {
        console.error('Fetch error:', err.message);
      } finally {
        setFetching(false);
      }
    };

    fetchScenario();
  }, [isOpen, scenarioId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(
        `https://final-pro-api-j1v7.onrender.com/api/v1/scenario/${scenarioId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            token: `${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error('Update failed');

  
      if (onUpdateSuccess) {
        onUpdateSuccess({ ...formData, _id: scenarioId });
      }
      
      onClose();
    } catch (err) {
      console.error('Update error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
              <Save size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Edit Scenario</h3>
              <p className="text-xs font-medium text-slate-400">Update your training simulation details</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 bg-slate-50/30">
          {fetching ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="animate-spin text-amber-500" size={40} />
              <p className="text-slate-500 font-medium">Loading details...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                   <Tag size={16} className="text-amber-500"/> Title
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Handling Angry Customers"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <UserCircle size={16} className="text-amber-500"/> Customer Personality
                </label>
                <select
                  name="customerType"
                  value={formData.customerType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white transition-all appearance-none"
                >
                  <option value="angry">Angry</option>
                  <option value="confused">Confused</option>
                  <option value="hesitant">Hesitant</option>
                  <option value="normal">Normal</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <BarChart3 size={16} className="text-amber-500"/> Difficulty Level
                </label>
                <select
                  name="difficultyLevel"
                  value={formData.difficultyLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white transition-all appearance-none"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <UserCircle size={16} className="text-amber-500"/> Agent Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white transition-all appearance-none"
                >
                  <option value="sales">Sales</option>
                  <option value="customer_support">Customer Support</option>
                  <option value="call_center">Call Center</option>
                  <option value="customer_service">Customer Service</option>
                  <option value="real_estate">Real Estate</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Timer size={16} className="text-amber-500"/> Duration (Minutes)
                </label>
                <input
                  type="number"
                  name="expectedDuration"
                  min={1}
                  value={formData.expectedDuration}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Target size={16} className="text-amber-500"/> Objective
                </label>
                <textarea
                  name="objective"
                  value={formData.objective}
                  onChange={handleChange}
                  placeholder="What is the goal of this scenario?"
                  rows={2}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all resize-none"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <MessageSquare size={16} className="text-amber-500"/> AI Prompt Instructions
                </label>
                <textarea
                  name="prompt"
                  value={formData.prompt}
                  onChange={handleChange}
                  placeholder="Detailed instructions for the AI behavior..."
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all resize-none text-sm leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t bg-white flex gap-3 sticky bottom-0 z-10">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-slate-600 font-semibold rounded-xl hover:bg-slate-100 transition-colors border border-slate-200"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading || fetching}
            className="flex-[2] px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-amber-200"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Save size={20} /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}