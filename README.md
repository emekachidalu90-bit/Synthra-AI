# Synthra AI

Synthra is an advanced AI assistant designed to feel both **human** and **high-performance**:
- **Quick Mode** for fast, smooth conversations ⚡
- **Deep Mode** for structured, high-quality reasoning 🧠
- Friendly professional tone with natural emoji usage where helpful

## Tech Stack
- Frontend: React + Tailwind + Vite
- Backend: Node.js + Express
- AI: Groq Chat Completions API

## Features
- Dynamic model routing by **mode + task + prompt intent**
- Session context support via message history
- Human-like response style prompt
- Production static hosting from Express in Render deployments
- API endpoints:
  - `POST /api/chat`
  - `GET /api/health`
  - `GET /api/models`

## Local Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables in `server/.env`:
   ```bash
   GROQ_API_KEY=your_groq_key
   PORT=8080
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   ```
3. Start app:
   ```bash
   npm run dev
   ```

## Where to put your API key

### Local development
Create `server/.env` (you can copy `server/.env.example`) and set:

```bash
GROQ_API_KEY=your_groq_api_key_here
```

### Render deployment
In Render dashboard for your service:
1. Open **Environment**.
2. Add variable `GROQ_API_KEY` (your Groq secret key).
3. Click **Save Changes** and trigger **Manual Deploy** (or redeploy).
4. Open `https://<your-render-url>/api/health` and confirm `"groqConfigured": true`.

## Render Deployment
This repo includes a `render.yaml` blueprint.

### Render environment variables
- `GROQ_API_KEY` (required for `/api/chat`)
- `NODE_ENV=production`
- `CORS_ORIGIN=*` (or lock this to your domain)

### Build & start
- Build command: `npm install && npm run build`
- Start command: `npm --workspace server run start`

In production, Express serves `client/dist` automatically.

## Model Routing Strategy
- **Deep Mode** → `llama-3.3-70b-versatile`
- **Coding intent/task** → `mixtral-8x7b-32768`
- **Quick conversation** → `llama-3.1-8b-instant`

You can tune this behavior in `server/src/modelRouter.js`.
