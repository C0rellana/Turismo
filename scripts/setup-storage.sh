#!/usr/bin/env bash
# setup-storage.sh — crea bucket Storage Supabase via Management API.
# Requiere SUPABASE_PROJECT_REF + SUPABASE_SERVICE_ROLE_KEY en .env
# Usage: ./scripts/setup-storage.sh

set -e

if [ ! -f .env ]; then
  echo "❌ Falta .env"
  exit 1
fi

set -a
# shellcheck disable=SC1091
source .env
set +a

if [ -z "$SUPABASE_PROJECT_REF" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "❌ SUPABASE_PROJECT_REF + SUPABASE_SERVICE_ROLE_KEY requeridos en .env"
  exit 1
fi

URL="https://${SUPABASE_PROJECT_REF}.supabase.co/storage/v1/bucket"
BUCKET="panoramas-imagenes"

echo "→ Verificando bucket $BUCKET..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  "$URL/$BUCKET")

if [ "$STATUS" = "200" ]; then
  echo "✓ Bucket $BUCKET ya existe."
  exit 0
fi

echo "→ Creando bucket $BUCKET público..."
curl -s -X POST "$URL" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$BUCKET\",
    \"public\": true,
    \"allowed_mime_types\": [\"image/jpeg\",\"image/png\",\"image/webp\",\"video/mp4\",\"video/webm\",\"video/quicktime\"],
    \"file_size_limit\": 52428800
  }"
echo ""
echo "✓ Bucket creado. Fija policies en Dashboard si no están."
