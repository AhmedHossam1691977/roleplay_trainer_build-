'use client';
import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Users, Target, Award } from 'lucide-react';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = "https://final-pro-api-j1v7.onrender.com";

  useEffect(() => {
    fetch(`${baseUrl}/api/v1/dashboardAnalytics`, {
      headers: {
        token: localStorage.getItem('token')
      }
    })
      .then(res => res.json())
      .then(result => {
        setData(result.data);
        console.log(result);
        
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg font-semibold text-gray-500">
        Loading Dashboard...
      </div>
    );
  }

  /* =======================
     Cards
  ======================= */
  const stats = [
    {
      title: 'Total Sessions',
      value: data?.cards.totalSessions,
      icon: TrendingUp,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Active Users',
      value: data?.cards.activeUsers,
      icon: Users,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Completed Trainings',
      value: data?.cards.completedTrainings,
      icon: Target,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Average Score',
      value: data?.cards.averageScore.toFixed(1),
      icon: Award,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  /* =======================
     Session Activity Chart
  ======================= */
  const sessionActivityData = data?.sessionActivity.map(item => ({
    name: `${item._id.day}/${item._id.month}`,
    sessions: item.sessions,
    completions: item.completions
  }));

  /* =======================
     Performance Chart
  ======================= */
  const performanceData = [
    {
      category: 'Empathy',
      current: data?.evaluations.avgEmpathy || 0
    },
    {
      category: 'Problem Solving',
      current: data?.evaluations.avgProblemSolving || 0
    },
    {
      category: 'Leadership',
      current: data?.evaluations.avgLeadership || 0
    }
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-8 text-gray-800">Analytics Dashboard</h1>

        {/* ================= Cards ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon size={28} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= Charts ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

          {/* Session Activity */}
          <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Session Activity</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sessionActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="sessions" stroke="#3b82f6" strokeWidth={2} />
                <Line dataKey="completions" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Performance */}
          <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="current" fill="#3b82f6" barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ================= Extra Metrics ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 hover:shadow-lg transition-shadow">
            <p className="text-sm text-gray-400">Total Users</p>
            <p className="text-2xl font-bold text-gray-800">{data?.users.totalUsers}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 hover:shadow-lg transition-shadow">
            <p className="text-sm text-gray-400">Total Evaluations</p>
            <p className="text-2xl font-bold text-gray-800">{data?.evaluations.totalEvaluations}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 hover:shadow-lg transition-shadow">
            <p className="text-sm text-gray-400">Total Scenarios</p>
            <p className="text-2xl font-bold text-gray-800">{data?.scenarios.total}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
