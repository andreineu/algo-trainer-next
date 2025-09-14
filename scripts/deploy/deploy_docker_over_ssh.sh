#!/usr/bin/env bash
set -euo pipefail

# Inputs (env vars). Provide via GitHub Secrets → exported to env.
: "${SSH_HOST:?Missing SSH_HOST}"
: "${SSH_USER:?Missing SSH_USER}"
: "${SSH_KEY:?Missing SSH_KEY (private key PEM)}"
: "${REMOTE_DIR:?Missing REMOTE_DIR}"          # e.g. /opt/algotrainer
CONTAINER_NAME="${CONTAINER_NAME:-algotrainer}"
LOCAL_PORT="${LOCAL_PORT:-3000}"               # Next.js server port
REMOTE_TGZ="algotrainer-image.tar.gz"

echo "==> Writing SSH key"
KEY_FILE="$(mktemp)"
printf '%s\n' "$SSH_KEY" > "$KEY_FILE"
chmod 600 "$KEY_FILE"

echo "==> Docker build"
docker build -t "${CONTAINER_NAME}:latest" .

echo "==> Save image to tar.gz"
mkdir -p artifact
docker save "${CONTAINER_NAME}:latest" | gzip > "artifact/${REMOTE_TGZ}"

echo "==> Ensure remote dir exists"
ssh -i "$KEY_FILE" -o StrictHostKeyChecking=no "${SSH_USER}@${SSH_HOST}" "mkdir -p '${REMOTE_DIR}'"

echo "==> Upload image"
scp -i "$KEY_FILE" -o StrictHostKeyChecking=no "artifact/${REMOTE_TGZ}" "${SSH_USER}@${SSH_HOST}:${REMOTE_DIR}/${REMOTE_TGZ}"

echo "==> Load image and restart container on remote"
ssh -i "$KEY_FILE" -o StrictHostKeyChecking=no "${SSH_USER}@${SSH_HOST}" bash -s <<EOF
  set -euo pipefail
  cd "${REMOTE_DIR}"
  echo "[remote] Loading image…"
  docker load -i "${REMOTE_TGZ}"

  echo "[remote] Restarting container ${CONTAINER_NAME}…"
  docker rm -f "${CONTAINER_NAME}" 2>/dev/null || true
  docker run -d --name "${CONTAINER_NAME}" \
    --restart always \
    -e NODE_ENV=production \
    -e PORT=${LOCAL_PORT} \
    -p 127.0.0.1:${LOCAL_PORT}:${LOCAL_PORT} \
    ${CONTAINER_NAME}:latest

  echo "[remote] Cleaning up tarball"
  rm -f "${REMOTE_TGZ}"

  echo "[remote] Pruning dangling images"
  docker image prune -f || true
EOF

echo "==> Done"
