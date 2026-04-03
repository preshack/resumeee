import { Router, Request, Response } from 'express';
import { getGroqClient, MODEL_ID } from '../lib/gemini';
import { SYSTEM_PROMPT } from '../prompts/systemPrompt';

export const generateRouter = Router();

interface UserProfile {
  name?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  skills?: string[];
  experience?: Array<{
    company?: string;
    role?: string;
    startDate?: string;
    endDate?: string;
    bullets?: string[];
  }>;
  education?: Array<{
    school?: string;
    degree?: string;
    year?: string;
  }>;
}

interface GenerateRequestBody {
  jobDescription: string;
  userProfile: UserProfile;
}

function buildPrompt(jobDescription: string, profile: UserProfile): string {
  const experience = (profile.experience ?? [])
    .map(
      (e) =>
        `  Company: ${e.company ?? 'N/A'}\n  Role: ${e.role ?? 'N/A'}\n  Dates: ${e.startDate ?? ''} – ${e.endDate ?? 'Present'}\n  Bullets:\n${(e.bullets ?? []).map((b) => `    - ${b}`).join('\n')}`
    )
    .join('\n\n');

  const education = (profile.education ?? [])
    .map((e) => `  ${e.degree ?? ''} at ${e.school ?? ''} (${e.year ?? ''})`)
    .join('\n');

  return `JOB DESCRIPTION:
${jobDescription}

CANDIDATE PROFILE:
Name: ${profile.name ?? 'N/A'}
Email: ${profile.email ?? 'N/A'}
Phone: ${profile.phone ?? 'N/A'}
LinkedIn: ${profile.linkedin ?? 'N/A'}
GitHub: ${profile.github ?? 'N/A'}
Skills: ${(profile.skills ?? []).join(', ')}

Work Experience:
${experience || '  (none provided)'}

Education:
${education || '  (none provided)'}

Now generate the resume and cover letter following your instructions exactly.`;
}

generateRouter.post('/', async (req: Request<object, object, GenerateRequestBody>, res: Response) => {
  const { jobDescription, userProfile } = req.body;

  if (!jobDescription?.trim()) {
    res.status(400).json({ error: 'jobDescription is required' });
    return;
  }

  // Set SSE headers
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
    const prompt = buildPrompt(jobDescription, userProfile ?? {});

    const stream = await groq.chat.completions.create({
      model: MODEL_ID,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 4000,
    });

    let fullText = '';
    let resumeSentLength = 0;
    let coverSentLength = 0;

    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content;
      if (!delta) continue;

      fullText += delta;

      const firstStart = fullText.indexOf('\\documentclass');
      const firstEnd = fullText.indexOf('\\end{document}', firstStart !== -1 ? firstStart : 0);
      const secondStart = firstEnd !== -1 ? fullText.indexOf('\\documentclass', firstEnd) : -1;

      // 1. Streaming Resume
      if (firstStart !== -1) {
        // If we haven't finished the resume yet, grab UP TO the end of it (or current end of stream)
        const resumeSliceEnd = firstEnd !== -1 ? firstEnd + 14 : fullText.length;
        const currentResume = fullText.slice(firstStart, resumeSliceEnd);
        
        if (currentResume.length > resumeSentLength) {
          sendEvent({ type: 'resume', chunk: currentResume.slice(resumeSentLength) });
          resumeSentLength = currentResume.length;
        }
      }

      // 2. Streaming Cover Letter
      if (secondStart !== -1) {
        // Extract from the second documentclass onwards
        const secondEnd = fullText.indexOf('\\end{document}', secondStart);
        const coverSliceEnd = secondEnd !== -1 ? secondEnd + 14 : fullText.length;
        const currentCover = fullText.slice(secondStart, coverSliceEnd);
        
        if (currentCover.length > coverSentLength) {
          sendEvent({ type: 'coverLetter', chunk: currentCover.slice(coverSentLength) });
          coverSentLength = currentCover.length;
        }
      }
    }

    sendEvent({ type: 'done' });
    res.end();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error occurred';
    sendEvent({ type: 'error', message });
    res.end();
  }
});
