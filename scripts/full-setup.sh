#!/usr/bin/env bash
# full-setup.sh — onboard completo: check env + migrations + storage + vercel link.
# Usage: ./scripts/full-setup.sh [--reset-db] [--seed]

set -e
cd "$(dirname "$0")/.."

RESET=""
SEED=""
for arg in "$@"; do
  [ "$arg" = "--reset-db" ] && RESET="--reset"
  [ "$arg" = "--seed" ] && SEED="--seed"
done

echo "========================================="
echo "  magical-planet — setup automático"
echo "========================================="

echo ""
echo "[1/5] Verificando env vars..."
./scripts/check-env.sh

echo ""
echo "[2/5] Instalando dependencias..."
npm install

echo ""
echo "[3/5] Ejecutando migrations Supabase..."
./scripts/migrate.sh $RESET $SEED

echo ""
echo "[4/5] Creando Storage bucket..."
./scripts/setup-storage.sh || echo "⚠️  Storage setup falló (revisa service_role key)"

echo ""
echo "[5/5] Link Vercel..."
./scripts/setup-vercel.sh

echo ""
echo "========================================="
echo "✓ Setup completo. Listo para desarrollo."
echo "========================================="
echo ""
echo "Siguientes pasos manuales:"
echo "  1. Configurar Google OAuth en Supabase Dashboard"
echo "     (Authentication → Providers → Google)"
echo "     Client ID + Secret: ver .env"
echo ""
echo "  2. Agregar redirect URLs adicionales en Supabase"
echo "     (Auth → URL Configuration):"
echo "     - magicalplanet://auth/callback"
echo "     - https://<tu-dominio-vercel>/auth/callback"
echo ""
echo "  3. Marcar admin:"
echo "     psql \$SUPABASE_DB_URL -c \"UPDATE user_profiles SET role='admin' WHERE user_id='<tu-uid>'\""
echo ""
echo "  4. Deploy: ./scripts/deploy.sh"
