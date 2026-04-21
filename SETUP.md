# SETUP.md — onboarding colaborador

Guía completa para que un nuevo desarrollador (humano + IA) continúe el proyecto desde cero.

## Resumen de la arquitectura

- **Frontend**: Expo 54 (React Native 0.81 + React 19) universal iOS/Android/Web
- **Routing**: expo-router 6 file-based
- **Backend**: Supabase (Postgres + PostGIS + Auth + Storage + RLS)
- **Deploy web**: Vercel
- **Mapas**: Leaflet (web) + react-native-maps (mobile)

## 1. Cuentas necesarias

| Servicio | Para | URL |
|---|---|---|
| Supabase | Backend + DB + Auth | https://supabase.com |
| Vercel | Deploy web | https://vercel.com |
| Google Cloud | OAuth Google | https://console.cloud.google.com |
| GitLab | Repo | https://gitlab.com |

Opcionales:
- Sentry (errores), PostHog (analytics), OpenWeather (clima).

## 2. Credenciales (setup una vez)

### Supabase
1. Crear proyecto nuevo en supabase.com
2. **Settings → API** → copiar:
   - `Project URL` → `EXPO_PUBLIC_SUPABASE_URL`
   - `anon/public key` → `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`
3. **Settings → Database** → Connection string (URI):
   - `SUPABASE_DB_URL` (reemplazar `[YOUR-PASSWORD]`)
4. Project ref = subdominio del URL → `SUPABASE_PROJECT_REF`

### Vercel
1. **Account → Tokens** → Create Token (scope Full account)
2. `VERCEL_TOKEN` en `.env`

### Google OAuth
1. Google Cloud Console → crear proyecto
2. **APIs & Services → Credentials** → Create OAuth 2.0 Client ID (Web)
3. Authorized redirect URI: `https://<SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback`
4. Copiar Client ID + Secret → `.env`
5. En Supabase: **Auth → Providers → Google** → Enable + pegar credentials
6. Supabase **Auth → URL Configuration**: agregar redirect URLs adicionales:
   - `magicalplanet://auth/callback` (mobile)
   - `https://<dominio-vercel>/auth/callback` (web)

### GitLab
1. Crear repo vacío en GitLab
2. **Profile → Access Tokens** (scope: `api`, `write_repository`)
3. `GITLAB_TOKEN` + `GITLAB_PROJECT_URL` en `.env`

## 3. Setup local (primer clone)

```bash
# Requiere Node 20+ (metro rompe con 18)
nvm install 22
nvm use 22

git clone <GITLAB_URL> magical-planet
cd magical-planet

# Copiar plantilla y rellenar
cp .env.example .env
# Editar .env con credenciales reales

# Validar
./scripts/check-env.sh
```

## 4. Setup automatizado completo

```bash
# Todo en uno: deps + migrations + storage + vercel link
./scripts/full-setup.sh --reset-db --seed
```

O paso por paso:

```bash
npm install
./scripts/migrate.sh --reset --seed    # BD desde cero + datos
./scripts/setup-storage.sh             # bucket Storage
./scripts/setup-vercel.sh              # link Vercel + env vars
```

## 5. Scripts disponibles

| Script | Función |
|---|---|
| `scripts/check-env.sh` | Valida `.env` completo |
| `scripts/migrate.sh [--reset] [--seed]` | Ejecuta schema + migrations via psql |
| `scripts/setup-storage.sh` | Crea bucket Storage Supabase |
| `scripts/setup-vercel.sh` | Link proyecto + sync env vars |
| `scripts/deploy.sh [--preview]` | Typecheck + build + deploy Vercel |
| `scripts/full-setup.sh` | Setup completo desde cero |

## 6. Correr dev server

```bash
# Web
npx expo start --web

# Mobile (Expo Go scaneando QR)
npx expo start

# Solo mobile Android emulator
npx expo start --android
```

## 7. Deploy

```bash
./scripts/deploy.sh          # producción
./scripts/deploy.sh --preview # preview branch
```

Push a `main` en Vercel (si está conectado) también auto-redeploy.

## 8. Marcar admin

Primera cuenta → admin manual:

```bash
psql "$SUPABASE_DB_URL" <<EOF
UPDATE user_profiles SET role='admin' WHERE user_id='<tu-uid>';
EOF
```

`<tu-uid>` se obtiene de Supabase Dashboard → Authentication → Users.

## 9. MCP servers (Claude/IA)

Archivo `.claude/mcp.json.example` tiene templates para:
- **Supabase MCP** — gestión DB + Auth + Storage via IA
- **Vercel MCP** — deploys, env vars, logs
- **Postgres MCP** — queries directos
- **Filesystem** — local

Copiar a `.claude/mcp.json` + completar variables.

Instalar Claude Code CLI: https://docs.claude.com/en/docs/claude-code
Luego `claude` en el repo — lee `CLAUDE.md` automáticamente.

## 10. Transferencia a GitLab

Desde magical-planet actual (GitHub):

```bash
# Agregar GitLab como remote
git remote add gitlab https://oauth2:$GITLAB_TOKEN@gitlab.com/<user>/magical-planet.git

# Push inicial
git push gitlab main

# Opcional: cambiar origin
git remote rename origin github
git remote rename gitlab origin
```

En GitLab:
- Configurar CI/CD variables (equivalente a `.env`, secretos)
- Crear `.gitlab-ci.yml` para build + deploy automático

## 11. Siguientes pasos

Ver [MEJORAS.md](MEJORAS.md) — 50 items roadmap priorizados.

Próximos sprint sugeridos:
1. **D.22** Mis lugares con estado
2. **F.33** Panel admin moderación
3. **K.47** Sentry + PostHog
4. **I.41** React Query

## 12. Troubleshooting

**Metro falla con `toReversed is not a function`** — Node 18. Usar `nvm use 22`.

**Types expo-router quejando** — rutas nuevas usan `as any` temporal. Normal hasta regen automática.

**Vercel env pull no trae valores** — vars de integración Supabase son sensitive. Setear manual vía dashboard o `setup-vercel.sh`.

**Mapa web no carga markers** — verificar consola browser, plugin `leaflet.markercluster` requiere `window.L` (ya manejado).

**Migration falla por permisos** — usar `SUPABASE_DB_URL` (password) no `service_role` en `migrate.sh`.
