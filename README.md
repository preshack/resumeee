# resumeee

> AI-powered job application assistant — paste a job description, fill in your profile once, and get a tailored LaTeX resume + cover letter with live preview and real-time chat refinement.

![ApplyAI Screenshot](./screenshot-placeholder.png)

## Features

- **AI Generation** — Gemini 2.0 Flash generates ATS-optimised LaTeX resume + cover letter tailored to the job description
- **Live LaTeX Editor** — CodeMirror 6 with syntax highlighting; edit directly
- **Live Preview** — in-browser LaTeX rendering with A4 paper aesthetics
- **Chat Refinement** — streaming AI chat to refine your documents in real time
- **Profile Persistence** — your profile is saved to localStorage
- **PDF Export** — print-to-PDF or download raw `.tex` files
- **Dark Mode** — full dark UI with indigo accent

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS |
| Editor | CodeMirror 6 |
| Preview | latex.js (CDN) |
| State | Zustand |
| Backend | Node.js + Express + TypeScript |
| AI | Google Gemini 2.0 Flash via `@google/generative-ai` |
| Streaming | Server-Sent Events (SSE) |
| Deploy | Google Cloud Run |

---

## Local Development Setup

### Prerequisites

- Node.js 20+
- A Gemini API key — get one free at [aistudio.google.com](https://aistudio.google.com)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/applyai.git
cd applyai
```

### 2. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 3. Configure environment

```bash
cd ../backend
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### 4. Start development servers

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Cloud Run Deployment

### One-command deploy (after initial setup)

```bash
gcloud builds submit --config cloudbuild.yaml
```

### Initial setup

```bash
# 1. Create Artifact Registry repository
gcloud artifacts repositories create applyai \
  --repository-format=docker \
  --location=us-central1

# 2. Store your Gemini API key in Secret Manager
echo -n "YOUR_GEMINI_API_KEY" | \
  gcloud secrets create applyai-gemini-key --data-file=-

# 3. Grant Cloud Run access to the secret
gcloud secrets add-iam-policy-binding applyai-gemini-key \
  --member="serviceAccount:$(gcloud iam service-accounts list --filter='displayName:Default compute' --format='value(email)')" \
  --role="roles/secretmanager.secretAccessor"

# 4. Deploy
gcloud builds submit --config cloudbuild.yaml
```

The app will be live at the Cloud Run URL shown in the deploy output.

---

## Project Structure

```
applyai/
├── frontend/           # React + Vite frontend
│   └── src/
│       ├── components/ # UI components
│       ├── hooks/      # useGenerate, useChat
│       ├── lib/        # latexRenderer
│       └── store/      # Zustand store
├── backend/            # Express backend
│   └── src/
│       ├── routes/     # /api/generate, /api/chat
│       ├── prompts/    # System prompts
│       └── lib/        # Gemini client
├── Dockerfile          # Multi-stage build
├── cloudbuild.yaml     # Cloud Build CI/CD
└── README.md
```

---

## License

MIT
