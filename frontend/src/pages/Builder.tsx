import React, { useCallback } from 'react';
import { JobInputPanel } from '../components/JobInputPanel';
import { ProfileForm } from '../components/ProfileForm';
import { LatexEditor } from '../components/LatexEditor';
import { PdfPreview } from '../components/PdfPreview';
import { ChatPanel } from '../components/ChatPanel';
import { TabSwitcher } from '../components/TabSwitcher';
import { DownloadButton } from '../components/DownloadButton';
import { useAppStore } from '../store/appStore';

export function Builder() {
  const { activeTab, setResumeLatex, setCoverLetterLatex, isGenerating, resumeLatex, coverLetterLatex } = useAppStore();

  const handleEditorChange = useCallback(
    (latex: string) => {
      if (activeTab === 'resume') setResumeLatex(latex);
      else setCoverLetterLatex(latex);
    },
    [activeTab, setResumeLatex, setCoverLetterLatex]
  );

  const hasContent = !!(resumeLatex || coverLetterLatex);

  return (
    <div className="flex h-full w-full bg-[var(--bg-color)] p-3 gap-3 overflow-hidden">
      {/* LEFT SIDEBAR - The Form */}
      <aside className="card flex flex-col w-[400px] min-w-[400px] bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          <JobInputPanel />
          <hr className="border-slate-100" />
          <ProfileForm />
        </div>
      </aside>

      {/* MIDDLE & RIGHT WRAPPER - The Overleaf split */}
      <div className="flex-1 flex gap-3 min-w-0">
        {/* MIDDLE - Editor */}
        <section className="card flex-1 flex flex-col min-w-0 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 shrink-0 bg-white">
            <div className="flex items-center gap-4">
              <TabSwitcher />
              {isGenerating && (
                <span className="flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                  AI Generating...
                </span>
              )}
            </div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden xl:block">Source Code</span>
          </div>
          <div className="flex-1 overflow-hidden bg-white">
            {isGenerating && !hasContent ? (
              <div className="h-full flex flex-col gap-3 p-8">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div key={i} className="h-3.5 rounded-md bg-slate-100 animate-pulse" style={{ width: `${Math.random() * 50 + 20}%` }} />
                ))}
              </div>
            ) : (
              <LatexEditor onContentChange={handleEditorChange} />
            )}
          </div>
        </section>

        {/* RIGHT - Document Preview */}
        <section className="card flex-1 flex flex-col min-w-0 bg-slate-50 rounded-xl shadow-sm border border-slate-200/60 overflow-hidden relative">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200/60 shrink-0 bg-white shadow-sm z-10">
            <span className="text-[12px] font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Live Preview
            </span>
            <DownloadButton />
          </div>
          <div className="flex-1 overflow-hidden relative">
            <PdfPreview />
          </div>
        </section>
      </div>
    </div>
  );
}
