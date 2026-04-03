import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Briefcase } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useGenerate } from '../hooks/useGenerate';

export function JobInputPanel() {
  const { jobDescription, setJobDescription, isGenerating, resetDocuments } = useAppStore();
  const { generate } = useGenerate();
  const [collapsed, setCollapsed] = useState(false);

  const handleGenerate = async () => {
    resetDocuments();
    await generate();
  };

  return (
    <div className="space-y-3">
      <button onClick={() => setCollapsed((c) => !c)} className="flex items-center justify-between w-full group">
        <span className="flex items-center gap-2 section-label group-hover:text-[#555] transition-colors">
          <Briefcase size={12} className="text-[#999]" />
          Job Description
        </span>
        {collapsed ? <ChevronDown size={14} className="text-[#ccc]" /> : <ChevronUp size={14} className="text-[#ccc]" />}
      </button>

      {!collapsed && (
        <div className="space-y-3 animate-in">
          <textarea
            id="job-description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here...&#10;&#10;Include job title, requirements, and responsibilities for the best results."
            rows={6}
            className="input-clean resize-none leading-relaxed text-[13px]"
          />
          {jobDescription.length > 50 && (
            <p className="text-[10px] text-emerald-600 flex items-center gap-1">✓ Ready — {jobDescription.length} chars</p>
          )}
        </div>
      )}

      <button
        id="generate-btn"
        onClick={handleGenerate}
        disabled={isGenerating || !jobDescription.trim()}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <span className="text-base leading-none">✦</span>
            Generate Resume & Cover Letter
          </>
        )}
      </button>
    </div>
  );
}
