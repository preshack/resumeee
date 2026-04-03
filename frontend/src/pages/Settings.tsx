import React from 'react';

export function Settings() {
  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <h2 className="text-3xl font-heading text-slate-800 mb-2">Settings</h2>
      <p className="text-slate-500 font-medium tracking-wide mb-8">Manage your application preferences.</p>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Appearance</h3>
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
          <div>
            <div className="font-semibold text-slate-700">Dark Mode</div>
            <div className="text-sm text-slate-500">Toggle dark theme across the application.</div>
          </div>
          <div className="w-14 h-8 bg-slate-200 rounded-full relative cursor-not-allowed opacity-50">
            <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-all"></div>
          </div>
        </div>
        <p className="text-xs text-orange-500 mt-2 italic">* Dark mode coming soon.</p>
      </div>
    </div>
  );
}
