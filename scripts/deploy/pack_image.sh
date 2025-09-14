#!/usr/bin/env bash
set -euo pipefail
mkdir -p artifact

# Save both tags so either can be used
docker save algotrainer:latest "algotrainer:${GITHUB_SHA:-local}" | gzip > artifact/algotrainer-image.tar.gz
echo "artifact/algotrainer-image.tar.gz"
