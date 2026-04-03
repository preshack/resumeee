import React from 'react';
import { Home, FileText, MessageSquare, Settings, User } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export function Sidebar() {
  const { currentPage, setCurrentPage } = useAppStore();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={18} /> },
    { id: 'builder', label: 'Builder', icon: <FileText size={18} /> },
    { id: 'chat', label: 'Chat', icon: <MessageSquare size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col" style={{ height: 'calc(100vh - 24px)' }}>
      <nav className="flex-1 py-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id as any)}
            className={`flex items-center w-full px-5 py-2 text-left gap-3 transition-colors ${currentPage === item.id ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-slate-600 hover:bg-slate-50'} `}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
