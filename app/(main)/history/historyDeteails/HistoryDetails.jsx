'use client';
import React, { useEffect, useState } from 'react';
import { 
  Trophy, Zap, AlertCircle, CheckCircle2, 
  MessageSquare, Clock, TrendingUp, Star, Loader2,
  UserCircle, BookOpen, BarChart3
} from 'lucide-react';

export default function HistoryDetails({ sessionId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      if (!sessionId) return;
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await fetch(`https://final-pro-api-j1v7.onrender.com/api/v1/session/${sessionId}`, {
          headers: { token: `${token}` }
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Failed to load details');
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSessionDetails();
  }, [sessionId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="text-slate-500 font-medium animate-pulse">Analyzing Session Data...</p>
    </div>
  );

  if (error) return (
    <div className="p-6 text-center bg-red-50 text-red-600 rounded-2xl border border-red-100 m-4">
      <AlertCircle className="mx-auto mb-2" size={30} />
      <p className="font-bold">Error</p>
      <p className="text-sm">{error}</p>
    </div>
  );

  const scenario = data?.scenarioId || {};
  const evaluation = data?.evaluations?.[0] || {};
  const { analysis, scores, feedback, transcript, duration } = evaluation;

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (score >= 5) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-red-600 bg-red-50 border-red-100';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* --- Scenario Information Header (جديد) --- */}
      <div className="bg-white rounded-2xl border border-blue-100 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-xl">
              <BookOpen className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 leading-none mb-1">
                {scenario.title || "Unknown Scenario"}
              </h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Scenario Name</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase border border-slate-200">
              <UserCircle size={14} /> {scenario.role?.replace('_', ' ')}
            </span>
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase border ${
              scenario.difficultyLevel === 'easy' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-orange-50 text-orange-600 border-orange-200'
            }`}>
              <BarChart3 size={14} /> {scenario.difficultyLevel}
            </span>
          </div>
        </div>
      </div>

      {/* 1. السكور والوقت والتحليل (Responsive Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-200">
            <Trophy size={20} />
          </div>
          <div>
            <p className="text-[10px] text-blue-600 font-bold uppercase opacity-70">Score</p>
            <p className="text-xl font-black text-blue-900">{scores?.totalScore || 0}%</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 flex items-center gap-4">
          <div className="p-3 bg-purple-600 rounded-xl text-white shadow-md shadow-purple-200">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-[10px] text-purple-600 font-bold uppercase opacity-70">Duration</p>
            <p className="text-xl font-black text-purple-900">{duration?.toFixed(1) || 0}s</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-center gap-4">
          <div className="p-3 bg-amber-600 rounded-xl text-white shadow-md shadow-amber-200">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-[10px] text-amber-600 font-bold uppercase opacity-70">Sentiment</p>
            <p className="text-sm font-black text-amber-900 uppercase">{feedback?.customerSentiment || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* 2. تفصيل الدرجات (Mobile Friendly) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4 text-sm">
          <Star className="text-amber-500 fill-amber-500" size={16} /> Skills Breakdown
        </h3>
        <div className="grid grid-cols-2 xs:grid-cols-2 md:grid-cols-5 gap-2">
          {Object.entries(scores || {}).map(([key, value]) => {
            if (key === 'totalScore') return null;
            return (
              <div key={key} className={`p-3 rounded-xl border text-center ${getScoreColor(value)}`}>
                <p className="text-[8px] uppercase font-black opacity-60 mb-1 leading-tight truncate">
                  {key.replace(/([A-Z])/g, ' $1')}
                </p>
                <p className="text-base font-black">{value}/10</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. الإيجابيات والسلبيات (Stacks on Mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-50/40 rounded-2xl border border-emerald-100 p-5">
          <h4 className="flex items-center gap-2 font-bold text-emerald-700 mb-3 text-sm">
            <CheckCircle2 size={16} /> Key Strengths
          </h4>
          <ul className="space-y-2">
            {feedback?.strengths?.map((item, i) => (
              <li key={i} className="text-xs text-emerald-800 flex gap-2 leading-relaxed">
                <span className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full bg-emerald-400" /> {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-red-50/40 rounded-2xl border border-red-100 p-5">
          <h4 className="flex items-center gap-2 font-bold text-red-700 mb-3 text-sm">
            <AlertCircle size={16} /> Weaknesses
          </h4>
          <ul className="space-y-2">
            {feedback?.weaknesses?.map((item, i) => (
              <li key={i} className="text-xs text-red-800 flex gap-2 leading-relaxed">
                <span className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full bg-red-400" /> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4. تحليل الذكاء الاصطناعي (Dark Mode Style) */}
      <div className="bg-slate-900 rounded-2xl p-5 text-slate-300">
        <h3 className="flex items-center gap-2 font-bold text-white mb-3 text-sm">
          <Zap className="text-amber-400 fill-amber-400" size={16} /> AI Performance Insight
        </h3>
        <div className="text-xs leading-relaxed whitespace-pre-line font-light opacity-90 italic">
          {analysis?.summary?.replace(/\*\*/g, '')}
        </div>
      </div>

      {/* 5. سجل المحادثة (Scrollable) */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
          <MessageSquare size={14} className="text-slate-400" />
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Call Transcript</span>
        </div>
        <div className="p-4 bg-slate-50/30 max-h-72 overflow-y-auto space-y-4">
          {transcript?.split('\n').map((line, i) => {
            if (!line.trim()) return null;
            const isAI = line.startsWith('AI:');
            return (
              <div key={i} className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[90%] sm:max-w-[80%] p-3 rounded-2xl text-xs ${
                  isAI 
                  ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm' 
                  : 'bg-blue-600 text-white rounded-tr-none shadow-sm'
                }`}>
                  <p className={`text-[8px] mb-1 font-black uppercase tracking-widest ${isAI ? 'text-blue-500' : 'text-blue-200'}`}>
                    {isAI ? 'Customer' : 'You'}
                  </p>
                  {line.replace(/^(AI:|User:)/, '')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}