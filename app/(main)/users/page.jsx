'use client';
import React, { useState } from 'react';
import { Users, UserPlus } from 'lucide-react';
import InnerNavbar from '../../../components/navbar.jsx';
import SearchInput from '../../../components/search.jsx';
import FilterBar from '../../../components/FilterBar.jsx';
import AllUsers from './allUsers/AllUsers.jsx';
import AddUser from './addUser/AddUser.jsx';

export default function UserPage() {
  const [currentView, setCurrentView] = useState('All Users');
  const [searchQuery, setSearchQuery] = useState('');

  // حالات الفلاتر
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDeletedStatus, setSelectedDeletedStatus] = useState('');

  const filterConfigs = [
    {
      placeholder: "All Roles",
      value: selectedRole,
      onChange: setSelectedRole,
      options: [
        { label: 'ADMIN', val: 'admin' },
        { label: 'USER', val: 'user' },
      ]
    },
    {
      placeholder: "All Status",
      value: selectedStatus,
      onChange: setSelectedStatus,
      options: [
        { label: 'ACTIVE', val: 'active' },
        { label: 'INACTIVE', val: 'inactive' },
      ]
    },
    {
      placeholder: "Account Status",
      value: selectedDeletedStatus,
      onChange: setSelectedDeletedStatus,
      options: [
        { label: 'NOT DELETED', val: 'not_deleted' },
        { label: 'DELETED', val: 'deleted' },
      ]
    }
  ];

  const handleReset = () => {
    setSelectedRole('');
    setSelectedStatus('');
    setSelectedDeletedStatus('');
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900 italic uppercase">User Management</h1>
        <p className="text-gray-400 text-sm font-bold">Refine your team and permissions</p>
      </div>

      <InnerNavbar 
        activeTabLabel={currentView}
        onTabChange={(label) => setCurrentView(label)} 
        items={[
          { icon: Users, label: 'All Users' },
          { icon: UserPlus, label: 'Add User', role: 'admin' }
        ]}
      />

      {currentView === 'All Users' && (
        <div className="mt-8 space-y-4">
          <SearchInput onQueryChange={(value) => setSearchQuery(value)} />
          <FilterBar configs={filterConfigs} onReset={handleReset} />
        </div>
      )}

      <div className="mt-8 bg-white p-2 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm min-h-[500px]">
        {currentView === 'All Users' && (
          <AllUsers 
            searchTerm={searchQuery} 
            filters={{
              role: selectedRole,
              status: selectedStatus,
              deletedStatus: selectedDeletedStatus,
            }}
          />
        )}
        {currentView === 'Add User' && <AddUser />}
      </div>
    </div>
  );
}