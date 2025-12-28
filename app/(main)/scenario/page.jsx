'use client';
import React, { useState, useMemo } from 'react';
import { LayoutGrid, PlusCircle } from 'lucide-react';
import InnerNavbar from '../../../components/navbar.jsx';
import AllScenario from './allScenario/allScenario.jsx';
import AddScenario from './addScenario/AddScenario.jsx';
import SearchInput from '../../../components/search.jsx';
import FilterBar from '../../../components/FilterBar.jsx';


export default function ScenarioPage() {
  const [currentView, setCurrentView] = useState('Active Scenarios');
  const [searchQuery, setSearchQuery] = useState('');
  

  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');


  const filterConfigs = [
    {
      placeholder: "All Roles",
      value: selectedRole,
      onChange: setSelectedRole,
      options: [
        { label: 'SALES', val: 'sales' },
        { label: 'CUSTOMER SUPPORT', val: 'customer_support' },
        { label: 'CALL CENTER', val: 'call_center' },
        { label: 'CUSTOMER SERVICE', val: 'customer_service' },
        { label: 'REAL ESTATE', val: 'real_estate' },
      ]
    },
    {
      placeholder: "All Difficulties",
      value: selectedDifficulty,
      onChange: setSelectedDifficulty,
      options: [
        { label: 'EASY', val: 'easy' },
        { label: 'MEDIUM', val: 'medium' },
        { label: 'HARD', val: 'hard' },
      ]
    },
    {
      placeholder: "All Customer Types",
      value: selectedCustomer,
      onChange: setSelectedCustomer,
      options: [
        { label: 'ANGRY', val: 'angry' },
        { label: 'NORMAL', val: 'normal' },
        { label: 'CONFUSED', val: 'confused' },
        { label: 'HESITANT', val: 'hesitant' },
      ]
    }
  ];

  const handleReset = () => {
    setSelectedRole('');
    setSelectedDifficulty('');
    setSelectedCustomer('');
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900 italic">Scenario Hub</h1>
        <p className="text-gray-400 text-sm font-bold">Refine your skills through practice</p>
      </div>

      <InnerNavbar 
        activeTabLabel={currentView}
        onTabChange={(label) => setCurrentView(label)} 
        items={[
          { icon: LayoutGrid, label: 'Active Scenarios' },
          { icon: PlusCircle, label: 'Add Scenario', role: 'admin' }
        ]}
      />

      {currentView === 'Active Scenarios' && (
        <div className="mt-8 space-y-4">
          <SearchInput onQueryChange={(value) => setSearchQuery(value)} />
          
          <FilterBar 
            configs={filterConfigs} 
            onReset={handleReset} 
          />
        </div>
      )}

      <div className="mt-8 bg-white p-2 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm min-h-[500px]">
        {currentView === 'Active Scenarios' && (
          <AllScenario 
            searchTerm={searchQuery} 
            filters={{
              role: selectedRole,
              difficultyLevel: selectedDifficulty,
              customerType: selectedCustomer
            }}
          />
        )}
        {currentView === 'Add Scenario' && <AddScenario />}
      </div>
    </div>
  );
}