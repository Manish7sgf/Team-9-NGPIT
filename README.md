# 🚀 AI Future Passport

### Team: Manish • Kishkindhan • Swetha • Shenbagapriya • Dinehkumar

> **Building Future-Ready Talent for the AI Era**

---

## 📦 What's Built

**Portfolio Generator** — complete, production-ready module:

- GitHub URL validation (client-side + server-side)
- Parallel GitHub API fetch: repo metadata + languages + README
- AI analysis via **Nvidia Nemotron Nano 9B v2** (`nvidia/nvidia-nemotron-nano-9b-v2`)
- PostgreSQL persistence + employability score recalculation
- Full React UI: input, loading states, AI result card, verified project grid

---

## � Project Structure

```
ai-future-passport/
├── client/                      # React + Vite frontend
│   ├── public/index.html
│   └── src/
│       ├── api/index.js         # Axios + JWT interceptors
│       ├── components/
│       │   ├── portfolio/
│       │   │   ├── RepoInput.jsx        # URL input + validation
│       │   │   ├── AnalysisResult.jsx   # AI result display
│       │   │   └── PortfolioCard.jsx    # Saved project card
│       │   └── ui/
│       │       ├── Button.jsx
│       │       ├── Input.jsx
│       │       ├── Badge.jsx
│       │       ├── Spinner.jsx
│       │       └── Toast.jsx
│       ├── pages/Portfolio.jsx  # Full page — orchestrates everything
│       ├── styles/globals.css   # Design system tokens
│       ├── App.jsx
│       └── main.jsx
│
├── server/                      # Node.js + Express backend
│   └── src/
│       ├── config/
│       │   ├── db.js            # PostgreSQL pool
│       │   └── nvidia.js        # Nvidia NIM client (OpenAI-compatible)
│       ├── middleware/
│       │   ├── auth.js          # JWT verify
│       │   └── errorHandler.js
│       ├── models/
│       │   └── portfolio.model.js
│       ├── services/
│       │   ├── nvidia.service.js   # All AI calls (analyseRepo, predictCareers, analyseSkillGap)
│       │   ├── github.service.js   # GitHub API (parallel fetch)
│       │   └── score.service.js    # Employability score calculation
│       ├── controllers/
│       │   └── portfolio.controller.js
│       ├── routes/
│       │   └── portfolio.routes.js
│       └── app.js
│
└── database/schema.sql          # Run once to create all tables
```

---

## ⚙️ Setup

### 1. Database

```bash
psql -U postgres -c "CREATE DATABASE aifuture;"
psql -U postgres -d aifuture -f database/schema.sql
```

### 2. Backend

```bash
cd server
npm install
# Edit .env — fill in DATABASE_URL, JWT_SECRET, NVIDIA_API_KEY, GITHUB_TOKEN
npm run dev
# → http://localhost:5000
```

### 3. Frontend

```bash
cd client
npm install
npm run dev
# → http://localhost:5173/portfolio
```

---

## � Environment Variables

**server/.env**
```
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/aifuture
JWT_SECRET=your_32_char_secret
NVIDIA_API_KEY=nvapi-...
GITHUB_TOKEN=ghp_...
NODE_ENV=development
```

**client/.env**
```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🤖 AI Model

- **Model**: `nvidia/nvidia-nemotron-nano-9b-v2`
- **Provider**: Nvidia NIM API (`https://integrate.api.nvidia.com/v1`)
- **SDK**: OpenAI-compatible (`openai` npm package)
- **Thinking tokens**: `min_thinking_tokens: 512, max_thinking_tokens: 1024`
- **Retry**: automatic JSON parse retry on first failure

---

## � API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/portfolio/verify` | ✅ JWT | Verify + AI-analyse a GitHub repo |
| GET | `/api/portfolio/:userId` | ✅ JWT | Get all portfolio items |
| DELETE | `/api/portfolio/:id` | ✅ JWT | Remove a portfolio item |
| GET | `/api/health` | — | Health check |

---

## 🏆 Vision

> "This is not a course platform. This is proof of value in an AI world."

AI Future Passport empowers individuals to work alongside AI, adapt to future
industry demands, and build meaningful careers.

---

*Hackathon: CodeZap by Descience*
