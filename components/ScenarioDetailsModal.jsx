'use client';
import React from 'react';
import { Clock, X, Target, Briefcase, Info } from 'lucide-react';

export default function ScenarioDetailsModal({ scenario, isOpen, onClose, getDifficultyStyle, getCustomerStyle }) {
  if (!isOpen || !scenario) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-100">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
          <h3 className="text-2xl font-black text-gray-900 pr-8">{scenario.title}</h3>
          <div className="mt-2 flex gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getDifficultyStyle(scenario.difficultyLevel)}`}>
              {scenario.difficultyLevel}
            </span>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase border border-blue-100">
              {scenario.role?.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          <div>
            <h4 className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase mb-2 tracking-widest">
              <Target size={16} /> prompt
            </h4>
            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100 italic">
              {scenario.prompt}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-gray-100 bg-white">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Customer</p>
              <div className="flex items-center gap-2 font-bold text-gray-800 capitalize">
                {getCustomerStyle(scenario.customerType).icon}
                {scenario.customerType}
              </div>
            </div>
            <div className="p-4 rounded-2xl border border-gray-100 bg-white">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Duration</p>
              <div className="flex items-center gap-2 font-bold text-gray-800">
                <Clock size={16} className="text-blue-500" />
                {scenario.expectedDuration} Min
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-white transition-colors"
          >
            Close
          </button>
          <button className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
            Start Training
          </button>
        </div>
      </div>
    </div>
  );
}