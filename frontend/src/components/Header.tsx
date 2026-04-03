import React from 'react';
import { PenTool, User } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export function Header() {
  const { setCurrentPage } = useAppStore();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm border-b border-slate-100">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
          <PenTool size={20} className="text-white" />
        </div>
        <h1 className="text-xl font-extrabold text-slate-800">
          Resume<span className="text-blue-600">Lift</span>
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setCurrentPage('settings')}
          className="text-sm font-medium text-slate-600 hover:text-slate-800"
        >
          Settings
        </button>
        <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer hover:bg-slate-300 transition-colors">
          <User size={16} />
        </div>
      </div>
    </header>
  );
}
