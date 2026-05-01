#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

echo "== ExpenseTracker deploy script for VPS / WSL =="

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: Docker is not installed. Install Docker Engine and Docker Compose first." >&2
  exit 1
fi

if [ ! -f .env ]; then
  echo "Creating .env from .env.example"
  cp .env.example .env
  echo "Please review .env and update values if needed before continuing."
fi

echo "Building and starting production containers..."
docker compose -f docker-compose.prod.yml up -d --build

echo "Waiting for containers to become healthy..."
sleep 5

echo "Current service status:"
docker compose -f docker-compose.prod.yml ps

echo ""
echo "Frontend should be available at http://localhost or http://<server-ip>"
echo "Backend health endpoint: http://localhost:4000/api/health"
echo "To follow logs, run:
  docker compose -f docker-compose.prod.yml logs -f backend
  docker compose -f docker-compose.prod.yml logs -f frontend
  docker compose -f docker-compose.prod.yml logs -f db"
