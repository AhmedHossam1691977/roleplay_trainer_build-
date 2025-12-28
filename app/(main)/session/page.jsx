'use client';
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Calendar, ShieldCheck, Eye } from 'lucide-react';
import DetailsSession from './detailsSession/DetailsSession.jsx';

export default function SessionsPage() {
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://final-pro-api-j1v7.onrender.com/api/v1/session?page=${currentPage}`, {
      headers: { 'token': localStorage.getItem('token') }
    })
    .then(res => res.json())
    .then(json => {
      setData(json);
      setLoading(false);
    });
  }, [currentPage]);

  const totalPages = data?.totalPages || 1;

  if (loading) return <div className="p-10 text-center font-sans text-gray-500 animate-pulse">Loading Sessions...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">Sessions History</h1>
          <p className="text-gray-500">Review and manage your activity sessions</p>
        </div>

        <div className="grid gap-4 mt-6">
          {data?.sessions?.map((session) => (
            <div 
              key={session._id} 
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition-all group"
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-600 transition-colors">
                    <ShieldCheck className="text-blue-600 group-hover:text-white" size={20} />
                  </div>
                  <h2 className="font-bold text-gray-700 text-lg">ID: {session._id.slice(-8)}</h2>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    session.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {session.status}
                  </span>
                </div>

                <div className="flex gap-4 text-xs text-gray-400 font-medium italic">
                  <span>📅 {new Date(session.started_at).toLocaleDateString()}</span>
                  <span>⏱️ {new Date(session.started_at).toLocaleTimeString()}</span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedId(session._id)}
                className="mt-4 md:mt-0 w-full md:w-auto bg-gray-900 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2"
              >
                <Eye size={18} />
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10 pb-10">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
            >
              <ChevronLeft size={20}/>
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-10 h-10 rounded-lg font-bold transition-all ${
                  currentPage === index + 1 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
            >
              <ChevronRight size={20}/>
            </button>
          </div>
        )}
      </div>

      {selectedId && (
        <DetailsSession
          id={selectedId} 
          onClose={() => setSelectedId(null)} 
        />
      )}
    </div>
  );
}