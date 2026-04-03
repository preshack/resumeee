import React, { useEffect, useRef, useCallback } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { StreamLanguage } from '@codemirror/language';
import { stex } from '@codemirror/legacy-modes/mode/stex';
import { useAppStore } from '../store/appStore';

// Light theme for the editor
const lightTheme = EditorView.theme({
  '&': {
    fontSize: '12.5px',
    fontFamily: '"JetBrains Mono", monospace',
    backgroundColor: '#fafafa',
  },
  '.cm-content': {
    padding: '12px 0',
    minHeight: '100%',
    color: '#1a1a2e',
  },
  '.cm-gutters': {
    backgroundColor: '#fafafa',
    borderRight: '1px solid #f0f0f0',
    color: '#c0c0c0',
  },
  '.cm-lineNumbers .cm-gutterElement': {
    padding: '0 8px 0 4px',
    minWidth: '36px',
  },
  '.cm-scroller': { overflow: 'auto' },
  '.cm-activeLine': { backgroundColor: '#f0f4ff' },
  '.cm-activeLineGutter': { backgroundColor: '#f0f4ff' },
  '.cm-selectionBackground': { backgroundColor: '#c8d8ff !important' },
  '&.cm-focused .cm-selectionBackground': { backgroundColor: '#b4c8ff !important' },
  '.cm-cursor': { borderLeftColor: '#4f46e5' },
  '.cm-matchingBracket': { backgroundColor: '#e0e7ff', outline: '1px solid #a5b4fc' },
});

interface LatexEditorProps {
  onContentChange: (latex: string) => void;
}

export function LatexEditor({ onContentChange }: LatexEditorProps) {
  const { activeTab, resumeLatex, coverLetterLatex } = useAppStore();
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const updateFromStoreRef = useRef(false);

  const currentLatex = activeTab === 'resume' ? resumeLatex : coverLetterLatex;

  const initEditor = useCallback(() => {
    if (!editorRef.current) return;
    if (viewRef.current) viewRef.current.destroy();

    const state = EditorState.create({
      doc: currentLatex,
      extensions: [
        basicSetup,
        StreamLanguage.define(stex),
        lightTheme,
        EditorView.updateListener.of((update) => {
          if (update.docChanged && !updateFromStoreRef.current) {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
              onContentChange(update.state.doc.toString());
            }, 600);
          }
        }),
        EditorView.lineWrapping,
      ],
    });

    viewRef.current = new EditorView({ state, parent: editorRef.current });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    initEditor();
    return () => {
      viewRef.current?.destroy();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { initEditor(); }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const currentDoc = view.state.doc.toString();
    if (currentDoc === currentLatex) return;
    updateFromStoreRef.current = true;
    view.dispatch({ changes: { from: 0, to: currentDoc.length, insert: currentLatex } });
    updateFromStoreRef.current = false;
  }, [currentLatex]);

  return (
    <div ref={editorRef} className="h-full overflow-auto bg-[#fafafa]"
      aria-label={`LaTeX editor for ${activeTab === 'resume' ? 'Resume' : 'Cover Letter'}`} />
  );
}
