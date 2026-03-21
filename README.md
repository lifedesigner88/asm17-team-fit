# PersonaMirror

`A resume shows what you've done. PersonaMirror shows who you are.`

## What This Repository Is
PersonaMirror is a monorepo that builds a **Progressive Persona Dashboard** — a service that extracts a user's values, speaking patterns, and archetypes from text (and later voice/image) inputs, generating a richer persona as more answers are accumulated.

This repository has two goals:
- Build a real service structure step by step, targeting a public MVP by March 25, 2026.
- Document both the code and the reasoning behind architectural decisions.

## Product Concept: Progressive Persona Dashboard

The dashboard grows richer as the user provides more input:

| Level | Input | Output |
|-------|-------|--------|
| Level 1 | 5 AI interview questions | Archetype · Top 3 values · One-line summary |
| Level 2 | 10–15 questions | + Language patterns · Decision-making tendencies · Career direction |
| Level N | Hupository-scale | + Life timeline · Goal hierarchy tree · Value evolution · SDG alignment |

Park Sejong's own Hupository data serves as the **"final vision" demo** — what PersonaMirror looks like when fed years of accumulated data. Visit `/persona/demo` to see it.

## Current Status

### Already Working
- Email signup with OTP verification (via Resend) and 4-digit PIN login
- Reset PIN flow via email OTP
- Session authentication based on `httpOnly` cookies
- Admin account seed and admin-only user list view
- AI chat interview: Claude asks 5 adaptive questions one at a time
- Capture job create / read / delete API
- **ai-worker LangGraph pipeline**: polls pending jobs → calls Claude → writes persona result to DB
- **Level 1 Persona Card**: appears on capture submission detail page when job completes (polls every 2s)
- **Public persona page** (`/persona/:id`): hero card, MBTI bars, drive vector radar, SDG alignment, identity timeline, strengths
- **Demo persona** at `/persona/demo`: fully rendered with Hupository data — no backend required
- Capture routes require login (nav hidden + route redirect for unauthenticated users)
- `pnpm dev` starts all 3 services: frontend, backend, ai-worker

### Not Yet Done
- `GET /persona/:id` real backend endpoint (demo page only for now)
- `POST /persona/:id/ask` — Q&A panel AI answer endpoint
- Voice and image capture (marked "coming soon" in UI)
- DB volume reset required on next deploy (new columns: `result`, `persona_id`)

## Tech Stack
- Monorepo: Nx
- Frontend: React Router v6, TypeScript, Tailwind CSS, shadcn/ui
- Backend: FastAPI, SQLAlchemy, PostgreSQL
- Worker: Python, uv, **LangGraph**, **Claude API** (`claude-sonnet-4-6`)
- Package manager: pnpm (Node), uv (Python)
- Infra / local runtime: Docker Compose, Terraform

## AI Architecture (ai-worker)

```
User answers 5 AI interview questions
    ↓
POST /capture/interview/chat  (Claude — stateless chat)
    ↓
Capture job created (status=pending)
    ↓
ai-worker polling loop (every 5s)
    ├── [Node] extract_persona  (Claude)  ← MVP (active)
    │       reads interview messages → { archetype, top3_values, one_liner }
    ├── [Node] extract_speaking  (Claude)  ← Phase 2
    └── [Node] generate_card    (Claude)  ← Phase 2
    ↓
result written to capture_jobs.result (JSON)
status = done → frontend PersonaCard renders
```

Why LangGraph:
- Each node has an independent role — easy to extend or swap
- Pluggable LLM backends (Claude, GPT, Gemini)
- Conditional routing based on answer depth

## Parallel Worktree Setup

Three git worktrees run in parallel for the MVP:

| Workspace | Path | Branch | Frontend | Backend | Scope |
|-----------|------|--------|----------|---------|-------|
| main | `/home/sejong/260309_persona-mirror` | `main` | 3000 | 8000 | merge only |
| work1 | `/home/sejong/persona-mirror-work1` | `feat/email-signup` | 3001 | 8001 | Backend features |
| work2 | `/home/sejong/persona-mirror-work2` | `feat/frontend-mvp` | 3002 | 8002 | Frontend features |

### Port Policy
Each workspace uses dedicated ports to avoid conflicts when running simultaneously.

| Workspace | `VITE_API_BASE_URL` | `BACKEND_CORS_ORIGINS` |
|-----------|---------------------|------------------------|
| main | `http://localhost:8000` | `http://localhost:3000` |
| work1 | `http://localhost:8001` | `http://localhost:3001` |
| work2 | `http://localhost:8002` | `http://localhost:3002` |

Open each path as a separate VS Code window to work in parallel.

## Runtime Policy
For reproducibility, local and Docker runtime versions are pinned to the patch level:
- Node: `24.11.0`
- Python: `3.11.15`
- Postgres: `16.13-alpine`
- Redis: `7.4.7-alpine`

Related files:
- [.nvmrc](.nvmrc)
- [.python-version](.python-version)
- [apps/frontend/Dockerfile](apps/frontend/Dockerfile)
- [apps/backend/Dockerfile](apps/backend/Dockerfile)
- [docker-compose.yml](docker-compose.yml)

## Quick Start
Prerequisites: `nvm`, `corepack`, `uv`, `docker`, `docker compose`

Initial setup:
```bash
nvm install 24.11.0
nvm use 24.11.0
corepack enable
uv python install 3.11.15
pnpm setup
```

`pnpm setup` auto-generates `.env` files from `.env.example`, installs Node dependencies, and syncs Python environments.

## Run Modes
### 1. Local Development
```bash
pnpm dev
```
Starts db + redis via Docker Compose, then backend, frontend, and ai-worker via Nx. Frontend waits for backend port before starting.

```bash
pnpm infra:down   # stop db and redis
```

### 2. Dockerfile Test
```bash
pnpm docker        # build and run frontend/backend as Docker containers
pnpm docker:logs   # stream logs
pnpm docker:down
```

### 3. Docker Compose Demo
```bash
docker compose up
docker compose down
```

## Environment Variables

### Required Keys
| App | Key | Notes |
|-----|-----|-------|
| Frontend | `VITE_API_BASE_URL` | Backend origin |
| Backend | `DATABASE_URL` | Postgres connection string |
| Backend | `JWT_SECRET_KEY` | Cookie signing |
| Backend | `BACKEND_CORS_ORIGINS` | Frontend origin |
| Backend | `RESEND_API_KEY` | Email OTP delivery |
| Backend | `ANTHROPIC_API_KEY` | Claude API (interview + ai-worker) |
| ai-worker | `ANTHROPIC_API_KEY` | LangGraph persona extraction |

### Files
- Frontend: [apps/frontend/.env.example](apps/frontend/.env.example)
- Backend: [apps/backend/.env.example](apps/backend/.env.example)
- Compose demo: [compose.env](compose.env)

## API Overview

### Auth
- `POST /auth/signup` — email + 4-digit PIN; sends OTP verification email
- `POST /auth/verify` — confirm OTP to activate account
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `POST /auth/reset-pin/request` — send OTP to email
- `POST /auth/reset-pin/confirm` — set new PIN

### Admin
- `GET /admin/users` — admin session required

### Capture
- `POST /capture/interview/chat` — stateless AI chat; returns `{ message, is_complete }`
- `POST /capture/jobs`
- `GET /capture/jobs`
- `GET /capture/jobs/{job_id}` — includes `result` field when done
- `DELETE /capture/jobs/{job_id}`

### Persona
- `GET /persona/{id}` — public, no auth required (real endpoint pending; demo at `/persona/demo`)

### Health
- `GET /health`

API docs when running: `http://localhost:8000/docs`

## Monorepo Structure
```text
/persona-mirror
├── apps/
│   ├── frontend/
│   ├── backend/
│   │   └── docs/api/
│   └── ai-worker/
├── infrastructure/
│   └── terraform/
├── docs/
│   └── changelog/
├── scripts/
├── docker-compose.yml
└── nx.json
```

### Frontend Domains
- `auth` — signup, login, OTP verification, reset PIN
- `admin` — user list (admin only)
- `capture` — AI chat interview, draft management, job submission, submission detail with persona card
- `persona` — public persona page, demo page

### Backend Domains
- `auth` — session, OTP, reset PIN
- `admin` — user list
- `capture` — job CRUD, AI chat interview endpoint
- `persona` — public persona read

## Roadmap
### Phase 0 — Foundation (Done)
- [x] Nx workspace, lint, format, pre-commit
- [x] Local / docker / compose execution paths
- [x] Frontend / backend base structure

### Phase 1 — March 25 MVP (Active)
- [x] Email signup with OTP verification
- [x] 4-digit PIN login + reset PIN via email
- [x] Admin user list
- [x] AI chat interview (5 questions, Claude)
- [x] Capture job API
- [x] LangGraph single-node: interview messages → Claude → Persona JSON
- [x] Level 1 persona card (archetype · values · one-liner)
- [x] Public shareable URL — `/persona/:id` (demo)
- [x] Hupository demo account (Park Sejong's preset data)
- [ ] `GET /persona/:id` real backend endpoint
- [ ] `POST /persona/:id/ask` Q&A panel

### Phase 2 — Enriched Analysis (Planned)
- [ ] Whisper voice analysis node
- [ ] Image analysis node
- [ ] Multi-LLM backend support (GPT, Gemini)
- [ ] Level 2+ persona depth

### Phase 3 — Operations (Planned)
- [ ] Infrastructure automation
- [ ] Logging and monitoring

## Next Recommended Work
1. `GET /persona/:id` — real backend endpoint so `/persona/demo` can be replaced with real user profiles
2. `POST /persona/:id/ask` — Q&A panel AI answer

## Quality Commands
```bash
pnpm test:backend
pnpm lint
pnpm format
uvx pre-commit run --all-files
```

## Changelog
- Index: [docs/changelog/README.md](docs/changelog/README.md)
- Daily records: `docs/changelog/YYYY-MM-DD.md`

## Git Workflow
Branch strategy:
- `main`: stable — PR merge only, never push directly
- `feat/*`: feature branches
- `study/*`: experimental branches

PR principles:
- Merge the previous PR before starting the next branch whenever possible
- One PR = one branch; do not reuse a merged PR branch
- Clean up local and remote branches after merge

## Hupository ↔ PersonaMirror Connection

| Layer | Role |
|-------|------|
| Hupository | Data accumulation (personal YAML repository) |
| PersonaMirror | Service layer — a product anyone can use |
| `/persona/demo` | Park Sejong's Hupository data = final vision of Level N |

## Why This Repo Is Useful For Learners
- Feature-based folder structure (auth / admin / capture / persona)
- Separation of local / docker / compose execution paths
- Real auth flow: httpOnly cookies, OTP email verification, PIN reset
- LangGraph + Claude API integration pattern
- React Router v6 data APIs (loader / action)
- Nx monorepo with parallel dev targets
