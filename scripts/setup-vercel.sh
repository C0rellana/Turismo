#!/usr/bin/env bash
# setup-vercel.sh — link proyecto + sync env vars a Vercel.
# Requiere VERCEL_TOKEN + .env con EXPO_PUBLIC_* completos.
# Usage: ./scripts/setup-vercel.sh

set -e

if [ ! -f .env ]; then
  echo "❌ Falta .env"
  exit 1
fi

set -a
# shellcheck disable=SC1091
source .env
set +a

if [ -z "$VERCEL_TOKEN" ]; then
  echo "❌ VERCEL_TOKEN no seteado."
  exit 1
fi

# Link si no está
if [ ! -f .vercel/project.json ]; then
  echo "→ Link Vercel project..."
  npx --yes vercel@latest link --yes --token="$VERCEL_TOKEN"
fi

# Sync env vars a producción + preview + development
echo "→ Sync env vars..."
for env in production preview development; do
  echo "   ↪ $env"
  printf "%s\n" "$EXPO_PUBLIC_SUPABASE_URL" | \
    npx --yes vercel@latest env add EXPO_PUBLIC_SUPABASE_URL "$env" --token="$VERCEL_TOKEN" 2>&1 | tail -1 || true
  printf "%s\n" "$EXPO_PUBLIC_SUPABASE_ANON_KEY" | \
    npx --yes vercel@latest env add EXPO_PUBLIC_SUPABASE_ANON_KEY "$env" --token="$VERCEL_TOKEN" 2>&1 | tail -1 || true
done

echo ""
echo "✓ Vercel configurado. Listo para ./scripts/deploy.sh"
