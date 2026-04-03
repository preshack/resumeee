import React from 'react';
import { useAppStore } from '../store/appStore';
import type { ActiveTab } from '../store/appStore';
import { FileText, Mail } from 'lucide-react';

export function TabSwitcher({ className = '' }: { className?: string }) {
  const { activeTab, setActiveTab } = useAppStore();

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'resume', label: 'Resume', icon: <FileText size={12} /> },
    { id: 'coverLetter', label: 'Cover Letter', icon: <Mail size={12} /> },
  ];

  return (
    <div className={`flex bg-[#f0f0f0] rounded-lg p-0.5 gap-0.5 ${className}`} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-md text-[11px] font-semibold transition-all duration-200 ${
            activeTab === tab.id
              ? 'bg-white text-[#1a1a2e] shadow-sm'
              : 'text-[#888] hover:text-[#555]'
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
