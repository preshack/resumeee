import React from 'react';
import { User, Mail, Link as LinkIcon, Briefcase } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { StrongLine } from '../components/StrongLine';

export function Profile() {
  const { userProfile } = useAppStore();

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <h2 className="text-3xl font-heading text-slate-800 mb-2">User Profile</h2>
      <p className="text-slate-500 font-medium tracking-wide mb-8">This data is injected into your generated resumes.</p>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-blue-600 h-24"></div>
        <div className="px-8 pb-8 relative">
          <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-blue-600 text-4xl -mt-12 mb-4">
            <User size={48} />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{userProfile.name}</h3>
          
          <div className="flex gap-6 mt-4 text-sm font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-slate-400" />
              {userProfile.email}
            </div>
            <div className="flex items-center gap-2">
              <LinkIcon size={16} className="text-slate-400" />
              {userProfile.linkedin || 'No LinkedIn'}
            </div>
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-slate-400" />
              {userProfile.experience.length} Roles
            </div>
          </div>
        </div>
      </div>
      
      <StrongLine />
    </div>
  );
}
