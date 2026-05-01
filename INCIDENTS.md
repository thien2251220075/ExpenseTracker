# Incident Report

This project includes a basic incident analysis for QA/SRE.

## Incident 1: Backend container fails to start due missing healthcheck

- **Hiện tượng**: `docker compose up -d` shows backend container as failed because the service dependency did not become healthy.
- **Layer lỗi**: Infrastructure / backend container orchestration
- **Nguyên nhân**: `docker-compose.prod.yml` did not define a healthcheck for the backend service, so dependent frontend startup logic could fail.
- **Cách fix**: Add a backend healthcheck that verifies `/api/health` before considering the service healthy.
- **Cách phòng tránh**: Always define service healthchecks in production compose files and test container startup order.

## Incident 2: Frontend API URL hardcoded or incorrect in production

- **Hiện tượng**: Frontend requests fail when the app is served from production because the backend URL is not resolved correctly.
- **Layer lỗi**: Frontend / config
- **Nguyên nhân**: The frontend initially used a hardcoded backend URL instead of environment variables or relative API paths.
- **Cách fix**: Use `import.meta.env.VITE_API_URL || '/api'` in `frontend/src/api.js` and configure `frontend/.env.production` with `VITE_API_URL=/api`.
- **Cách phòng tránh**: Use environment variables for all runtime endpoints, and avoid hardcoded absolute URLs in frontend code.

## Incident 3: Environment variable mismatch between local and production

- **Hiện tượng**: The app works in local dev but fails under production compose because `VITE_API_URL` or database variables are wrong.
- **Layer lỗi**: Configuration / environment
- **Nguyên nhân**: `.env.example` and `.env.production` were not aligned with production runtime requirements, or `.env` values were incorrectly committed.
- **Cách fix**: Keep `.env.example` committed with safe defaults, add `.env` to `.gitignore`, and use production-specific `.env.production` for frontend.
- **Cách phòng tránh**: Never commit secret or environment-specific values; document expected variables and test both dev and production configurations.
