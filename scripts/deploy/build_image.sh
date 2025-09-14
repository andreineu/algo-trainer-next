#!/usr/bin/env bash
set -euo pipefail

# Short git SHA for tagging
SHORT_SHA="$(git rev-parse --short HEAD 2>/dev/null || echo 'local')"

docker build -t algotrainer:latest -t "algotrainer:${SHORT_SHA}" .
