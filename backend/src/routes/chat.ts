import { Router, Request, Response } from 'express';
import { getGroqClient, MODEL_ID } from '../lib/gemini';
import { CHAT_SYSTEM_PROMPT } from '../prompts/chatSystemPrompt';

export const chatRouter = Router();

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

interface ChatRequestBody {
  message: string;
  resumeLatex: string;
  coverLetterLatex: string;
  activeTab: 'resume' | 'coverLetter';
  history: ChatMessage[];
}

chatRouter.post('/', async (req: Request<object, object, ChatRequestBody>, res: Response) => {
  const { message, resumeLatex, coverLetterLatex, activeTab, history } = req.body;

  if (!message?.trim()) {
    res.status(400).json({ error: 'message is required' });
    return;
  }

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const sendEvent = (data: object) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const groq = getGroqClient();

    // Build context message
    // We hit strict token limits sending BOTH documents. We must only send the active document to conserve tokens.
    // Ensure we clearly tell the AI which document needs modifying.
    const activeDocName = activeTab === 'resume' ? 'Resume' : 'Cover Letter';
    const activeDocLatex = activeTab === 'resume' ? resumeLatex : coverLetterLatex;

    const contextMessage = `Current document being viewed and modified: ${activeDocName}

CURRENT SOURCE LATEX:
\`\`\`latex
${activeDocLatex}
\`\`\`

User request: ${message}`;

    // Convert history to Groq/OpenAI format
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: CHAT_SYSTEM_PROMPT },
      ...history.map((msg) => ({
        role: (msg.role === 'model' ? 'assistant' : 'user') as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user', content: contextMessage },
    ];

    const stream = await groq.chat.completions.create({
      model: MODEL_ID,
      messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 4000,
    });

    let fullResponse = '';
    let textSentLength = 0;
    let latexExtracted = false;

    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content;
      if (!delta) continue;

      fullResponse += delta;

      // Check if the response contains actual LaTeX code
      // A reliable indicator is \documentclass
      const latexStartIdx = fullResponse.indexOf('\\documentclass');
      const hasLatex = latexStartIdx !== -1;

      if (!hasLatex) {
        // Safe to stream as chat text, but hold back a bit just in case it's about to type \documentclass
        // If it's a short response, maybe it's just chat text. Let's hold back the last 15 chars if we suspect it might be about to type \documentclass.
        // Actually, just stream text normally if we haven't seen \documentclass
        if (fullResponse.length > textSentLength) {
          // Avoid streaming markdown code blocks markers
          let safeText = fullResponse.slice(textSentLength);
          safeText = safeText.replace(/```latex|```tex|```/g, ''); // strip markers from chat view
          if (safeText) {
            sendEvent({ type: 'text', chunk: safeText });
          }
          textSentLength = fullResponse.length;
        }
      } else {
        // We found LaTeX! 
        // Anything before \documentclass is chat text.
        if (!latexExtracted) {
          const beforeLatex = fullResponse.slice(0, latexStartIdx).replace(/```latex|```tex|```/g, '').trim();
          // Send whatever is before the latex block as text
          if (beforeLatex.length > textSentLength) {
            sendEvent({ type: 'text', chunk: beforeLatex.slice(textSentLength) });
          }
          latexExtracted = true;
          textSentLength = fullResponse.length; // Stop sending text for now
        }

        // We are currently streaming LaTeX. We want to update the IDE live!
        // The latex block is from \documentclass onwards.
        // Let's strip any trailing markdown markers
        let currentLatex = fullResponse.slice(latexStartIdx).replace(/```[\s\S]*$/, '');
        sendEvent({ type: 'latexUpdate', latex: currentLatex, tab: activeTab });
      }
    }

    // Final flush
    if (fullResponse.indexOf('\\documentclass') !== -1) {
      const latexStartIdx = fullResponse.indexOf('\\documentclass');
      let finalLatex = fullResponse.slice(latexStartIdx);
      
      // Clean up any trailing markdown
      const endDocIdx = finalLatex.indexOf('\\end{document}');
      if (endDocIdx !== -1) {
        finalLatex = finalLatex.slice(0, endDocIdx + 14); // 14 is length of \end{document}
      } else {
        // Strip markdown backticks if ending is missing
        finalLatex = finalLatex.replace(/```[\s\S]*$/, '');
      }

      sendEvent({ type: 'latexUpdate', latex: finalLatex, tab: activeTab });
    }

    sendEvent({ type: 'done' });
    res.end();
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Unknown error occurred';
    sendEvent({ type: 'error', message: errMsg });
    res.end();
  }
});
