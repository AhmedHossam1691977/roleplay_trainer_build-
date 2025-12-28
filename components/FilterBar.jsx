'use client';
import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

export default function FilterBar({ configs, onReset }) {

  
  const hasFilters = configs.some(config => config.value !== '');

  const selectClasses = "flex-1 min-w-[150px] px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer appearance-none hover:bg-gray-100 shadow-sm";

  return (
    <div className="flex flex-wrap gap-3 items-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 text-blue-600 px-3 py-1 bg-blue-50 rounded-lg border border-blue-100">
        <Filter size={16} />
        <span className="text-[10px] font-black uppercase tracking-wider">Filters</span>
      </div>

      {configs.map((filter, index) => (
        <div key={index} className="flex-1">
          <select 
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className={selectClasses}
          >
            <option value="">{filter.placeholder}</option>
            {filter.options.map((opt) => (
              <option key={opt.val} value={opt.val}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}

      {hasFilters && (
        <button 
          onClick={onReset}
          className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-500 rounded-xl text-xs font-black hover:bg-red-100 transition-all active:scale-95 ml-auto"
        >
          <RotateCcw size={14} /> RESET
        </button>
      )}
    </div>
  );
}