'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, GraduationCap, MessageSquare, BarChart3, Clock, LogOut, Menu, X, Users ,NotebookTabs  } from 'lucide-react';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          return JSON.parse(storedUser);
        } catch (err) {
          console.error('Failed to parse user:', err);
        }
      }
    }
    return { userName: '', role: '' };
  });

  const menuItems = [
    { icon: Home, label: 'Dashboard', link: '/' },
    { icon: MessageSquare, label: 'Scenarios', link: '/scenario' },
    { icon: BarChart3, label: 'Results & Analytics', link: '/results' ,role:"user" },
    { icon: Clock, label: 'History', link: '/history' , role: 'user'},
    { icon: GraduationCap, label: 'Evaluation', link: '/evaluation' , role: 'admin'},
    { icon: Users, label: 'User Management', link: '/users', role: 'admin' },
    { icon: NotebookTabs , label: 'Session Management', link: '/session', role: 'admin' },

  ];

  const filteredMenuItems = menuItems.filter(item => !item.role || item.role === user.role);

const handleLogout = () => {
  
  localStorage.clear();


  document.cookie.split(";").forEach((cookie) => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  });


  window.location.href = "/login";
};
  const getUserInitials = () => {
    if (!user?.userName) return 'AI';
    return user.userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      {/* Mobile Fixed Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-[60] h-16 flex items-center justify-between px-4">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="flex items-center gap-2 font-bold text-blue-600">
          <GraduationCap size={24} />
          <span className="text-sm">Roleplay AI</span>
        </div>
        <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
          {getUserInitials()}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[55]" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300 fixed top-0 left-0 z-[58]
          ${isCollapsed ? 'w-16' : 'w-64'}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Section - Desktop */}
        <div className="p-4 h-16 border-b border-gray-100 hidden lg:flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex-shrink-0 flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <GraduationCap size={24} />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="font-bold text-gray-900 truncate leading-tight">AI Trainer</h1>
              <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">Roleplay Platform</p>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto mt-16 lg:mt-0 pt-4">
          {filteredMenuItems.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all group"
            >
              <item.icon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
              {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User Profile & Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          {!isCollapsed ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white border border-gray-200 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {getUserInitials()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate tracking-tight">{user.userName || 'Guest User'}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{user.role || 'Trainee'}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 w-full px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-xs font-bold"
              >
                <LogOut size={16} /> SIGN OUT
              </button>
            </div>
          ) : (
            <button onClick={handleLogout} className="w-full flex justify-center text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
              <LogOut size={20} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}