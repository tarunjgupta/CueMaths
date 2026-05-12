# AI Learning Companion

A full-stack production-ready application to help students solve complex math and logic problems using GenAI step-by-step guidance, mistake analysis, and follow-up generation.

## Folder Structure

- `server/` - Express backend providing JWT Auth and DB connectivity.
- `ai-service/` - FastAPI Python backend orchestrating LLM execution and formatting.
- `client/` - React frontend powered by Vite and styled with Tailwind.
- `stitch_screens/` - Raw HTML UI templates directly extracted from the original design.

## Features

- **JWT Authentication** and secure password hashing.
- **Problem Solving:** Uses GenAI to break down a math problem step-by-step.
- **Adaptive Follow Ups:** Dynamically suggests related problems of adjusted difficulty.
- **Mistake Analysis:** Validates student answers for follow up problems and identifies conceptual gaps.
- **Dashboard Tracking:** Saves progress to PostgreSQL and gives statistical insights.

## Prerequisites

1. Node.js v18+
2. Python 3.10+
3. PostgreSQL Database (Neon DB or local)

## Setup Instructions

### 1. Database & Express Server
```bash
cd server
cp .env.example .env
# Edit .env with your Neon Database URL and JWT Secret
npm install
npm run dev
```

### 2. FastAPI AI Service
```bash
cd ai-service
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
# source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Add your Gemini Pro key in .env (if absent, it defaults to a built-in Mock engine)
uvicorn main:app --reload --port 8000
```

### 3. React Frontend
```bash
cd client
cp .env.example .env
npm install
npm run dev
```

## Deployment Guide

### Database (Neon.tech)
- Create a PostgreSQL database on Neon.
- Get the Connection String.
- Run the SQL script located in `server/src/db/init.sql` using Neon's active SQL editor.

### API & Server (Render or Railway)
- Deploy `server/` as a Node.js Web Service. Set environment variables `NEON_DATABASE_URL`, `JWT_SECRET`, and `AI_SERVICE_URL`.
- Deploy `ai-service/` as a Python Web Service. Set environment variable `GEMINI_API_KEY`.

### Frontend (Vercel)
- Import the repo into Vercel, set Root Directory to `client/`.
- Vercel automatically detects Vite.
- Add `VITE_API_URL` pointing to your Express Server URL.
