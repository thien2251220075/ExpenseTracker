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
