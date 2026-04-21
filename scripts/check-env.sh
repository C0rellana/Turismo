#!/usr/bin/env bash
# check-env.sh — valida que todas las env vars necesarias estén seteadas.
# Usage: ./scripts/check-env.sh

set -e

if [ ! -f .env ]; then
  echo "❌ Falta archivo .env (copiar desde .env.example)"
  exit 1
fi

# Carga .env
set -a
# shellcheck disable=SC1091
source .env
set +a

missing=0

check() {
  local name="$1"
  local required="$2"
  local val
  val="$(eval echo "\$$name")"
  if [ -z "$val" ] || [[ "$val" == *"xxxxxxxx"* ]] || [[ "$val" == *"<password>"* ]]; then
    if [ "$required" = "required" ]; then
      echo "❌ $name (REQUIRED)"
      missing=$((missing + 1))
    else
      echo "⚠️  $name (opcional)"
    fi
  else
    echo "✓  $name"
  fi
}

echo "=== Vars cliente (build) ==="
check EXPO_PUBLIC_SUPABASE_URL required
check EXPO_PUBLIC_SUPABASE_ANON_KEY required

echo ""
echo "=== Vars admin (migrations + storage) ==="
check SUPABASE_DB_URL required
check SUPABASE_SERVICE_ROLE_KEY opcional
check SUPABASE_PROJECT_REF required

echo ""
echo "=== Vars deploy ==="
check VERCEL_TOKEN required

echo ""
echo "=== OAuth externo ==="
check GOOGLE_OAUTH_CLIENT_ID opcional
check GOOGLE_OAUTH_CLIENT_SECRET opcional

if [ "$missing" -gt 0 ]; then
  echo ""
  echo "❌ Faltan $missing vars requeridas. Completar .env."
  exit 1
fi

echo ""
echo "✓ Todas las vars requeridas están seteadas."
