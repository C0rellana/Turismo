#!/usr/bin/env bash
# migrate.sh — ejecuta todas las migrations Supabase en orden.
# Requiere: psql instalado + SUPABASE_DB_URL en .env
# Usage: ./scripts/migrate.sh [--reset] [--seed]
#   --reset : DROP todo y re-ejecuta schema desde cero (destructivo)
#   --seed  : ejecuta seeds (seed.sql + seed_maule.sql + seed_todas_regiones.sql)

set -e

if [ ! -f .env ]; then
  echo "❌ Falta .env"
  exit 1
fi

set -a
# shellcheck disable=SC1091
source .env
set +a

if [ -z "$SUPABASE_DB_URL" ] || [[ "$SUPABASE_DB_URL" == *"<password>"* ]]; then
  echo "❌ SUPABASE_DB_URL no seteada en .env"
  echo "   Ir a Supabase Dashboard → Settings → Database → Connection string"
  exit 1
fi

if ! command -v psql &>/dev/null; then
  echo "❌ psql no instalado. sudo apt install postgresql-client"
  exit 1
fi

RESET=false
SEED=false
for arg in "$@"; do
  case "$arg" in
    --reset) RESET=true ;;
    --seed)  SEED=true ;;
  esac
done

cd "$(dirname "$0")/.."

if [ "$RESET" = true ]; then
  echo "⚠️  RESET COMPLETO de la BD. ¿Continuar? (y/N)"
  read -r confirm
  if [ "$confirm" != "y" ]; then
    echo "Cancelado."
    exit 0
  fi
  echo "→ Borrando todas las tablas..."
  psql "$SUPABASE_DB_URL" <<EOF
drop function if exists public.lugares_cerca cascade;
drop function if exists public.lugares_top_favoritos cascade;
drop function if exists public.panoramas_proximos cascade;
drop function if exists public.touch_updated_at cascade;
drop function if exists public.handle_new_user cascade;
drop function if exists public.auto_aprobar_lugar cascade;
drop function if exists public.es_admin cascade;
drop function if exists public.es_verificado cascade;
drop function if exists public.reportes_pendientes_count cascade;
drop table if exists public.reportes cascade;
drop table if exists public.reviews cascade;
drop table if exists public.favoritos cascade;
drop table if exists public.lugar_imagenes cascade;
drop table if exists public.lugares cascade;
drop table if exists public.user_profiles cascade;
drop type if exists tipo_lugar cascade;
drop type if exists media_tipo cascade;
drop type if exists user_role cascade;
drop type if exists reporte_tipo cascade;
drop type if exists reporte_estado cascade;
drop type if exists reporte_motivo cascade;
EOF
fi

echo "→ Ejecutando schema.sql..."
psql "$SUPABASE_DB_URL" -f supabase/schema.sql

echo "→ Ejecutando migrations..."
for f in supabase/migrations/*.sql; do
  echo "   ↪ $f"
  psql "$SUPABASE_DB_URL" -f "$f"
done

if [ "$SEED" = true ]; then
  echo "→ Ejecutando seeds..."
  psql "$SUPABASE_DB_URL" -f supabase/seed.sql
  [ -f supabase/seed_maule.sql ] && psql "$SUPABASE_DB_URL" -f supabase/seed_maule.sql
  [ -f supabase/seed_todas_regiones.sql ] && psql "$SUPABASE_DB_URL" -f supabase/seed_todas_regiones.sql
fi

echo ""
echo "✓ Migrations completas."
