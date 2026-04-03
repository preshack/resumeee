import { useAppStore } from '../store/appStore';

export function useGenerate() {
  const {
    jobDescription,
    userProfile,
    setIsGenerating,
    resetDocuments,
    appendResumeLatex,
    appendCoverLetterLatex,
    setResumeLatex,
    setCoverLetterLatex,
    setHasGenerated,
  } = useAppStore();

  const generate = async () => {
    if (!jobDescription.trim()) return;

    setIsGenerating(true);
    resetDocuments();

    let resumeAccum = '';
    let coverAccum = '';

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, userProfile }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;

          try {
            const event = JSON.parse(jsonStr) as {
              type: 'resume' | 'coverLetter' | 'done' | 'error';
              chunk?: string;
              message?: string;
            };

            if (event.type === 'resume' && event.chunk) {
              resumeAccum += event.chunk;
              
              // Clean IDE string of any markdown or partial separator artifacts from streaming
              let pureResume = resumeAccum;
              const startR = pureResume.indexOf('\\documentclass');
              const endR = pureResume.lastIndexOf('\\end{document}');
              if (startR !== -1) {
                 if (endR !== -1) pureResume = pureResume.slice(startR, endR + 14);
                 else pureResume = pureResume.slice(startR).replace(/```[\s\S]*$/, '').replace(/\n*===.*$/, '');
              }
              setResumeLatex(pureResume);
              
            } else if (event.type === 'coverLetter' && event.chunk) {
              coverAccum += event.chunk;
              
              let pureCover = coverAccum;
              const startC = pureCover.indexOf('\\documentclass');
              const endC = pureCover.lastIndexOf('\\end{document}');
              if (startC !== -1) {
                 if (endC !== -1) pureCover = pureCover.slice(startC, endC + 14);
                 else pureCover = pureCover.slice(startC).replace(/```[\s\S]*$/, '').replace(/\n*===.*$/, '');
              }
              setCoverLetterLatex(pureCover);
            } else if (event.type === 'done') {
              setHasGenerated(true);
            } else if (event.type === 'error') {
              throw new Error(event.message ?? 'Generation failed');
            }
          } catch {
            // Skip malformed events
          }
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Generation failed';
      // Surface error in a placeholder
      const errorLatex = `% Error: ${message}\n% Please try again.`;
      if (!resumeAccum) setResumeLatex(errorLatex);
      if (!coverAccum) setCoverLetterLatex(errorLatex);
    } finally {
      setIsGenerating(false);
    }
  };

  return { generate };
}
