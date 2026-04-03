import React from 'react';
import { ChatPanel } from '../components/ChatPanel';
import { LatexEditor } from '../components/LatexEditor';
import { PdfPreview } from '../components/PdfPreview';
import { TabSwitcher } from '../components/TabSwitcher';
import { DownloadButton } from '../components/DownloadButton';
import { useAppStore } from '../store/appStore';

export function Chat() {
  const { activeTab, setResumeLatex, setCoverLetterLatex } = useAppStore();

  const handleEditorChange = React.useCallback(
    (latex: string) => {
      if (activeTab === 'resume') setResumeLatex(latex);
      else setCoverLetterLatex(latex);
    },
    [activeTab, setResumeLatex, setCoverLetterLatex]
  );

  return (
    <div className="flex h-full w-full bg-[var(--bg-color)] p-3 gap-3 overflow-hidden">
      {/* LEFT SIDEBAR - AI Context/Chat */}
      <aside className="card flex flex-col w-[400px] min-w-[400px] bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="font-bold text-slate-800">AI Refinement Chat</h2>
          <p className="text-xs text-slate-500 mt-1">Ask the AI to shorten bullets, change the tone, or reformat your active document.</p>
        </div>
        <div className="flex-1 overflow-hidden p-2">
          <ChatPanel />
        </div>
      </aside>

      {/* Editor & Preview Split */}
      <div className="flex-1 flex gap-3 min-w-0">
        <section className="card flex-1 flex flex-col min-w-0 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 shrink-0 bg-white">
            <TabSwitcher />
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden xl:block">Source Code</span>
          </div>
          <div className="flex-1 overflow-hidden bg-white">
            <LatexEditor onContentChange={handleEditorChange} />
          </div>
        </section>

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
