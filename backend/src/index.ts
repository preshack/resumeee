import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { generateRouter } from './routes/generate';
import { chatRouter } from './routes/chat';
import compileRouter from './routes/compile';

const app = express();
const PORT = process.env.PORT ?? 3001;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://applyai-app.run.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.some((o) => origin.startsWith(o))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);

app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/generate', generateRouter);
app.use('/api/chat', chatRouter);
app.use('/api/compile', compileRouter);

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const path = require('path') as typeof import('path');
  app.use(express.static(path.join(process.cwd(), 'public')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`ApplyAI backend running on port ${PORT}`);
});

export default app;
