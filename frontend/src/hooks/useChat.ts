import { useAppStore } from '../store/appStore';
import type { ChatMessage } from '../store/appStore';

export function useChat() {
  const {
    resumeLatex,
    coverLetterLatex,
    activeTab,
    chatHistory,
    addChatMessage,
    updateLastAssistantMessage,
    setResumeLatex,
    setCoverLetterLatex,
    setIsStreaming,
  } = useAppStore();

  const sendMessage = async (message: string, onLatexChange?: (tab: 'resume' | 'coverLetter') => void) => {
    if (!message.trim()) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
    };
    addChatMessage(userMsg);

    const assistantMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      isStreaming: true,
    };
    addChatMessage(assistantMsg);
    setIsStreaming(true);

    // Convert chat history for API (exclude the new messages we just added)
    const historyForApi = chatHistory
      .filter((m) => !m.isStreaming)
      .map((m) => ({
        role: m.role === 'assistant' ? ('model' as const) : ('user' as const),
        content: m.content,
      }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          resumeLatex,
          coverLetterLatex,
          activeTab,
          history: historyForApi,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';
      let accumulatedText = '';

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
              type: 'text' | 'latexUpdate' | 'done' | 'error';
              chunk?: string;
              latex?: string;
              tab?: 'resume' | 'coverLetter';
              message?: string;
            };

            if (event.type === 'text' && event.chunk) {
              accumulatedText += event.chunk;
              updateLastAssistantMessage(accumulatedText, true);
            } else if (event.type === 'latexUpdate' && event.latex) {
              const targetTab = event.tab ?? activeTab;
              if (targetTab === 'resume') {
                setResumeLatex(event.latex);
              } else {
                setCoverLetterLatex(event.latex);
              }
              onLatexChange?.(targetTab);
            } else if (event.type === 'done') {
              updateLastAssistantMessage(accumulatedText || 'Done!', false);
            } else if (event.type === 'error') {
              throw new Error(event.message ?? 'Chat error');
            }
          } catch {
            // Skip malformed events
          }
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Something went wrong';
      updateLastAssistantMessage(`Sorry, I encountered an error: ${errorMsg}`, false);
    } finally {
      setIsStreaming(false);
    }
  };

  return { sendMessage };
}
