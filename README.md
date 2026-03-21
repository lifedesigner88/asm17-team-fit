# PersonaMirror

`A resume shows what you've done. PersonaMirror shows who you are.`

## What This Repository Is
PersonaMirror is a monorepo that builds a **Progressive Persona Dashboard** — a service that extracts a user's values, speaking patterns, and archetypes from text (and later voice/image) inputs, generating a richer persona as more answers are accumulated.

This repository has two goals:
- Build a real service structure step by step, targeting a public MVP by April 1, 2026.
- Document both the code and the reasoning behind architectural decisions.

## Product Concept: Progressive Persona Dashboard

The dashboard grows richer as the user provides more input:

| Level | Input | Output |
|-------|-------|--------|
| Level 1 | 3–5 questions | Archetype · Top 3 values · One-line summary |
| Level 2 | 10–15 questions | + Language patterns · Decision-making tendencies · Career direction |
| Level N | Hupository-scale | + Life timeline · Goal hierarchy tree · Value evolution · SDG alignment |

Park Sejong's own Hupository data serves as the **"final vision" demo** — what PersonaMirror looks like when fed years of accumulated data.

## Current Status
Features that are currently working:
- Sign up / Login / Logout
- Session authentication based on `httpOnly` cookies
- Admin account seed and admin-only user list view
- Capture UI draft for interview / voice / image input
- Capture job create / read API
- Basic backend smoke test suite
- All three execution paths verified:
  - Local dev: `pnpm dev`
  - Dockerfile test: `pnpm docker`
  - Docker Compose demo: `docker compose up`

Core features not yet implemented (April 1 MVP targets):
- LangGraph-based persona extraction via Claude API
- Progressive dashboard frontend (Level 1 card)
- Public shareable URL (`/persona/{id}`)
- Hupository demo account (Park Sejong's preset data)
- Whisper-based voice analysis (Phase 2)
- Stable Diffusion / ControlNet-based image generation (Phase 2)
- Async job processing between ai-worker and backend (Phase 2)

## Tech Stack
- Monorepo: Nx
- Frontend: React Router 7, TypeScript, Tailwind CSS, shadcn/ui
- Backend: FastAPI, SQLAlchemy, PostgreSQL
- Worker: Python, uv, **LangGraph**, Claude API
- Package manager:
  - Node: pnpm
  - Python: uv
- Infra / local runtime:
  - Docker Compose
  - Terraform

## AI Architecture (ai-worker)

```
Input (text / later: voice · image)
    ↓
LangGraph workflow
    ├── [Node 1] extract_values    (Claude)  ← MVP
    ├── [Node 2] extract_speaking  (Claude)  ← Phase 2
    ├── [Node 3] extract_archetype (Claude)  ← Phase 2
    └── [Node 4] generate_card     (Claude)  ← Phase 2
    ↓
backend (FastAPI) → Persona JSON → frontend dashboard
```

Why LangGraph:
- Each node has an independent role — easy to extend or swap
- Pluggable LLM backends (Claude, GPT, Gemini)
- Conditional routing based on answer depth

## Parallel Worktree Setup

Three git worktrees run in parallel for the March 25 MVP:

| Workspace | Path | Branch | Scope |
|-----------|------|--------|-------|
| main | `/home/sejong/260309_persona-mirror` | `main` | merge only |
| work1 | `/home/sejong/persona-mirror-work1` | `feat/email-signup` | Backend — Steps 1→2→3 |
| work2 | `/home/sejong/persona-mirror-work2` | `feat/frontend-mvp` | Frontend — Steps 4→6 |

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
Prerequisites:
- `nvm`
- `corepack`
- `uv`
- `docker`
- `docker compose`

Initial setup:
```bash
nvm install 24.11.0
nvm use 24.11.0
corepack enable
uv python install 3.11.15
pnpm setup
```

What `pnpm setup` does:
- Auto-generates `apps/frontend/.env` from `apps/frontend/.env.example`
- Auto-generates `apps/backend/.env` from `apps/backend/.env.example`
- Installs Node dependencies
- Syncs backend / ai-worker Python environments

## Run Modes
### 1. Local Development
The most commonly used execution path.

```bash
pnpm dev
```

Behavior:
- Runs `db` and `redis` via Docker Compose
- Nx runs `backend` and `frontend` as local dev servers
- Backend waits for port `5432` before starting
- Frontend waits for port `8000` before starting

Shutdown:
- Stop app processes: `Ctrl+C`
- Stop remaining `db` and `redis`:
```bash
pnpm infra:down
```

### 2. Dockerfile Test
Used to verify that the app Dockerfiles actually build and run correctly.

```bash
pnpm docker
```

Behavior:
- Runs `db` and `redis` via Docker Compose
- Nx builds frontend / backend Docker images with BuildKit
- Build logs are streamed to the Nx console
- After build, frontend / backend containers run in detached mode

View logs:
```bash
pnpm docker:logs
```

Shutdown:
```bash
pnpm docker:down
```

### 3. Docker Compose Demo
The simplest path for external users to try the demo.

```bash
docker compose up
```

Shutdown:
```bash
docker compose down
```

Note:
- `pnpm infra:down` only stops `db` and `redis`.
- `docker compose down` stops all services started by compose (frontend, backend, ai-worker, db, redis).

## Environment Variables
### Policy
- Actual local app env files are not committed to Git.
- Only example files are tracked.
- Docker Compose demo defaults are kept in the trackable [compose.env](compose.env).

### Files
- Frontend example: [apps/frontend/.env.example](apps/frontend/.env.example)
- Backend example: [apps/backend/.env.example](apps/backend/.env.example)
- Compose demo env: [compose.env](compose.env)

### Effective Use
- Local dev / local docker test:
  - `apps/frontend/.env`
  - `apps/backend/.env`
- Compose demo:
  - `compose.env`

### Important Keys
- Frontend:
  - `VITE_API_BASE_URL`
- Backend:
  - `DATABASE_URL`
  - `JWT_SECRET_KEY`
  - `BACKEND_CORS_ORIGINS`
  - `AUTH_COOKIE_*`
  - `ADMIN_SEED_*`
- Compose / db:
  - `POSTGRES_DB`
  - `POSTGRES_USER`
  - `POSTGRES_PASSWORD`

## What Is Implemented Today
### Auth
- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

### Admin
- `GET /admin/users`
- Frontend menu is only shown for admin sessions

### Capture
- `POST /capture/jobs`
- `GET /capture/jobs`
- `GET /capture/jobs/{job_id}`
- `DELETE /capture/jobs/{job_id}`
- The frontend provides a step-based capture UI; drafts are managed in browser memory and submitted to the backend job API at the review step
- After submission, the `My submissions` screen supports card-style list view, detail view, and deletion

### Health
- `GET /health`

## API Docs
- Backend test plan: [apps/backend/docs/api/testing.md](apps/backend/docs/api/testing.md)
- Backend live docs when running:
  - Swagger UI: `http://localhost:8000/docs`
  - OpenAPI JSON: `http://localhost:8000/openapi.json`
- Principles:
  - FastAPI OpenAPI is the authoritative source at runtime.
  - Manual backend API endpoint documentation is not maintained.
  - The README only keeps a scope overview and entry links.
  - Manual docs are only written for concept/strategy explanations, like test plans.

## Monorepo Structure
```text
/persona-mirror
├── apps/
│   ├── frontend/
│   ├── backend/
│   │   └── docs/api/
│   └── ai-worker/
├── libs/
│   ├── shared-interfaces/
│   ├── ai-models/
│   └── ui-components/
├── infrastructure/
│   └── terraform/
├── docs/
│   └── changelog/
├── scripts/
├── docker-compose.yml
└── nx.json
```

### Frontend Structure
Principles:
- Shared UI lives in `src/common/components`
- Feature code lives in `src/features/<domain>`
- React Router `loader` / `action` is the default pattern
- New pages are first built by composing shared UI from `src/common/components`; feature-specific components are only added when a repeating pattern is confirmed

Current main domains:
- `auth`
- `admin`
- `capture`

### Backend Structure
Principles:
- Common code lives in `app/common`
- Feature code lives in `app/features/<domain>`
- Features are split into `router.py`, `service.py`, `schemas.py`, `models.py` as needed

Current main domains:
- `auth`
- `admin`
- `capture`

## Roadmap
### Phase 0. Foundation Setup (Done)
- [x] Nx workspace initialization
- [x] Common runtime / lint / format / pre-commit setup
- [x] Local / docker / compose execution paths
- [x] Frontend / backend base structure

### Phase 1. March 25 MVP — G-PM-01 (Active)
- [x] Basic authentication
- [x] Admin user list screen
- [x] Capture UI draft
- [x] Capture job API
- [x] Capture review → backend job API connection
- [ ] LangGraph single-node: Capture text → Claude API → Persona JSON
- [ ] Progressive dashboard frontend (Level 1 card: archetype · values · one-liner)
- [ ] Public shareable URL — `/persona/{id}`
- [ ] Hupository demo account (Park Sejong's preset data → final vision)
- [ ] File upload scaffolding (voice · image prep)

### Phase 2. Enriched Analysis (Planned)
- [ ] Whisper voice analysis node
- [ ] Image analysis node
- [ ] Async job processing (ai-worker ↔ backend)
- [ ] Multi-LLM backend support (GPT, Gemini)
- [ ] Quality improvements

### Phase 3. Operations (Planned)
- [ ] Infrastructure automation
- [ ] Operational observability (logging · monitoring)

## March 25 MVP — Implementation Plan

### Step 1 — Email signup (backend + frontend) `~1h`
- Add `email` field to `User` model and `SignupRequest` schema
- No email verification for MVP — just store it
- Files: `apps/backend/app/features/auth/models.py`, `schemas.py`, `apps/frontend/src/features/auth/pages/signup-page.tsx`

### Step 2 — LangGraph single node: text → Persona JSON (ai-worker) `~3h`
- Input: `selfSummary`, `coreValues`, `speakingStyle`, `keywords` from Capture job
- Node: `extract_values` → Claude API → `{ archetype, top3_values, one_liner }`
- Output: written back to `capture_jobs.result` as JSON
- Files: `apps/ai-worker/` (new LangGraph workflow)

### Step 3 — Job result → Persona JSON (backend) `~1h`
- Add `result` field to `CaptureJob` model
- Add `GET /capture/jobs/{job_id}/result` or include result in existing job response
- Files: `apps/backend/app/features/capture/models.py`, `schemas.py`, `router.py`

### Step 4 — Level 1 persona card (frontend) `~2h`
- After job submit → poll job status → display card when `status = done`
- Card shows: archetype · top 3 values · one-liner
- Files: `apps/frontend/src/features/capture/` (new result page or component)

### Step 5 — Hupository demo account `~1h`
- Seed script reads `hupository/` YAML → inserts as preset persona for `parksejong` user
- Demonstrates Level N final vision on the dashboard
- Files: `apps/backend/app/common/seed.py` or `apps/ai-worker/seed/`

### Step 6 — Public shareable URL `~1h`
- Read-only page at `/persona/{id}` — no auth required
- Files: `apps/frontend/src/features/persona/` (new feature), backend `GET /persona/{id}`

## Next Recommended Work (toward March 25 MVP)
Start with **Step 1** (email signup) then **Step 2** (LangGraph node) — these are the critical path.

## Quality Commands
```bash
pnpm test:backend
pnpm lint
pnpm format
uvx pre-commit install
uvx pre-commit run --all-files
```

## Changelog
- Index: [docs/changelog/README.md](docs/changelog/README.md)
- Daily records: `docs/changelog/YYYY-MM-DD.md`

Recording style:
- While working: accumulate one-line notes
- Before committing: summarize based on the commit scope

## Git Workflow
> **`main` is protected — updated only via PR. Never push directly to `main`.**

Branch strategy:
- `main`: stable branch — PR merge only
- `feat/*`: feature branches
- `study/*`: experimental branches

Branch examples:
- `feat/ai`
- `feat/auth`
- `feat/capture`
- `study/prompt-exp`

Commit principles:
- Keep commits small
- Review change summary before the final commit
- Push the current branch to remote after approval

Branch start principles:
- Independent work starts a new branch from the latest `origin/main`.
- Dependent work that continues from a not-yet-merged branch starts from that branch.
- One PR = one branch is maintained, but the base is not always fixed to `main`.
- Do not reuse a branch that already has an open PR; create a new child branch from it if needed.

PR operation principles:
- Merge the previous PR before starting the next branch whenever possible.
- If the next task can't wait, use a stacked branch approach.
- A stacked branch PR may target the parent branch, then be rebased to `main` after the parent merges.
- Before pushing a new PR or additional commits, verify the current branch is not already a merged PR branch.
- Do not push new commits to a merged PR branch. Instead, create a new branch from the correct base and cherry-pick only the needed commits.
- Clean up merged branches before opening a new PR.
- Clean up both local and remote branches; delay only when a stacked child still depends on the parent branch.

## Hupository ↔ PersonaMirror Connection

| Layer | Role |
|-------|------|
| Hupository | Data accumulation (personal YAML repository) |
| PersonaMirror | Service layer — a product anyone can use |
| PersonaMirror Demo | Park Sejong's Hupository = final vision of what Level N looks like |

## Why This Repo Is Useful For Learners
This repository is not just a tutorial — it also demonstrates:
- Feature-based folder structure design
- Separation of local / docker / compose execution paths
- Environment variable policy
- Real implementations of auth, admin, and capture flows
- LangGraph + Claude API integration pattern
- A structure that can be extended to ai-worker and model pipelines
