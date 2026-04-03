import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Loader2, FileText, AlertCircle, RefreshCw } from 'lucide-react';
import { useAppStore } from '../store/appStore';

const DEBOUNCE_MS = 1500;

export function PdfPreview() {
  const { activeTab, resumeLatex, coverLetterLatex, isGenerating } = useAppStore();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCompiledLatex = useRef<string>('');

  const currentLatex = activeTab === 'resume' ? resumeLatex : coverLetterLatex;

  const compilePdf = useCallback(async (latex: string, force = false) => {
    if (!latex.trim()) {
      setPdfUrl(null);
      return;
    }
    
    // Don't recompile if the latex hasn't changed, unless forced
    if (!force && latex === lastCompiledLatex.current && pdfUrl) return;

    setIsCompiling(true);
    setError(null);

    // Extract pure LaTeX to prevent compiler crashing on markdown backticks or AI chat text
    let pureLatex = latex;
    const startIdx = pureLatex.indexOf('\\documentclass');
    if (startIdx !== -1) {
      const endIdx = pureLatex.lastIndexOf('\\end{document}');
      if (endIdx !== -1) {
        pureLatex = pureLatex.slice(startIdx, endIdx + 14); // 14 is length of \end{document}
      } else {
        pureLatex = pureLatex.slice(startIdx);
        pureLatex = pureLatex.replace(/```[\s\S]*$/, '');
      }
    }

    try {
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latex: pureLatex }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Compilation failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      // Cleanup previous url
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      
      setPdfUrl(url);
      lastCompiledLatex.current = latex;
    } catch (err) {
      console.error('PDF Compile Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to compile PDF');
    } finally {
      setIsCompiling(false);
    }
  }, [pdfUrl]);

  // Handle automatic compilation after debouncing
  useEffect(() => {
    if (!currentLatex.trim()) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    debounceRef.current = setTimeout(() => {
      compilePdf(currentLatex);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [currentLatex, compilePdf]);

  const isEmpty = !currentLatex.trim();

  return (
    <div className="h-full flex flex-col items-center justify-start overflow-y-auto w-full p-6">
      
      {/* Floating Toolbar inside Preview */}
      {!isEmpty && (
        <div className="absolute top-4 right-6 z-20 flex gap-2">
          <button 
            onClick={() => compilePdf(currentLatex, true)}
            disabled={isCompiling}
            className="bg-white border border-slate-200 shadow-sm text-slate-600 text-[11px] font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-slate-50 hover:text-blue-600 transition-all disabled:opacity-50"
          >
            <RefreshCw size={12} className={isCompiling ? "animate-spin" : ""} />
            Recompile
          </button>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="w-full max-w-[210mm] mb-4 bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-2.5 shadow-sm">
          <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
          <div className="text-[12px] text-red-800 font-medium">
            <p className="mb-1">LaTeX Compilation Error</p>
            <pre className="font-mono text-[10px] text-red-600/80 whitespace-pre-wrap line-clamp-3">{error}</pre>
          </div>
          <button onClick={() => compilePdf(currentLatex, true)} className="ml-auto text-[11px] text-red-600 hover:underline">Retry</button>
        </div>
      )}

      {/* Document Container */}
      <div className="relative w-full max-w-[210mm] transition-all duration-300 mx-auto">
        
        {isEmpty && !isGenerating ? (
          <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center" style={{ aspectRatio: '1/1.414' }}>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText size={28} />
              </div>
              <p className="text-[14px] font-semibold text-slate-700">Preview Document</p>
              <p className="text-[12px] text-slate-400 mt-1 max-w-[200px] mx-auto text-balance">
                Fill out the form and hit generate to see your professional resume.
              </p>
            </div>
          </div>
        ) : isGenerating && !pdfUrl ? (
          <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center" style={{ aspectRatio: '1/1.414' }}>
            <div className="text-center">
              <Loader2 size={32} className="animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-[14px] font-semibold text-slate-700">Generating AI Document...</p>
              <p className="text-[12px] text-slate-400 mt-1">Applying ATS optimizations</p>
            </div>
          </div>
        ) : (
          <div className="relative w-full shadow-lg shadow-slate-200/50 rounded-lg overflow-hidden border border-slate-200" style={{ height: 'calc(210mm * 1.414)', minHeight: '800px' }}>
            
            {/* Loading Overlay */}
            {isCompiling && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                <div className="bg-white shadow-xl rounded-full p-3 flex items-center justify-center">
                  <Loader2 size={20} className="animate-spin text-blue-600" />
                </div>
              </div>
            )}

            {/* Actual PDF Viewer */}
            {pdfUrl ? (
              <iframe
                src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-full bg-white"
                title={`${activeTab === 'resume' ? 'Resume' : 'Cover Letter'} PDF Preview`}
              />
            ) : (
              <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                <p className="text-sm text-slate-400">Rendering PDF...</p>
              </div>
            )}
            
          </div>
        )}
      </div>
    </div>
  );
}
