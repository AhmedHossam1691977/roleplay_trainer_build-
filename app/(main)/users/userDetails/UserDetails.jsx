'use client';
import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Calendar, Phone, Star, 
  MessageSquare, TrendingDown, TrendingUp, 
  CheckCircle2, AlertCircle, DollarSign, Activity
} from 'lucide-react';

export default function UserDetails({ userId }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetailedUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://final-pro-api-j1v7.onrender.com/api/v1/user/${userId}`, {
          headers: { 'token': token }
        });
        const data = await response.json();
        
        if (data.message === "success") {
          setUserData(data.user);
        }
      } catch (err) {
        console.error("Error fetching details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchDetailedUser();
  }, [userId]);

  if (loading) return (
    <div className="p-10 text-center space-y-4">
      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
      <p className="animate-pulse font-bold text-gray-400 text-sm italic">loading...</p>
    </div>
  );
  
  if (!userData) return <div className="p-10 text-center text-red-500 font-bold">User Not Found</div>;

  return (
    <div className="space-y-6 max-h-[85vh] overflow-y-auto pr-2 custom-scrollbar p-1">
      
      <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-100">
          {userData.name?.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">{userData.name}</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full uppercase italic">
              {userData.role}
            </span>
            <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${userData.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {userData.isActive ? 'Active Now' : 'Inactive'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
          <ContactItem icon={<Mail size={12}/>} value={userData.email} />
          <ContactItem icon={<Phone size={12}/>} value={userData.phoneNumber || 'No Phone'} />
          <ContactItem icon={<Calendar size={12}/>} value={`${userData.age} Years`} />
          <ContactItem icon={<Activity size={12}/>} value={`v${userData.__v}`} />
        </div>
      </div>

      {/* 2. قسم التحليلات والتقييمات (Evaluations) */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 px-2">
          <Star size={14} className="text-orange-400" /> Performance History
        </h3>

        {userData.evaluations?.map((ev, idx) => (
          <div key={ev._id} className="group bg-white border border-gray-100 rounded-[2rem] overflow-hidden hover:border-blue-200 transition-all duration-300">
            {/* رأس التقييم */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex justify-between items-center">
              <span className="text-[10px] font-black text-gray-400 italic">SESSION #{idx + 1}</span>
              <span className="text-[10px] text-gray-400 font-mono">{new Date(ev.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* الجزء الأيسر: الخلاصة والنتائج */}
                <div className="lg:col-span-7 space-y-4">
                  <div className={`p-4 rounded-2xl border ${ev.analysis.success ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}>
                    <div className="flex items-center gap-2 mb-2">
                       {ev.analysis.success ? <TrendingUp size={16} className="text-green-600"/> : <TrendingDown size={16} className="text-red-600"/>}
                       <span className={`text-xs font-black ${ev.analysis.success ? 'text-green-700' : 'text-red-700'}`}>
                         {ev.analysis.success ? 'SUCCESSFUL INTERACTION' : 'UNRESOLVED ISSUE'}
                       </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line font-medium italic">
                      {ev.analysis.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    <ScoreCard label="Tone" score={ev.scores.tone} />
                    <ScoreCard label="Empathy" score={ev.scores.empathy} />
                    <ScoreCard label="Solving" score={ev.scores.problemSolving} />
                    <ScoreCard label="Flow" score={ev.scores.interruptions} />
                    <ScoreCard label="TOTAL" score={ev.scores.totalScore} max={100} primary />
                  </div>
                </div>

                {/* الجزء الأيمن: التكلفة والـ Transcript السريع */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                   <div className="bg-slate-900 rounded-3xl p-4 text-white">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                        <MessageSquare size={12} /> Transcript Preview
                      </h4>
                      <div className="text-[10px] space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar font-mono opacity-90">
                        {ev.transcript.split('\n').slice(0, 3).map((line, i) => (
                           <p key={i} className={line.startsWith('User') ? 'text-blue-400' : 'text-slate-300'}>{line}</p>
                        ))}
                        <p className="text-slate-500 italic">... Click to view full log</p>
                      </div>
                   </div>

                   <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Call Cost</span>
                      <div className="flex items-center gap-1 text-blue-600 font-black">
                        <DollarSign size={12} />
                        <span className="text-sm tracking-tighter">{ev.cost.total.toFixed(4)}</span>
                      </div>
                   </div>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

// --- المكونات الفرعية الجمالية ---

const ContactItem = ({ icon, value }) => (
  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
    <span className="text-blue-500">{icon}</span>
    <span className="text-[10px] font-bold text-gray-700 truncate max-w-[100px]">{value}</span>
  </div>
);

const ScoreCard = ({ label, score, max = 10, primary }) => (
  <div className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all ${primary ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100' : 'bg-white border-gray-100 text-gray-600 hover:border-blue-200'}`}>
    <span className={`text-[8px] font-black uppercase mb-1 ${primary ? 'opacity-80' : 'text-gray-400'}`}>{label}</span>
    <span className="text-sm font-black tracking-tighter">{score}<span className="text-[8px] opacity-50">/{max}</span></span>
  </div>
);