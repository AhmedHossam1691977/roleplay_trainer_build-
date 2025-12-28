'use client';
import React, { useEffect, useState } from 'react';
import { 
  X, Activity, User, BookOpen, Target, MessageSquare, 
  Award, AlertCircle, DollarSign, Clock, BarChart3, ChevronRight 
} from 'lucide-react';

export default function DetailsSession({ id, onClose }) {
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://final-pro-api-j1v7.onrender.com/api/v1/session/${id}`, {
          headers: { 'token': localStorage.getItem('token') }
        });
        const json = await response.json();
        if (json.success) setSessionData(json.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSessionDetails();
  }, [id]);

  if (loading) return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-md">
      <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold text-gray-600">Loading Session Details...</p>
      </div>
    </div>
  );

  if (!sessionData) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[95vh]">
        
        
        <div className="flex items-center justify-between p-6 border-b bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200 text-white">
              <Activity size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">Session Report</h2>
              <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                <span className="bg-gray-200 px-2 py-0.5 rounded text-gray-600">ID: {id}</span>
                <span>•</span>
                <span className="text-blue-500 font-bold uppercase">{sessionData.status}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-red-50 hover:text-red-500 text-gray-400 rounded-full transition-all">
            <X size={28} />
          </button>
        </div>

        
        <div className="p-8 overflow-y-auto space-y-8 custom-scrollbar">
          
        
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-3xl border border-blue-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-blue-600 font-bold text-sm">
                <User size={18} /> USER INFO
              </div>
              <p className="font-black text-gray-800 text-lg">{sessionData.userId?.name}</p>
              <p className="text-sm text-gray-500 truncate">{sessionData.userId?.email}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white p-5 rounded-3xl border border-purple-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-purple-600 font-bold text-sm">
                <BookOpen size={18} /> SCENARIO
              </div>
              <p className="font-black text-gray-800 text-lg">{sessionData.scenarioId?.title}</p>
              <p className="text-sm text-gray-500 capitalize">Difficulty: {sessionData.scenarioId?.difficultyLevel}</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-3xl border border-green-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-green-600 font-bold text-sm">
                <Clock size={18} /> TIMING
              </div>
              <p className="font-black text-gray-800 text-lg">Started At</p>
              <p className="text-sm text-gray-500">{new Date(sessionData.started_at).toLocaleString()}</p>
            </div>
          </div>

        
          {sessionData.evaluations?.map((evalItem, idx) => (
            <div key={idx} className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 delay-150">
              
              <div className="flex items-center gap-2 text-gray-800 font-black text-xl">
                <BarChart3 className="text-blue-600" /> Evaluation Results
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 bg-gray-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-blue-400 font-bold text-xs uppercase tracking-[0.2em] mb-2">Overall Score</p>
                    <h3 className="text-6xl font-black">{evalItem.scores?.totalScore}<span className="text-2xl text-blue-400">%</span></h3>
                  </div>
                  <div className="absolute top-[-20px] right-[-20px] text-white/5 font-black text-9xl italic select-none">SCORE</div>
                </div>
                
                <div className="bg-orange-50 border border-orange-100 p-6 rounded-[2rem] flex flex-col justify-center items-center text-center">
                   <p className="text-orange-600 font-bold text-xs uppercase mb-2">Sentiment</p>
                   <p className="text-2xl font-black text-orange-800">{evalItem.feedback?.customerSentiment}</p>
                </div>

                <div className="bg-blue-50 border border-blue-100 p-6 rounded-[2rem] flex flex-col justify-center items-center text-center">
                   <p className="text-blue-600 font-bold text-xs uppercase mb-2">Duration</p>
                   <p className="text-2xl font-black text-blue-800">{evalItem.duration.toFixed(1)}s</p>
                </div>
              </div>

    
              <div className="bg-gray-50 border border-gray-200 p-8 rounded-[2rem] space-y-4">
                <div className="flex items-center gap-2 font-bold text-gray-700">
                  <Target className="text-red-500" /> Analysis Breakdown
                </div>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm md:text-base italic">
                  {evalItem.analysis?.summary}
                </p>
              </div>

        
              <div className="bg-white border-2 border-dashed border-gray-200 p-6 rounded-[2rem]">
                <div className="flex items-center gap-2 font-bold text-gray-700 mb-4">
                  <DollarSign className="text-green-600" /> Session Cost Details
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(evalItem.cost).map(([key, val]) => (
                    <div key={key} className="p-3 bg-gray-50 rounded-2xl text-center">
                      <p className="text-[10px] uppercase font-bold text-gray-400">{key}</p>
                      <p className="font-bold text-gray-700">${val}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-[2rem]">
                  <h4 className="flex items-center gap-2 text-emerald-700 font-black mb-4"><Award size={20}/> STRENGTHS</h4>
                  <ul className="space-y-3">
                    {evalItem.feedback?.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-emerald-800 font-medium">
                        <ChevronRight size={16} className="mt-0.5 shrink-0" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-rose-50/50 border border-rose-100 p-6 rounded-[2rem]">
                  <h4 className="flex items-center gap-2 text-rose-700 font-black mb-4"><AlertCircle size={20}/> WEAKNESSES</h4>
                  <ul className="space-y-3">
                    {evalItem.feedback?.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-rose-800 font-medium">
                        <ChevronRight size={16} className="mt-0.5 shrink-0" /> {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Transcript */}
              <div className="bg-gray-900 rounded-[2.5rem] p-8 shadow-2xl border-4 border-gray-800">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-gray-400 font-bold text-sm">
                    <MessageSquare size={18} className="text-blue-500" /> LIVE TRANSCRIPT
                  </div>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="font-mono text-sm md:text-base leading-relaxed space-y-4">
                  {evalItem.transcript.split('\n').map((line, i) => line && (
                    <div key={i} className="flex gap-4 border-l-2 border-gray-700 pl-4 hover:border-blue-500 transition-colors">
                      <span className="text-blue-500 font-bold min-w-[30px]">{line.split(':')[0]}:</span>
                      <span className="text-gray-300">{line.split(':')[1]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-100">
                <h4 className="text-xl font-black mb-4 flex items-center gap-2">
                  <Award className="text-blue-200" /> Coaching Tips for Improvement
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {evalItem.feedback?.tips.map((tip, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl text-sm leading-relaxed border border-white/20">
                      {tip}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t flex justify-end">
          <button 
            onClick={onClose} 
            className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-gray-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}