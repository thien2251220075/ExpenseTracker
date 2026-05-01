# Expense Tracker

A fullstack expense tracking app with React frontend, Express backend, PostgreSQL database, and Docker compose.

## Architecture
- Frontend: React + Vite
- Backend: Node.js + Express + PostgreSQL
- Database: PostgreSQL in Docker
- Docker compose: frontend, backend, database services
- CI: GitHub Actions for lint, test, and build

## Run locally with Docker
1. Copy `.env.example` to `.env` and update values if needed.
2. Run `docker compose up --build -d`
3. Frontend: http://localhost:3000
4. Backend API: http://localhost:4000/api

## Production deployment with Docker
1. Copy `.env.example` to `.env` and verify production values.
2. Run `docker compose -f docker-compose.prod.yml up --build -d`
3. Frontend: http://localhost
4. Backend API: http://localhost:4000/api

## GitHub Actions production build
- `./github/workflows/production-build.yml` builds the production container images.
- The workflow also starts the production stack and runs a smoke test against `/api/health`.

## Endpoints
- `GET /api/health`
- `GET /api/transactions`
- `GET /api/summary`
- `POST /api/transactions`
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`

## Notes
- Frontend uses `VITE_API_URL` to call backend without hardcoded URLs.
- Backend logs errors to console and returns status codes.
- Database schema is initialized automatically on startup.

## Branching and commit workflow
- `main`: production-ready release branch.
- `dev`: active integration branch for ongoing development.
- `feature/*`: dedicated branches for each individual feature or improvement.

### Best practices
- Commit often and keep each commit focused on a single change.
- Use descriptive commit messages like `feat: add transaction summary endpoint` or `fix: correct Docker healthcheck`.
- Do not combine all work into a single final commit.
- Merge `feature/*` branches into `dev`, then promote `dev` to `main` after validation.
