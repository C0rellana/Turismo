#!/usr/bin/env bash
# deploy.sh — deploy a Vercel prod.
# Usage: ./scripts/deploy.sh [--preview]

set -e

cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  echo "❌ Falta .env"
  exit 1
fi

set -a
# shellcheck disable=SC1091
source .env
set +a

if [ -z "$VERCEL_TOKEN" ] || [[ "$VERCEL_TOKEN" == *"xxxxxxxx"* ]]; then
  echo "❌ VERCEL_TOKEN no seteado. vercel.com/account/tokens"
  exit 1
fi

NODE_VERSION=$(node -v | cut -dv -f2 | cut -d. -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo "❌ Node $NODE_VERSION detectado. Requiere 20+. Usar 'nvm use 22'"
  exit 1
fi

MODE="--prod"
for arg in "$@"; do
  [ "$arg" = "--preview" ] && MODE=""
done

echo "→ Typecheck..."
npx tsc --noEmit

echo "→ Lint..."
npx expo lint || true

echo "→ Build web..."
npx expo export --platform web

echo "→ Deploy Vercel ($MODE)..."
npx --yes vercel@latest $MODE --yes --token="$VERCEL_TOKEN"

echo ""
echo "✓ Deploy completo."
