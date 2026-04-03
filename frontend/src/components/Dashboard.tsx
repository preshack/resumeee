import React from 'react';
import { PenTool, FileText, CheckCircle, BarChart3, Plus, Search, User } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export function Dashboard() {
  const { setCurrentView } = useAppStore();

  const mockDocuments = [
    { title: 'Software Engineer @ Google', date: 'Oct 24, 2026', status: 'ATS Score: 96%', icon: <FileText size={18} className="text-blue-500" /> },
    { title: 'Backend Dev @ Netflix', date: 'Oct 15, 2026', status: 'ATS Score: 92%', icon: <FileText size={18} className="text-emerald-500" /> },
    { title: 'Data Scientist @ OpenAI', date: 'Sep 30, 2026', status: 'ATS Score: 94%', icon: <FileText size={18} className="text-blue-500" /> },
  ];

  const stats = [
    { label: 'Resumes Built', value: '14', icon: <FileText size={20} className="text-indigo-500" /> },
    { label: 'Avg. ATS Match', value: '94%', icon: <CheckCircle size={20} className="text-emerald-500" /> },
    { label: 'Interviews Landed', value: '3', icon: <BarChart3 size={20} className="text-orange-500" /> },
  ];

  return (
    <div className="w-full h-full bg-[#f8faff] overflow-y-auto overflow-x-hidden flex flex-col items-center py-10 px-8">
      
      {/* Top Navbar Area */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
            <PenTool size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-[20px] font-extrabold text-slate-800 leading-none tracking-tight">
              Resume<span className="text-blue-600">Lift</span>
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search documents..." className="bg-white border border-slate-200 text-[13px] rounded-full py-2 pl-9 pr-4 w-[240px] focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm" />
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer hover:bg-slate-300 transition-colors">
            <User size={16} />
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl">
        {/* Welcome Header */}
        <div className="mb-8 animate-in">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome back, Preshak</h2>
          <p className="text-slate-500 mt-2 text-[15px]">You have 3 active applications. Keep up the momentum.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-6 mb-10 animate-in" style={{ animationDelay: '100ms' }}>
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm shadow-slate-200/50 flex items-center gap-5 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                {stat.icon}
              </div>
              <div>
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-2xl font-extrabold text-slate-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-[16px] font-bold text-slate-800 mb-5 animate-in" style={{ animationDelay: '150ms' }}>Your Documents</h3>

        {/* Action Grid */}
        <div className="grid grid-cols-4 gap-6 animate-in" style={{ animationDelay: '200ms' }}>
          
          {/* Create New Card */}
          <button 
            onClick={() => setCurrentView('builder')}
            className="group flex flex-col items-center justify-center h-[240px] bg-blue-50/50 rounded-2xl border-2 border-dashed border-blue-200 hover:border-blue-500 hover:bg-blue-50 transition-all active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-blue-600 group-hover:text-white shadow-sm">
              <Plus size={24} />
            </div>
            <span className="font-bold text-blue-700 text-[14px]">Create New Resume</span>
            <span className="text-blue-500/70 text-[12px] mt-1">Start from JD</span>
          </button>

          {/* Mocked Documents */}
          {mockDocuments.map((doc, i) => (
            <div key={i} className="flex flex-col h-[240px] bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-auto">
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                  {doc.icon}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-[15px] leading-tight mb-2 group-hover:text-blue-600 transition-colors">{doc.title}</h4>
                <div className="flex items-center justify-between mt-4 border-t border-slate-100 pt-3">
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">{doc.status}</span>
                  <span className="text-[11px] font-medium text-slate-400">{doc.date}</span>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
