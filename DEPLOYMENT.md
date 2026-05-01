# Deployment Documentation

## Current production deployment setup

This project is containerized and can be deployed using Docker Compose.

- `docker-compose.yml` for local development compose
- `docker-compose.prod.yml` for production-style compose
- `frontend/Dockerfile` uses a multi-stage build for smaller image size
- `backend/Dockerfile` uses `NODE_ENV=production`
- `frontend/.env.production` configures the frontend production API URL to `/api`

## Deploy options

This repo supports deployment to:
- VPS / WSL Ubuntu with Docker
- Docker VPS
- Cloud platform such as Render

### 1. Deploy on VPS / WSL (recommended)

This is the simplest real deployment because it uses Docker on a real host.

1. Install Docker and Docker Compose on the target machine.
2. Clone the repository on the target machine.
3. Copy `.env.example` to `.env` and update values if needed.
4. On the target machine, run:

```bash
bash deploy-vps.sh
```

5. Verify services:

```bash
docker compose -f docker-compose.prod.yml ps
```

6. View logs if needed:

```bash
docker compose -f docker-compose.prod.yml logs backend
docker compose -f docker-compose.prod.yml logs frontend
docker compose -f docker-compose.prod.yml logs db
```

### Access
- Frontend: `http://<server-ip>`
- Backend health: `http://<server-ip>:4000/api/health`

### 2. Deploy on Cloud using Render

Render can run backend and frontend as separate web services.

#### Frontend
- Deploy `frontend` as a static site or Docker service.
- Set `build command` to `npm install && npm run build`.
- Set `publish directory` to `dist`.
- Add environment variable: `VITE_API_URL=/api` if frontend is served behind a proxy.

#### Backend
- Deploy `backend` as a web service or Docker service.
- Set env vars:
  - `DATABASE_URL`
  - `PORT=4000`
  - `NODE_ENV=production`

#### Database
- Use either:
  - a managed Postgres service on Render, or
  - a separate Postgres server/container

#### Notes
- Render does not directly support multi-service app in one click, so deploy backend and frontend separately or use a render.yaml manifest.
- Ensure backend CORS is configured if frontend and backend are on different domains.

### 3. Deploy with Vercel

Vercel is best for frontend only.
- Deploy `frontend` as a Vite app.
- Set `Build Command` to `npm run build`.
- Set `Output Directory` to `dist`.
- Set `Environment Variable` `VITE_API_URL` to your backend URL.

For a full system, backend must run elsewhere (Render, VPS, etc.).

## Production run commands

```bash
cp .env.example .env
docker compose -f docker-compose.prod.yml up --build -d
```

## Deployment checks

- Ensure `frontend/.env.production` exists with:
  - `VITE_API_URL=/api`
- Ensure `.env.example` is committed, `.env` is ignored.
- Ensure `docker-compose.prod.yml` is used for production startup.

## What is “real deployment” here?

Real deployment means the app runs on a remote or server environment, not only on your dev PC, such as:
- VPS / WSL Ubuntu server
- Docker host in the cloud
- Render / Vercel / similar service

## Notes

- Docker Desktop is not required for real deployment.
- The backend and database must run in production containers.
- The frontend should use env vars and relative API paths, not hardcoded local URLs.
