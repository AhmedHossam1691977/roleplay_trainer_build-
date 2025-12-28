'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Vapi from "@vapi-ai/web"; // استيراد المكتبة
import { 
  PhoneOff, Mic, Loader2, ArrowLeft, 
  MessageSquare, User, Bot, AlertCircle 
} from 'lucide-react';

export default function CallPage() {
  const { id } = useParams();
  const router = useRouter();
  
  // Refs & States
  const vapiRef = useRef(null); // تخزين الـ instance الخاص بـ Vapi
  const [isCallActive, setIsCallActive] = useState(false);
  const [transcript, setTranscript] = useState({ role: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. إعداد Vapi عند أول رندر
  useEffect(() => {
    // استبدل هذا بالمفتاح العام الخاص بك (Public Key)
    const vapi = new Vapi("f4643b74-cff4-4c12-b214-deb65e2f58c5");
    vapiRef.current = vapi;

    // مستمعي الأحداث (Event Listeners)
    vapi.on("call-start", () => {
      setIsCallActive(true);
      setLoading(false);
    });

    vapi.on("call-end", () => {
      setIsCallActive(false);
      setLoading(false);
    });

    vapi.on("message", (message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        setTranscript({ role: message.role, text: message.transcript });
      }
    });

    vapi.on("error", (e) => {
      console.error("Vapi Error:", e);
      setError("حدث خطأ في الاتصال الصوتي");
      setLoading(false);
    });

    // تنظيف الاتصال عند مغادرة الصفحة
    return () => {
      vapi.stop();
    };
  }, []);

  // 2. دالة بدء المكالمة (استدعاء الـ Backend أولاً)
  const startSession = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      const response = await fetch(
        "https://final-pro-api-j1v7.onrender.com/sessions/startWebCall",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({ scenarioId: id }),
        }
      );

      const config = await response.json();

      if (!response.ok) throw new Error(config.message || "Failed to get config");


      vapiRef.current.start(config.assistant);

    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  // 3. دالة إنهاء المكالمة
  const endSession = () => {
    vapiRef.current.stop();
    router.back();
  };

  return (
    <div className="h-screen bg-slate-950 text-white flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <div className="p-6 flex items-center justify-between bg-slate-900/40 border-b border-slate-800">
        <button onClick={() => router.back()} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-blue-400">AI Roleplay Session</h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">Vapi AI Engine</p>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Main UI */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        {/* Wave Animation when Active */}
        {isCallActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 bg-blue-500/20 rounded-full animate-ping blur-xl"></div>
          </div>
        )}

        <div className="relative z-10 flex flex-col items-center">
          <div className={`w-40 h-40 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${isCallActive ? 'border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.3)] scale-110' : 'border-slate-800 bg-slate-900'}`}>
            <Bot size={80} className={isCallActive ? 'text-blue-500' : 'text-slate-700'} />
          </div>

          <div className="mt-8 text-center">
            {!isCallActive ? (
              <p className="text-slate-400 font-medium">Ready to start your training?</p>
            ) : (
              <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-xs tracking-widest">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                System Live
              </div>
            )}
          </div>
        </div>

        {/* Transcript Box */}
        {transcript.text && (
          <div className="mt-12 max-w-md w-full bg-slate-900/50 border border-slate-800 p-4 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase text-slate-500">
              {transcript.role === 'assistant' ? <Bot size={14}/> : <User size={14}/>}
              {transcript.role}
            </div>
            <p className="text-sm text-slate-300 italic">{transcript.text}</p>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center gap-2 text-red-400 bg-red-400/10 px-4 py-2 rounded-lg border border-red-400/20">
            <AlertCircle size={16} />
            <span className="text-xs font-medium">{error}</span>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="p-12 bg-slate-900/50 flex justify-center items-center gap-6">
        {!isCallActive ? (
          <button
            onClick={startSession}
            disabled={loading}
            className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Mic size={24} />}
            {loading ? "Initializing..." : "Start Voice Call"}
          </button>
        ) : (
          <button
            onClick={endSession}
            className="flex items-center gap-3 bg-red-500 hover:bg-red-600 px-10 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-500/20"
          >
            <PhoneOff size={24} />
            End Training
          </button>
        )}
      </div>
    </div>
  );
}