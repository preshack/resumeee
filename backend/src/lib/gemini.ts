import Groq from 'groq-sdk';

let client: Groq | null = null;

export function getGroqClient(): Groq {
  if (!client) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY environment variable is not set');
    }
    client = new Groq({ apiKey });
  }
  return client;
}

export const MODEL_ID = 'llama-3.1-8b-instant';
