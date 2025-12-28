'use client';
import React, { useEffect, useState, useMemo } from 'react';
import EvaluationDetails from './evaluation/Evaluation.jsx';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';

export default function EvaluationsPage() {
  const [data, setData] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  
  const [successFilter, setSuccessFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {

    fetch(`https://final-pro-api-j1v7.onrender.com/api/v1/evaluation?page=${currentPage}`, {
      headers: { 'token': localStorage.getItem('token') }
    })
    .then(res => res.json())
    .then(json => setData(json));
  }, [currentPage]); 

  const filteredData = useMemo(() => {
    if (!data?.evaluations) return [];
    return data.evaluations.filter(item => {
      if (successFilter === 'success') return item.analysis.success === true;
      if (successFilter === 'fail') return item.analysis.success === false;
      return true;
    });
  }, [data, successFilter]);


  const totalPages = data?.totalPages || 1;

  if (!data) return <div className="p-10 text-center font-sans text-gray-500 animate-pulse">Loading Evaluations...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">Evaluation Dashboard</h1>
            <p className="text-gray-500">Manage and review your call performance</p>
          </div>
          
          <div className="flex bg-white p-1 rounded-lg shadow-sm border border-gray-200">
            {['all', 'success', 'fail'].map((status) => (
              <button
                key={status}
                onClick={() => { setSuccessFilter(status); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
                  successFilter === status 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {status.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 mt-6">
          {filteredData.map((item) => (
            <div 
              key={item._id} 
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition-all group"
            >
              <div className="space-y-3 flex-1 w-full md:w-auto">
                <div className="flex items-center gap-3">
                  {item.analysis.success ? (
                    <CheckCircle2 className="text-green-500" size={20} />
                  ) : (
                    <XCircle className="text-red-500" size={20} />
                  )}
                  <h2 className="font-bold text-gray-700 text-lg">Call: {item.callId.slice(-8)}</h2>
                </div>

                <div className="w-full max-w-xs">
                  <div className="flex justify-between text-xs mb-1 font-bold">
                    <span className="text-gray-400">Total Score</span>
                    <span className={item.scores.totalScore > 50 ? "text-green-600" : "text-red-600"}>
                      {item.scores.totalScore}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-700 ${
                        item.scores.totalScore > 70 ? 'bg-green-500' : 
                        item.scores.totalScore > 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${item.scores.totalScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex gap-4 text-xs text-gray-400 font-medium">
                  <span>📅 {new Date(item.startedAt).toLocaleDateString()}</span>
                  <span>⏱️ {item.duration.toFixed(1)}s</span>
                  <span className={item.isDeleted ? "text-red-400" : "text-blue-400"}>
                    ● {item.isDeleted ? "Deleted" : "Active"}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedId(item._id)}
                className="mt-4 md:mt-0 w-full md:w-auto bg-gray-900 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-sm"
              >
                View Details
              </button>
            </div>
          ))}

          {filteredData.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-gray-400">
              No evaluations found for this criteria.
            </div>
          )}
        </div>

        {/* Pagination Controls بناءً على totalPages من الـ API */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10 pb-10">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
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
              className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={20}/>
            </button>
          </div>
        )}
      </div>

      {selectedId && (
        <EvaluationDetails 
          id={selectedId} 
          onClose={() => setSelectedId(null)} 
        />
      )}
    </div>
  );
}