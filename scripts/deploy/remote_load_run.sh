#!/usr/bin/env bash
set -euo pipefail

IMAGE_TAR="${1:?image tar path required}"
COMPOSE_DIR="${2:?compose dir required}"

echo "[remote] Loading image from ${IMAGE_TAR}"
docker load -i "${IMAGE_TAR}"

echo "[remote] Starting with docker compose"
cd "${COMPOSE_DIR}"
# Force recreate to ensure new image is used (even with 'latest')
docker compose up -d --force-recreate

echo "[remote] Pruning dangling images (safe cleanup)"
docker image prune -f || true

echo "[remote] Done."
