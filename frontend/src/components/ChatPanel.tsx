import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageCircle } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useChat } from '../hooks/useChat';

export function ChatPanel() {
  const { chatHistory, isStreaming, hasGenerated } = useAppStore();
  const { sendMessage } = useChat();
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory]);

  const handleSend = async () => {
    const msg = input.trim();
    if (!msg || isStreaming) return;
    setInput('');
    await sendMessage(msg);
  };

  const suggestions = ['Make it more concise', 'Add more keywords', 'Emphasize leadership'];

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-2.5">
        <MessageCircle size={10} className="text-[#bbb]" />
        <span className="section-label">Refine with AI</span>
      </div>

      <div className="overflow-y-auto space-y-2 mb-2.5" style={{ maxHeight: '180px', minHeight: '60px' }}>
        {chatHistory.length === 0 ? (
          <div className="text-center py-3">
            <Bot size={18} className="text-[#ddd] mx-auto mb-2" />
            <p className="text-[11px] text-[#bbb] mb-2">{hasGenerated ? 'Ask me to refine your documents' : 'Generate documents first'}</p>
            {hasGenerated && (
              <div className="flex flex-wrap gap-1 justify-center">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => { setInput(s); inputRef.current?.focus(); }}
                    className="text-[10px] text-[#666] bg-[#f3f4f6] border border-[#e5e7eb] px-2 py-1 rounded hover:bg-[#e5e7eb] transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          chatHistory.map((msg) => (
            <div key={msg.id} className={`flex gap-2 animate-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[#1a1a2e]' : 'bg-[#f3f4f6]'}`}>
                {msg.role === 'user' ? <User size={9} className="text-white" /> : <Bot size={9} className="text-[#666]" />}
              </div>
              <div className={`max-w-[80%] rounded-xl px-3 py-1.5 text-[12px] leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#1a1a2e] text-white rounded-tr-sm'
                  : 'bg-[#f3f4f6] text-[#333] rounded-tl-sm'
              }`}>
                {msg.content || (msg.isStreaming ? (
                  <span className="flex gap-1 items-center py-0.5">
                    <span className="w-1 h-1 bg-[#999] rounded-full animate-bounce" />
                    <span className="w-1 h-1 bg-[#999] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-1 bg-[#999] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                ) : '')}
              </div>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>

      <div className="flex gap-2">
        <input ref={inputRef} id="chat-input" type="text" value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder={hasGenerated ? 'e.g. "Add Python skill"' : 'Generate first...'}
          disabled={!hasGenerated || isStreaming}
          className="input-clean flex-1 text-[12px] disabled:opacity-40 disabled:cursor-not-allowed" />
        <button onClick={handleSend} disabled={!hasGenerated || isStreaming || !input.trim()}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1a1a2e] text-white disabled:opacity-30 transition-all active:scale-95 shrink-0">
          {isStreaming ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={12} />}
        </button>
      </div>
    </div>
  );
}
