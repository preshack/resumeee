import React, { useState } from 'react';
import { Copy, Check, Printer, FileDown } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export function DownloadButton() {
  const { activeTab, resumeLatex, coverLetterLatex } = useAppStore();
  const [copied, setCopied] = useState(false);
  const currentLatex = activeTab === 'resume' ? resumeLatex : coverLetterLatex;
  const label = activeTab === 'resume' ? 'resume' : 'cover_letter';
  const disabled = !currentLatex.trim();

  const handleCopy = async () => {
    if (!currentLatex) return;
    await navigator.clipboard.writeText(currentLatex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!currentLatex) return;
    const blob = new Blob([currentLatex], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${label}.tex`; a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const iframe = document.getElementById('pdf-preview-iframe') as HTMLIFrameElement | null;
    if (iframe?.contentWindow) iframe.contentWindow.print();
    else window.print();
  };

  return (
    <div className="flex items-center gap-1">
      <button onClick={handleCopy} disabled={disabled} title="Copy LaTeX"
        className="flex items-center gap-1 text-[11px] text-[#888] hover:text-[#333] disabled:opacity-30 px-2 py-1.5 rounded-md hover:bg-[#f0f0f0] transition-all">
        {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
        {copied ? 'Copied' : 'Copy'}
      </button>
      <button onClick={handleDownload} disabled={disabled} title="Download .tex"
        className="flex items-center gap-1 text-[11px] text-[#888] hover:text-[#333] disabled:opacity-30 px-2 py-1.5 rounded-md hover:bg-[#f0f0f0] transition-all">
        <FileDown size={12} /> .tex
      </button>
      <button onClick={handlePrint} disabled={disabled} title="Print / PDF"
        className="flex items-center gap-1 text-[11px] bg-[#1a1a2e] text-white disabled:opacity-30 px-2.5 py-1.5 rounded-md hover:bg-[#2d2d4e] transition-all">
        <Printer size={12} /> PDF
      </button>
    </div>
  );
}
