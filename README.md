<<<<<<< HEAD
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
=======
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
>>>>>>> e3bcfff1614c717cb4256ee5211ed67904567eda
