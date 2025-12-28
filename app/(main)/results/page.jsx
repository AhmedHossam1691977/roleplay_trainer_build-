"use client";
import React, { useEffect, useState } from 'react';
import { 
  BarChart3, Target, Activity, DollarSign, TrendingUp, 
  Users, Loader2, Mail, Phone, Calendar, ShieldCheck, Hash
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell
} from 'recharts';

export default function UserFullAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://final-pro-api-j1v7.onrender.com/api/v1/dashboardAnalytics/getUserAnalytics`, {
          method: 'GET',
          headers: { 'token': localStorage.getItem('token') } // ضيف التوكن هنا
        });
        const result = await response.json();
        if (result.success) setAnalytics(result.data);
      } catch (err) {
        console.error("Error fetching:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-indigo-600" size={50} />
    </div>
  );

  // Mapping Chart Data
  const radarData = [
    { subject: 'Empathy', score: analytics.avgEmpathy },
    { subject: 'Tone', score: analytics.avgTone },
    { subject: 'Problem Solving', score: analytics.avgProblemSolving },
  ];

  const barData = [
    { name: 'Avg Score', value: analytics.avgScore, color: '#6366f1' },
    { name: 'Max Score', value: analytics.maxScore, color: '#a855f7' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-900" dir="ltr">
      
      {/* 1. Header & User Profile Summary */}
      <div className="max-w-7xl mx-auto mb-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
            {analytics.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">{analytics.name}</h1>
            <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
              <Mail size={14} /> {analytics.email}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold uppercase tracking-widest border border-emerald-100">
            {analytics.isActive ? '● Active' : '○ Inactive'}
          </span>
          <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold uppercase tracking-widest border border-indigo-100">
            {analytics.role}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Personal Info */}
        <div className="space-y-6">
          
          {/* Personal Details Card */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShieldCheck size={16} /> Identity Details
            </h3>
            <div className="space-y-4">
              <InfoRow icon={<Hash size={16}/>} label="User ID" value={analytics._id.slice(-8).toUpperCase()} />
              <InfoRow icon={<Calendar size={16}/>} label="Age / Birthday" value={`${analytics.age} Yrs (${new Date(analytics.birthDay).toLocaleDateString()})`} />
              <InfoRow icon={<Phone size={16}/>} label="Phone" value={analytics.phoneNumber} />
              <InfoRow icon={<Activity size={16}/>} label="Joined" value={new Date(analytics.createdAt).toLocaleDateString()} />
            </div>
          </div>

          {/* Mini Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <QuickStat label="Success Rate" value={`${analytics.successRate}%`} color="text-emerald-500" />
            <QuickStat label="Total Cost" value={`$${analytics.totalCost.toFixed(3)}`} color="text-amber-500" />
            <QuickStat label="Sessions" value={analytics.totalSessions} color="text-indigo-500" />
            <QuickStat label="Scenarios" value={analytics.totalScenarios} color="text-purple-500" />
          </div>
        </div>

        {/* Center Column: Skill Matrix (Radar Chart) */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 lg:col-span-1">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
            <Users size={22} className="text-indigo-600" /> Performance Matrix
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{fill: '#64748b', fontSize: 12}} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} />
                <Radar name="Skills" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 p-4 bg-slate-50 rounded-2xl text-xs text-slate-500 leading-relaxed">
            * Matrix represents average scores in Empathy, Tone, and Problem Solving on a scale of 1-10.
          </div>
        </div>

        {/* Right Column: Score Overview (Bar Chart) */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 lg:col-span-1">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
            <Target size={22} className="text-purple-600" /> Score Analysis
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={40}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 mt-6">
             <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-2xl">
                <span className="text-indigo-700 font-bold">Total Evaluations</span>
                <span className="text-2xl font-black text-indigo-700">{analytics.totalEvaluations}</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Helper Components
function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
      <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase">
        {icon} {label}
      </div>
      <div className="text-sm font-semibold text-slate-700">{value}</div>
    </div>
  );
}

function QuickStat({ label, value, color }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
      <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{label}</div>
      <div className={`text-xl font-black ${color}`}>{value}</div>
    </div>
  );
}