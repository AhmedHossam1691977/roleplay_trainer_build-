'use client';

import { useEffect, useState } from 'react';
import { Eye, X, Calendar, Activity } from 'lucide-react'; 
import HistoryDetails from './historyDeteails/HistoryDetails.jsx';

export default function PageHistory() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const baseUrl = "https://final-pro-api-j1v7.onrender.com";

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found');
          setLoading(false);
          return;
        }

        const res = await fetch(
          `${baseUrl}/api/v1/session/getSessionsByUserId`,
          { headers: { token: `${token}` } }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch sessions');

        const activeSessions = (data.data || []).filter(session => session.isDeleted === false);
        setSessions(activeSessions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="p-20 text-center text-gray-500 animate-pulse">Loading history...</div>;

  return (
    <div className="p-4 md:p-6 relative min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Session History</h1>
          <p className="text-sm text-gray-500">Track and review your practice performance</p>
        </div>
        <span className="text-xs bg-blue-600 text-white px-4 py-1.5 rounded-full font-bold shadow-lg shadow-blue-100">
          {sessions.length} TOTAL
        </span>
      </div>

      {/* Desktop Table - Hidden on Mobile */}
      <div className="hidden md:block overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">#</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Started At</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sessions.map((session, index) => (
              <tr key={session._id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4 text-gray-400 font-medium">{index + 1}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${
                    session.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {session.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 font-medium">
                  {new Date(session.started_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => {
                      setSelectedSession(session._id);
                      setIsModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-xs font-bold shadow-sm active:scale-95"
                  >
                    <Eye size={14} /> Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards - Shown only on Mobile */}
      <div className="md:hidden space-y-4">
        {sessions.map((session, index) => (
          <div key={session._id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm active:border-blue-300 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-500 text-xs font-bold">
                  {index + 1}
                </span>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                    session.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                  {session.status}
                </span>
              </div>
              <button 
                onClick={() => {
                  setSelectedSession(session._id);
                  setIsModalOpen(true);
                }}
                className="p-2 text-blue-600 bg-blue-50 rounded-xl"
              >
                <Eye size={20} />
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                <Calendar size={14} />
                {new Date(session.started_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-[11px] font-bold uppercase">
                <Activity size={14} /> ID: {session._id.slice(-6)}
              </div>
            </div>

            <button 
                onClick={() => {
                  setSelectedSession(session._id);
                  setIsModalOpen(true);
                }}
                className="w-full mt-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100"
            >
                View Full Analysis
            </button>
          </div>
        ))}
      </div>

      {/* Modal - Improved for Mobile */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div 
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" 
            onClick={() => setIsModalOpen(false)}
          ></div>
          
          <div className="relative bg-white w-full max-w-2xl h-[92vh] sm:h-auto sm:max-h-[90vh] rounded-t-[2.5rem] sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Modal Drag Handle for Mobile */}
            <div className="sm:hidden w-12 h-1.5 bg-gray-200 rounded-full mx-auto my-3" />
            
            <div className="p-4 sm:p-5 border-b flex justify-between items-center">
              <div>
                <h3 className="font-black text-gray-800 text-lg">Detailed Report</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Performance Insights</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-all text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-gray-50/30">
                <HistoryDetails sessionId={selectedSession} />
            </div>
            
            <div className="p-4 border-t bg-white">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full py-4 sm:py-3 bg-gray-100 text-gray-700 rounded-2xl font-black hover:bg-gray-200 transition-colors text-sm uppercase tracking-widest"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}