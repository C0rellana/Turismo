# magical-planet

Plataforma web + mobile para **descubrir turismo** en Chile. Arranque enfocado en Santiago. Dos mundos: **lugares turísticos** (museos, parques, monumentos, restaurantes) y **panoramas** (eventos casuales con fecha).

**Producción:** https://magical-planet.vercel.app

## Features

### Navegación (5 tabs)
- **Inicio** — dashboard con saludo, bloque destacado zona, carousels "Cerca ti", "Próximos panoramas", "Destacados", "Recién agregados".
- **Explorar** — lugares turísticos con búsqueda full-text, filtros, grid responsive 1-4 columnas, paginación infinite scroll.
- **Mapa** — Leaflet + OpenStreetMap en web, react-native-maps en mobile, markers por categoría, filtros tipo (turístico/panorama/todos), popup clickable.
- **Panoramas** — eventos y actividades casuales con fecha, próximos de la semana, favoritos comunidad, lista completa.
- **Perfil** — login Google, favoritos count, modal preferencias (intereses/radio/compañía), publicar, logout.

### Contenido
- **Publicar** (auth-gated): selector tipo (turístico o panorama), hasta 5 fotos, pin manual en mini-mapa, fechas evento, categorías, precio, moderación obligatoria.
- **Favoritos**: local anónimos, sync Supabase para logueados con merge automático al login.
- **Reviews**: 1-5 estrellas + comentario, filtros (recientes / mejores / N+ estrellas), 1 por user/lugar.
- **Detalle lugar**: galería swipeable, "Cómo llegar" (Maps/Uber/Transantiago), tiempos estimados (caminando/bici/auto), lugares similares, más del mismo creador.

### Filtros
- Categorías (6), radio (5-20000 km), precio (solo gratis / rango min-max), rating mínimo, tags emergentes (pet-friendly, LGBT+, accesible, wifi, terraza, A/C, etc.).

### Onboarding
- 3 pasos opcionales: intereses + radio + compañía (solo/pareja/familia/amigos). Primera vez. Editable en Perfil.
- Demo mode con datos mock para guest sin login.
- Coach-marks first-time dismissible en Inicio.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Expo 54 + React Native 0.81 + React 19 |
| Routing | expo-router 6 (file-based) |
| Estado | Zustand + persist (AsyncStorage) |
| Backend | Supabase (PostgreSQL + PostGIS + Auth + Storage) |
| Mapas web | Leaflet + OpenStreetMap (gratis ilimitado) |
| Mapas mobile | react-native-maps |
| Deploy | Vercel |

## Requisitos

- **Node.js ≥ 20** (Metro rompe con 18)
- **npm** o **pnpm**
- Cuenta Supabase
- Mobile: Expo Go o build EAS

## Setup rápido

```bash
git clone <repo> magical-planet
cd magical-planet
nvm use 22
cp .env.example .env
# editar .env con credenciales (ver SETUP.md para obtenerlas)

./scripts/full-setup.sh --seed   # deps + migrations + storage + vercel
```

Onboarding completo + credenciales: [SETUP.md](SETUP.md)
Contribuir: [CONTRIBUTING.md](CONTRIBUTING.md)

## Setup local manual

### `.env`

```env
EXPO_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

## Base de datos (Supabase)

1. Crear proyecto en https://supabase.com
2. SQL Editor → ejecutar en orden:
   - [`supabase/schema.sql`](supabase/schema.sql) — tablas, RPCs, RLS, triggers, índices
   - [`supabase/seed.sql`](supabase/seed.sql) — ~30 lugares Santiago + UPDATE moderado=true + tipo=turistico
3. Storage → New bucket `panoramas-imagenes` público
4. **Google OAuth** para publicar:
   - Google Cloud Console → OAuth 2.0 Client ID (Web) → redirect `https://<ref>.supabase.co/auth/v1/callback`
   - Supabase Auth → Providers → Google: enable + Client ID + Secret
   - Auth URL Configuration → Additional redirect URLs: `magicalplanet://auth/callback` + dominio Vercel

## Run

```bash
npx expo start --web        # http://localhost:8081
npx expo start --android
npx expo start --ios
```

## Build + Deploy web (Vercel)

Config en [`vercel.json`](vercel.json). Push a `main` = auto-redeploy.

### CLI

```bash
npx vercel link
npx vercel env add EXPO_PUBLIC_SUPABASE_URL production
npx vercel env add EXPO_PUBLIC_SUPABASE_ANON_KEY production
npx vercel --prod
```

### Dashboard

https://vercel.com/new → importar repo → framework **Other** → agregar env vars → deploy.

## Estructura

```
magical-planet/
├── app/                          # Rutas Expo Router
│   ├── (onboarding)/             # welcome → intereses → radio → compania
│   ├── (tabs)/                   # inicio, explorar, mapa, panoramas, perfil
│   ├── auth/                     # login, callback
│   ├── lugar/[id].tsx            # detalle con galería + reviews + similares
│   ├── seccion/[tipo].tsx        # grid responsive por tipo
│   ├── crear-lugar.tsx           # publicar (auth-gated)
│   └── filters.tsx               # modal filtros
├── components/
│   ├── LugarCard.tsx             # card universal
│   ├── MapaLeaflet.tsx/.web.tsx  # mapa (mobile/web)
│   ├── MiniMapaPicker.tsx/.web.tsx  # pin manual crear
│   ├── CoachMark.tsx             # tooltip first-time
│   ├── Skeleton.tsx              # loading placeholders
│   ├── WelcomeCTA.tsx            # banner login guests
│   ├── RatingStars.tsx
│   ├── SectionHeader.tsx
│   └── CategoryChip.tsx
├── constants/
│   ├── categories.ts             # 6 categorías fijas
│   └── tags.ts                   # 10 tags emergentes
├── hooks/
│   ├── useNearbyLugares.ts       # búsqueda + paginación
│   ├── useTopFavoritos.ts
│   ├── usePanoramasProximos.ts
│   ├── useRecientes.ts
│   ├── useLugaresSimilares.ts
│   ├── useLugaresCreador.ts
│   └── useReviews.ts
├── lib/
│   ├── supabase.ts
│   ├── types.ts                  # Lugar, Review, Filtros, TipoLugar
│   ├── distance.ts
│   └── demoLugares.ts            # mock data A.2
├── stores/                       # Zustand
│   ├── useAuthStore.ts
│   ├── useFavoritesStore.ts
│   ├── useFiltersStore.ts
│   ├── useLocationStore.ts
│   └── useOnboardingStore.ts
├── supabase/
│   ├── schema.sql                # consolidado (ejecutar fresh)
│   ├── seed.sql
│   └── migrations/               # 002, 003, 004, 005
├── app.json
└── vercel.json
```

## Comandos

```bash
npm start                       # Expo dev
npx expo lint                   # lint
npx tsc --noEmit                # typecheck
npx expo export --platform web  # build web
npx vercel --prod               # deploy
```

## Reset BD (destructivo)

```sql
drop function if exists public.lugares_cerca cascade;
drop function if exists public.lugares_top_favoritos cascade;
drop function if exists public.panoramas_proximos cascade;
drop function if exists public.touch_updated_at cascade;
drop table if exists public.reviews cascade;
drop table if exists public.favoritos cascade;
drop table if exists public.lugar_imagenes cascade;
drop table if exists public.lugares cascade;
drop type if exists tipo_lugar cascade;
delete from storage.objects where bucket_id = 'panoramas-imagenes';
delete from storage.buckets where id = 'panoramas-imagenes';
```

Luego re-ejecutar `schema.sql` + `seed.sql`.

## Roadmap

Ver [MEJORAS.md](MEJORAS.md) — 50 mejoras priorizables por categoría.

## Contexto técnico para contribuir

Ver [CLAUDE.md](CLAUDE.md) — convenciones, pitfalls, patrones, hooks, componentes.

## Licencia

MIT.
