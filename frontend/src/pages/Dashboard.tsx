import React from 'react';
import { FileText, Award, Target, Briefcase } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { StrongLine } from '../components/StrongLine';

export function Dashboard() {
  const { setCurrentPage } = useAppStore();

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <h2 className="text-3xl font-heading text-slate-800 mb-2">Welcome Back, Preshak!</h2>
      <p className="text-slate-500 font-medium tracking-wide mb-8">Ready to land your dream job?</p>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileText size={22} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">12</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Docs Built</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <Award size={22} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">92%</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg ATS Score</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Target size={22} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">45</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Applications</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
            <Briefcase size={22} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">5</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Interviews</div>
          </div>
        </div>
      </div>

      <StrongLine />

      {/* QUICK ACTIONS */}
      <h3 className="text-lg font-heading text-slate-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          onClick={() => setCurrentPage('builder')}
          className="group relative bg-white rounded-2xl border-2 border-slate-100 p-8 cursor-pointer hover:border-blue-500 hover:shadow-xl transition-all overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
            <FileText size={100} />
          </div>
          <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>
            <FileText size={24} />
          </div>
          <h4 className="text-xl font-bold text-slate-800 mb-2 relative">Create New Resume</h4>
          <p className="text-slate-500 relative">Generate a highly targeted ATS-friendly resume and cover letter using AI.</p>
        </div>
        
        <div 
          onClick={() => setCurrentPage('chat')}
          className="group relative bg-white rounded-2xl border-2 border-slate-100 p-8 cursor-pointer hover:border-accent hover:shadow-xl transition-all overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
            <Target size={100} />
          </div>
          <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-6" style={{ background: 'var(--accent)', color: 'white' }}>
            <Target size={24} />
          </div>
          <h4 className="text-xl font-bold text-slate-800 mb-2 relative">Refine Existing Documents</h4>
          <p className="text-slate-500 relative">Use the AI Chat agent to edit, format, or review your current drafts.</p>
        </div>
      </div>

      <StrongLine />
    </div>
  );
}
