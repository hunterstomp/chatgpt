#!/usr/bin/env bash
set -euo pipefail
MSG=${1:-"checkpoint"}
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")

# Stage everything and commit if there are changes
if ! git diff --quiet || ! git diff --cached --quiet; then
  git add -A
  git commit -m "🧭 ${MSG}"
  DID_COMMIT=1
else
  echo "ℹ️  No changes to commit."
  DID_COMMIT=0
fi

# Tag the current HEAD (whether new commit or not)
TAG="phase-$(date +%Y%m%d-%H%M%S)"
git tag -a "$TAG" -m "${MSG} on ${BRANCH}" || {
  echo "⚠️  Tag '${TAG}' already exists, generating another."
  TAG="phase-$(date +%Y%m%d-%H%M%S)-$(uuidgen | tr 'A-Z' 'a-z' | cut -c1-8)"
  git tag -a "$TAG" -m "${MSG} on ${BRANCH}"
}

echo "✅ ${DID_COMMIT==1 && "Committed and" || "Tagged"} ${TAG} (${MSG}) on ${BRANCH}"
