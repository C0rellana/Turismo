# CLAUDE.md

Contexto persistente para Claude Code. Leer al iniciar cualquier sesión en este repo.

## Proyecto

**magical-planet** — plataforma turismo Chile (foco inicial Santiago). Descubrir lugares turísticos (monumentos, museos, parques, restaurantes) y panoramas (eventos casuales con fecha).

- **Frontend**: Expo 54 + React Native 0.81 + React 19 (mobile + web)
- **Routing**: expo-router 6 (file-based, typed-routes on)
- **Backend**: Supabase (PostgreSQL + PostGIS + Auth + Storage + RLS)
- **Estado**: Zustand + persist (AsyncStorage)
- **Deploy web**: Vercel

URL prod: https://magical-planet.vercel.app
Repo: https://github.com/C0rellana/Turismo

## Arquitectura

### Modelo de datos

**Tabla única `lugares`** con enum `tipo_lugar`:
- `turistico` — lugares fijos visitables (museos, parques, restaurantes, monumentos)
- `panorama` — eventos o actividades casuales con fecha (`fecha_inicio`, `fecha_fin`)

Columnas clave:
- `location` geography(point, 4326) — PostGIS
- `categoria` enum 6 valores
- `busqueda_tsv` tsvector stored (FTS español)
- `tags` text[] (pet-friendly, wifi, etc.)
- `creado_por` uuid → auth.users
- `moderado` boolean — anon ve solo `true`; auth ve sus propios pendientes

**Tablas relacionadas**:
- `favoritos(user_id, lugar_id)` — sync con RLS
- `reviews(lugar_id, user_id, rating 1-5, comentario)` — 1 por par
- `lugar_imagenes(lugar_id, url, orden)` — fotos múltiples

### RPCs Supabase

- `lugares_cerca(lat, lng, radio_m, tipos[], q, p_limit, p_offset)` — búsqueda + paginación + filtros
- `lugares_top_favoritos(lat, lng, radio_m, limite, tipos[])` — ranking por favoritos
- `panoramas_proximos(lat, lng, radio_m, dias, p_limit)` — eventos próximos por fecha

Todos los RPCs respetan RLS y filtro moderado+ownership.

### Navegación (5 tabs)

```
app/(tabs)/
├── index.tsx         # INICIO — dashboard: saludo, bloques, carousels mixtos
├── explorar.tsx      # EXPLORAR — lugares turísticos, búsqueda, grid responsive
├── mapa.tsx          # MAPA — Leaflet web + react-native-maps mobile
├── panoramas.tsx     # PANORAMAS — eventos/casuales con fecha
└── perfil.tsx        # PERFIL — user + preferencias modal
```

Rutas stack:
- `lugar/[id].tsx` — detalle con galería, reviews filtrables, similares, creador, cómo llegar
- `crear-lugar.tsx` — publicar (auth-gated) con tipo+pin manual+fotos multi+fecha
- `auth/login` + `auth/callback` — Google OAuth
- `filters.tsx` — modal filtros (categorías, radio, precios rango, rating, tags)
- `seccion/[tipo].tsx` — grid responsive por tipo (cerca/intereses/favoritos/recientes)
- `(onboarding)/` — welcome → intereses → radio → compania (solo primera vez)

## Convenciones

### Código

- **Idioma**: UI español chileno neutro (vos/tú). Identifiers en español: `useNearbyLugares`, `lugares_cerca`, `CrearLugar`.
- **Sin i18n** — strings hard-coded.
- **Alias**: `@/` → raíz (`tsconfig.json`).
- **Estilos**: `StyleSheet.create` co-ubicado.
- **Iconos**: Ionicons (`@expo/vector-icons`).
- **Colores**: paleta hard-coded por categoría. Acento `#E94F37` (airbnb-like).
- **Expo typed-routes**: rutas nuevas necesitan `as any` hasta regen.

### Patrones

**Nueva feature:**
1. Schema migration en `supabase/migrations/NNN_nombre.sql`
2. Reflejar en `supabase/schema.sql` consolidado
3. Tipos en `lib/types.ts`
4. Hook en `hooks/useX.ts`
5. UI en `app/...` o `components/...`

**Nueva tab:**
- Agregar screen en `app/(tabs)/nombre.tsx`
- Agregar entry en `app/(tabs)/_layout.tsx`
- Definir color icono activo

**Nuevo tipo de contenido:**
- Agregar valor al enum `tipo_lugar` en migration
- Reflejar en `TipoLugar` en types.ts
- Filtros en RPCs aceptan `tipos[]` array

## Comandos

```bash
nvm use 22.10.0                  # Node 20+ obligatorio
npm install
npx expo start --web
npx expo start --android
npx tsc --noEmit                 # typecheck
npx expo lint                    # lint
npx expo export --platform web   # build web
npx vercel --prod                # deploy
```

## Pitfalls conocidos

1. **Node 18 rompe metro** — usar 20+.
2. **Typed-routes**: rutas nuevas necesitan `as any` hasta regeneración.
3. **Vars Vercel-Supabase integration**: `vercel env pull` NO descarga valores sensibles.
4. **Google OAuth**: setup 100% manual (Cloud Console + Supabase dashboard).
5. **Seeds**: `seed.sql` hace UPDATE final para marcar `moderado=true` y `tipo='turistico'`.
6. **Import circular**: `useAuthStore` ↔ `useFavoritesStore`. Funciona vía `getState()` lazy.
7. **expo-file-system**: usar string literal `'base64'` (no `EncodingType.Base64`).
8. **Maps web**: `react-native-maps` no anda web. Usa `MapaLeaflet.web.tsx` (Leaflet).
9. **Leaflet SSR**: import dinámico dentro de `useEffect` para evitar build errors.
10. **Storage bucket**: `panoramas-imagenes` se usa para ambos tipos. Crear manual en dashboard.

## Hooks clave

- `useNearbyLugares({ tipos, q, pageSize })` — búsqueda + paginación via RPC
- `useTopFavoritos(limite, tipos)` — ranking favoritos comunidad
- `usePanoramasProximos(dias, limite)` — eventos próximos
- `useRecientes(limite, tipos)` — order by created_at desc
- `useLugaresSimilares(lugar, limite)` — misma cat + cercanos
- `useLugaresCreador(lugarId, limite)` — del mismo user
- `useReviews(lugarId, filtro)` — reviews + rating + filter

## Componentes clave

- `LugarCard` — card universal con badge evento/top/nuevo, rating, heart fav
- `MapaLeaflet` — wrapper (web Leaflet, mobile react-native-maps)
- `MiniMapaPicker` — mini-mapa interactivo para pin en crear-lugar
- `RatingStars` — readonly + interactivo
- `Skeleton` / `SkeletonRow` / `SkeletonCard` — loading placeholders
- `CoachMark` — tooltip first-time dismissible (persist AsyncStorage)
- `WelcomeCTA` — banner login incentivado para guests
- `SectionHeader` — título + subtítulo + chevron para "Ver todos"

## Stores Zustand

- `useAuthStore` — user, session, signInWithGoogle, signOut, init
- `useFavoritesStore` — local + Supabase sync, merge on login
- `useFiltersStore` — persist: categorias, radio, precios, rating, tags
- `useLocationStore` — ubicación actual o Santiago default
- `useOnboardingStore` — completado, intereses, radio, compania

## Seguridad / Auth

- Google OAuth via `supabase.auth.signInWithOAuth` + `WebBrowser.openAuthSessionAsync`
- Mobile: scheme `magicalplanet://auth/callback`
- Web: `<dominio>/auth/callback`
- `onAuthStateChange` dispara merge favoritos locales → Supabase
- Publicar/reviews auth-gated. Reviews abiertas a lectura anon.

## Scripts automatizados (prefiere estos)

Todo lo operacional está scripteado en `scripts/`. Úsalos en vez de ejecutar comandos sueltos:

- `./scripts/check-env.sh` — valida `.env`
- `./scripts/migrate.sh [--reset] [--seed]` — schema + migrations + opcional seeds
- `./scripts/setup-storage.sh` — crea bucket Supabase via Management API
- `./scripts/setup-vercel.sh` — link proyecto + sync env vars
- `./scripts/deploy.sh [--preview]` — typecheck + build + deploy
- `./scripts/full-setup.sh [--reset-db] [--seed]` — onboard completo desde cero

Requiere `.env` completo (ver `.env.example`).

## MCP servers (recomendado cuando trabajes con IA)

`.claude/mcp.json.example` tiene templates. Copiar a `.claude/mcp.json` y completar:

- **Supabase MCP**: gestión DB + Auth + Storage sin Dashboard
- **Vercel MCP**: deploys + env vars + logs
- **Postgres MCP**: queries directos a la DB
- **Filesystem**: local

Con MCP activos, IA puede: ejecutar migrations, crear buckets, consultar DB, deploy prod, leer logs prod — todo sin salir del chat.

## Setup externo requerido

1. Supabase: ejecutar `supabase/schema.sql` + `seed.sql` en SQL Editor
2. Supabase: crear bucket Storage `panoramas-imagenes` público (INSERT auth, SELECT public)
3. Google Cloud Console: OAuth 2.0 Client ID Web + redirect `https://<ref>.supabase.co/auth/v1/callback`
4. Supabase Auth → Providers → Google: enable + Client ID + Secret
5. Supabase Auth → URL Configuration: Additional redirect URLs: `magicalplanet://auth/callback` + dominio Vercel

## No hacer

- No introducir React Query todavía (supabase-js directo suficiente).
- No cambiar paleta colores sin alinear con `constants/categories.ts` + `tags.ts`.
- No hacer force push sin confirmación.
- No commitear `.env`, `.env.vercel`, `dist/`, `node_modules/`, `.expo/`.
- No reintroducir nombre `panoramas` en código nuevo — usar `lugares` con `tipo`.

## Estado actual (abril 2026)

Features completas:
- Plataforma turismo con 5 tabs (Inicio/Explorar/Mapa/Panoramas/Perfil)
- Tabla única `lugares` con tipo turistico/panorama + fechas eventos
- Full-text search + paginación infinite scroll
- Mapa funcional web (Leaflet) + mobile (react-native-maps)
- Auth Google + publicar con moderación + reviews con filtros + fotos múltiples
- Selector pin manual en crear-lugar
- Cómo llegar (Maps/Uber/Transantiago) + tiempos estimados
- Tags pet-friendly/accesible/wifi/etc
- Coach-marks + demo mode para guests
- Reconfigurar preferencias en Perfil
- Skeleton loaders + grid responsive 1-4 columnas
