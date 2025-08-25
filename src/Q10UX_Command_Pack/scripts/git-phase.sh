#!/usr/bin/env bash
set -euo pipefail
MSG=${1:-"checkpoint"}
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
git add -A
git commit -m "🧭 ${MSG}"
TAG="phase-$(date +%Y%m%d-%H%M%S)"
git tag -a "$TAG" -m "${MSG} on ${BRANCH}"
echo "✅ Committed and tagged $TAG ($MSG) on $BRANCH"