"use client";
import React, { useEffect, useState, useCallback } from 'react';

export default function EvaluationDetails({ id, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvaluationDetails = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`https://final-pro-api-j1v7.onrender.com/api/v1/evaluation/${id}`, {
        headers: { 'token': localStorage.getItem('token') }
      });
      if (!response.ok) throw new Error('Failed to fetch details');
      const json = await response.json();
      setDetail(json.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvaluationDetails();
  }, [fetchEvaluationDetails]);

  if (loading) return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-white p-6 rounded-lg shadow-xl animate-pulse text-blue-600 font-bold italic">Fetching Deep Details...</div>
    </div>
  );

  if (error) return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]">
      <div className="bg-white p-6 rounded-lg text-red-600 shadow-2xl text-center">
        <p className="font-bold mb-4">Error: {error}</p>
        <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">Close</button>
      </div>
    </div>
  );

  if (!detail) return null;
console.log(detail);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col scale-up-center">
        
        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center bg-gray-50/80">
          <div>
            <h2 className="text-xl font-black text-gray-800 uppercase tracking-tighter">Full Session Report</h2>
            <p className="text-[10px] text-gray-400 font-mono">Session: {detail.sessionId}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 text-3xl">&times;</button>
        </div>

        {/* Main Content */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
          
          {/* --- قسم بيانات المستخدم والسيناريو (طلبك الأساسي) --- */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* User Info Card */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10 font-black text-4xl">USER</div>
              <h3 className="text-blue-600 font-bold text-xs uppercase mb-3">Trainee Details</h3>
              <div className="space-y-1">
                <p className="text-lg font-bold text-slate-800">{detail.userId?.name}</p>
                <p className="text-sm text-slate-500 underline">{detail.userId?.email}</p>
                <p className="text-[10px] text-slate-400 mt-2 font-mono italic">User ID: {detail.userId?._id}</p>
              </div>
            </div>

            {/* Scenario Details Card */}
            <div className="bg-blue-600 p-5 rounded-2xl text-white shadow-lg shadow-blue-100">
              <h3 className="text-blue-200 font-bold text-xs uppercase mb-3">Scenario Metadata</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <p className="text-xl font-black">{detail.scenarioId?.title}</p>
                  <span className="bg-white/20 text-[10px] px-2 py-1 rounded-md uppercase">{detail.scenarioId?.difficultyLevel}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] font-medium">
                  <span className="bg-blue-500/50 px-2 py-1 rounded">Role: {detail.scenarioId?.role}</span>
                  <span className="bg-blue-500/50 px-2 py-1 rounded">Type: {detail.scenarioId?.customerType}</span>
                </div>
                <p className="text-xs text-blue-100 italic border-t border-blue-400/30 pt-2">
                   <strong>Objective:</strong> {detail.scenarioId?.objective}
                </p>
              </div>
            </div>
          </div>

          {/* Scenario Prompt Section */}
          <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl">
            <h4 className="text-[10px] font-black text-amber-600 uppercase mb-2 tracking-widest">The Prompt (The Mission)</h4>
            <p className="text-sm text-amber-900 leading-relaxed italic">{detail.scenarioId?.prompt}</p>
          </div>

          {/* --- باقي تفاصيل التقييم --- */}

          {/* Analysis & Scores */}
          <div className="grid md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2 space-y-4">
               <div className={`p-5 rounded-2xl border-l-8 ${detail.analysis?.success ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                  <h3 className="font-black text-gray-800 mb-2 uppercase text-sm">AI Performance Summary</h3>
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {detail.analysis?.summary}
                  </div>
               </div>
            </div>

            <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                <h3 className="text-xs font-black text-gray-400 uppercase mb-4 text-center">Skill Ratings</h3>
                <div className="space-y-4">
                   <ScoreRow label="Overall" value={detail.scores?.totalScore} max="100" />
                   <ScoreRow label="Empathy" value={detail.scores?.empathy} />
                   <ScoreRow label="Perspective" value={detail.scores?.perspective} />
                   <ScoreRow label="Tone" value={detail.scores?.tone} />
                </div>
            </div>
          </div>

          {/* Feedback Tabs (Strengths & Weaknesses) */}
          <div className="grid md:grid-cols-2 gap-4">
             <FeedbackBox title="Strengths" items={detail.feedback?.strengths} color="green" />
             <FeedbackBox title="Areas for Improvement" items={detail.feedback?.weaknesses} color="red" />
          </div>

          {/* Costs & Transcript */}
          <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-900 rounded-2xl p-6 md:col-span-2">
                 <h3 className="text-green-500 font-mono text-xs mb-4">TERMINAL_TRANSCRIPT_VIEW:</h3>
                 <div className="font-mono text-xs text-slate-300 space-y-3 h-[200px] overflow-y-auto pr-2">
                    {detail.transcript.split('\n').map((line, i) => (
                      <p key={i} className={line.startsWith('User:') ? 'text-green-400 border-l border-green-900/50 pl-2' : 'text-slate-400'}>{line}</p>
                    ))}
                 </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase mb-4">Session Economics</h3>
                  <div className="space-y-3 font-mono text-xs text-gray-600">
                    <div className="flex justify-between font-bold text-gray-900 text-sm"><span>Total Cost:</span><span>${detail.cost?.total}</span></div>
                    <hr />
                    <div className="flex justify-between"><span>STT:</span><span>${detail.cost?.stt}</span></div>
                    <div className="flex justify-between"><span>LLM:</span><span>${detail.cost?.llm}</span></div>
                    <div className="flex justify-between"><span>TTS:</span><span>${detail.cost?.tts}</span></div>
                  </div>
              </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button onClick={onClose} className="px-8 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

/* Helper UI Components */
function ScoreRow({ label, value, max = "10" }) {
  const percentage = (value / max) * 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-bold uppercase">
        <span className="text-gray-500">{label}</span>
        <span className="text-gray-900">{value}/{max}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}

function FeedbackBox({ title, items, color }) {
  const colors = {
    green: "bg-green-50 text-green-700 border-green-200",
    red: "bg-red-50 text-red-700 border-red-200"
  };
  return (
    <div className={`p-4 rounded-xl border ${colors[color]}`}>
      <h4 className="text-xs font-black uppercase mb-3 tracking-widest">{title}</h4>
      <ul className="text-xs space-y-2 list-disc pl-4">
        {items?.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  );
}