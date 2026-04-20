# CLAUDE.md

Contexto persistente para Claude Code. Leer al iniciar cualquier sesión en este repo.

## Proyecto

**magical-planet** — app móvil+web de descubrimiento de panoramas (actividades, lugares) geolocalizados. Usuario arranca en Santiago Chile. Estética inspirada en Airbnb.

- **Frontend**: Expo (React Native + web) — `expo-router` 6
- **Backend**: Supabase (PostgreSQL + PostGIS + Auth + Storage + RLS)
- **Estado**: Zustand + persist (AsyncStorage)
- **Deploy web**: Vercel (`vercel.json` ejecuta `npx expo export --platform web` → `dist/`)

URL prod: https://magical-planet.vercel.app

## Stack detallado

| Capa | Librería |
|---|---|
| Routing | expo-router (file-based) |
| UI | React Native + @expo/vector-icons (Ionicons) |
| Estilos | StyleSheet inline — no hay theme system global todavía |
| Mapas | react-native-maps (nativo) + fallback `.web.tsx` |
| Estado cliente | zustand + persist middleware |
| Fetching | supabase-js directo (no React Query) |
| Auth | Supabase Auth con Google OAuth via `expo-auth-session` |
| Images | expo-image |
| Location | expo-location |

**Node mínimo**: 20+. Metro rompe con Node 18. Usar `nvm use 22.10.0`.

## Convenciones del proyecto

### Paths

- `app/` — rutas Expo Router (file-based)
- `app/(tabs)/` — tab navigator: index (home), favorites, perfil
- `app/(onboarding)/` — welcome, intereses, radio, compania
- `app/auth/` — login, callback
- `app/seccion/[tipo].tsx` — grid responsive para ver todos los panoramas de una sección
- `app/panorama/[id].tsx` — detalle con reviews
- `app/crear-panorama.tsx` — publicar (auth-gated)
- `app/filters.tsx` — modal filtros
- `components/` — reutilizables (`PanoramaCardAirbnb`, `RatingStars`, `MapaPanoramas`)
- `stores/` — zustand stores (`useAuthStore`, `useFavoritesStore`, `useFiltersStore`, `useLocationStore`, `useOnboardingStore`)
- `hooks/` — custom (`useNearbyPanoramas`, `useTopFavoritos`, `useReviews`)
- `lib/` — utils (`supabase.ts`, `types.ts`, `distance.ts`)
- `constants/categories.ts` — 6 categorías fijas
- `supabase/` — `schema.sql` (consolidado) + `seed.sql` + `migrations/`

### Convenciones de código

- **Idioma**: UI en español chileno neutro (vos/tú). Identifiers en español: `useNearbyPanoramas`, `panoramas_cerca`, `useFavoritesStore`.
- **Sin i18n** — español hard-coded.
- **Imports**: alias `@/` apunta a raíz (`tsconfig.json` paths).
- **Estilos**: co-ubicados en mismo archivo vía `StyleSheet.create`.
- **Iconos**: Ionicons siempre (`@expo/vector-icons`).
- **Colores**: paleta hard-coded por categoría en `constants/categories.ts`. Acento app `#E94F37` (rojo coral tipo airbnb), primary texto `#111`.
- **Expo Router typed-routes**: activado pero las nuevas rutas (`/auth/login`, `/crear-panorama`, `/(onboarding)/intereses`, etc.) necesitan cast `as any` hasta que expo regenere types. No borrar estos casts arbitrariamente.

### Supabase

- **Cliente**: `lib/supabase.ts` usa `EXPO_PUBLIC_SUPABASE_URL` + `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- **Persist session**: activado en mobile (AsyncStorage) y web (detectSessionInUrl=true).
- **RLS**: todas las tablas tienen RLS habilitada. Ver `supabase/schema.sql`.
- **Moderación panoramas**: columna `moderado boolean`. Anon solo ve `moderado=true`. Authenticated ve los suyos aunque no moderados. **Seeds se marcan moderados vía UPDATE al final de `seed.sql`**.
- **RPCs**: `panoramas_cerca(lat,lng,radio_m)`, `panoramas_top_favoritos(lat,lng,radio_m,limite)`. Ambos retornan `rating_promedio` + `total_reviews`.

### Auth

- Flow Google OAuth via `supabase.auth.signInWithOAuth({provider:'google'})` + `WebBrowser.openAuthSessionAsync` en mobile.
- `stores/useAuthStore.ts` hace `onAuthStateChange`:
  - `SIGNED_IN` → `mergeLocalToServer()` + `fetchFromServer()` de favoritos
  - `SIGNED_OUT` → `clearMemory()` de favoritos
- **Setup manual necesario**: Google Cloud Console (OAuth credentials) + Supabase Auth Providers (enable + pegar Client ID/Secret + agregar redirect URLs incluyendo dominio Vercel y `magicalplanet://auth/callback`).

### Publicar panoramas

- Solo usuarios logueados (auth gate en `app/crear-panorama.tsx`).
- INSERT con `creado_por=auth.uid()`, `moderado=false`.
- Imagen sube a bucket Storage `panoramas-imagenes` (debe existir; crear manual en dashboard).
- Moderación manual vía SQL: `UPDATE panoramas SET moderado=true WHERE id='...'`.

## Comandos útiles

```bash
# Dev
nvm use 22.10.0
npm install
npx expo start --web           # web
npx expo start --android
npx expo start --ios

# Checks
npx tsc --noEmit
npx expo lint

# Build web
npx expo export --platform web

# Deploy (necesita Vercel CLI + token)
npx vercel --prod --token=$VERCEL_TOKEN

# Env vars vercel
npx vercel env ls --token=$VERCEL_TOKEN
```

## Pitfalls conocidos

1. **Node 18 rompe metro** (`configs.toReversed is not a function`). Usar 20+.
2. **Expo Router typed-routes**: rutas nuevas necesitan `as any` hasta regeneración automática.
3. **Vars Supabase del plugin Vercel**: `vercel env pull` NO descarga valores de vars añadidas por integración (son sensitive). Para migraciones SQL se requiere pedir `POSTGRES_URL_NON_POOLING` manual desde dashboard.
4. **Google OAuth**: no hay forma programática de configurar Cloud Console. Es setup 100% manual.
5. **Seeds y moderación**: si se ejecuta `schema.sql` sin el UPDATE final del `seed.sql`, seeds quedan invisibles a anon (moderado=false por default).
6. **Favoritos sync circular import**: `useAuthStore` importa `useFavoritesStore`. Funciona porque se usa lazy via `getState()` en callbacks. No convertir en imports directos.
7. **expo-file-system**: nueva versión no expone `EncodingType`. Usar string literal `'base64'` directamente.
8. **Maps web**: `react-native-maps` no funciona en web. `MapaPanoramas.web.tsx` es fallback. No importar MapView en código shared sin verificar Platform.

## Patterns a seguir

- **Nueva sección del home** → agregar `app/seccion/[tipo].tsx` con case nuevo en el switch + llamar desde home con `onVerTodos`.
- **Nueva categoría** → agregar a `constants/categories.ts` + a check constraint en `supabase/schema.sql` + al type `CategoriaId` en `lib/types.ts`.
- **Nuevo filtro** → extender `lib/types.ts#Filtros` + `stores/useFiltersStore.ts` + aplicar en `hooks/useNearbyPanoramas.ts` + UI en `app/filters.tsx`.
- **Nuevo RPC** → crear migration file en `supabase/migrations/NNN_nombre.sql` + reflejar en `supabase/schema.sql` consolidado.

## No hacer

- No introducir React Query por ahora (todo el fetching es suficiente con supabase-js directo + useState).
- No introducir i18n hasta decidir locales soportados.
- No cambiar la paleta de colores sin alinear con CATEGORIAS constants.
- No hacer `force push` al repo sin confirmación.
- No commitear `.env`, `.env.vercel`, `dist/`, `node_modules/`.

## Estado actual (abril 2026)

- **MVP completo**: ver, favoritear (local + sync), onboarding 3-pasos, Google OAuth, publicar con moderación, reviews con rating, filtros (categorías, radio, precio rango, rating mínimo).
- **UI airbnb-style** aplicada al Home (pill search, tabs categoría top, carousels secciones, grid responsive Disponibles).
- **Deploy prod activo** en Vercel.
- **Pendiente setup externo**: Google OAuth, Storage bucket, migraciones SQL en DB prod (esperan `POSTGRES_URL_NON_POOLING`).
