# magical-planet

App móvil y web para descubrir **panoramas** (actividades, lugares, experiencias) cerca de ti. Estilo visual inspirado en Airbnb. Arranque enfocado en Santiago de Chile.

**Producción:** https://magical-planet.vercel.app

## Features

- **Onboarding** de 3 pasos: categorías de interés, radio de búsqueda, tipo de compañía (solo, pareja, familia, amigos).
- **Home airbnb-style**: pill search, tabs segmented de categorías, carousels horizontales por sección ("Cerca de ti", "Basado en tus intereses", "Favoritos entre usuarios"), grid responsive "Disponibles ahora" (1 a 4 columnas según ancho).
- **Favoritos**: local (AsyncStorage) para anónimos; **sincronizados** a Supabase para usuarios logueados (merge automático al iniciar sesión).
- **Login Google** vía Supabase Auth + `expo-auth-session`.
- **Publicar panorama** (solo logueados): nombre, descripción, categoría, precio, imagen (Storage), ubicación actual. Moderación manual antes de aparecer al público.
- **Reviews**: rating 1-5 estrellas + comentario. Cada usuario una reseña por panorama. Agregado visible en cards + detalle.
- **Filtros avanzados**: categorías, radio, precio (solo gratis / rango min-max), calificación mínima.
- **Mapa** fullscreen accesible desde FAB, con marcadores por categoría.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Expo 54 + React Native 0.81 + React 19 |
| Routing | expo-router 6 (file-based) |
| Estado | Zustand + persist (AsyncStorage) |
| Backend | Supabase (PostgreSQL + PostGIS + Auth + Storage) |
| Mapas | react-native-maps + fallback web |
| Deploy web | Vercel |

## Requisitos

- **Node.js ≥ 20** (Metro rompe con 18; usar `nvm use 22.10.0` si tenés nvm)
- **npm** o **pnpm**
- Cuenta Supabase (URL + anon key)
- Para mobile: Expo Go app o build nativo

## Setup local

```bash
git clone https://github.com/C0rellana/Turismo.git magical-planet
cd magical-planet
nvm use 22.10.0
npm install
cp .env.example .env
# Editar .env con tus credenciales Supabase
```

### Variables de entorno (`.env`)

```env
EXPO_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

## Base de datos (Supabase)

1. Crear proyecto en https://supabase.com
2. Ir a **SQL Editor** y ejecutar en orden:
   - [`supabase/schema.sql`](supabase/schema.sql) — tablas, RPCs, RLS, triggers
   - [`supabase/seed.sql`](supabase/seed.sql) — ~30 panoramas de Santiago + UPDATE para marcarlos moderados
3. **Storage**: Dashboard → Storage → **New bucket** `panoramas-imagenes` público. Policy INSERT = authenticated, SELECT = public.
4. **Google OAuth** (para publicar panoramas):
   - Google Cloud Console → Credentials → OAuth 2.0 Client ID (Web)
     - Redirect URI: `https://<ref>.supabase.co/auth/v1/callback`
   - Supabase → Authentication → Providers → **Google**: enable + pegar Client ID + Secret
   - **Additional redirect URLs**: `magicalplanet://auth/callback`, `https://<tu-dominio-vercel>/auth/callback`

## Run

```bash
# Web
npx expo start --web

# Mobile (requiere Expo Go o build)
npx expo start --android
npx expo start --ios
```

## Build + Deploy web (Vercel)

Config ya está en [`vercel.json`](vercel.json).

### Via CLI

```bash
npx vercel link
npx vercel env add EXPO_PUBLIC_SUPABASE_URL production
npx vercel env add EXPO_PUBLIC_SUPABASE_ANON_KEY production
npx vercel --prod
```

### Via Dashboard

1. Importar repo en https://vercel.com/new
2. Framework Preset: **Other**
3. Agregar env vars `EXPO_PUBLIC_SUPABASE_URL` + `EXPO_PUBLIC_SUPABASE_ANON_KEY` (Production, Preview, Development)
4. Deploy

Push a `main` = auto-redeploy.

## Estructura

```
magical-planet/
├── app/                        # Rutas Expo Router (file-based)
│   ├── (onboarding)/           # welcome → intereses → radio → compania
│   ├── (tabs)/                 # index (home), favorites, perfil
│   ├── auth/                   # login, callback
│   ├── seccion/[tipo].tsx     # grid de todos los panoramas de una sección
│   ├── panorama/[id].tsx      # detalle + reviews
│   ├── crear-panorama.tsx     # publicar
│   └── filters.tsx             # modal filtros
├── components/                 # PanoramaCardAirbnb, RatingStars, MapaPanoramas
├── constants/categories.ts     # 6 categorías fijas
├── hooks/                      # useNearbyPanoramas, useTopFavoritos, useReviews
├── lib/                        # supabase.ts, types.ts, distance.ts
├── stores/                     # Zustand: auth, favorites, filters, location, onboarding
├── supabase/
│   ├── schema.sql              # consolidado (ejecutar en reset)
│   ├── seed.sql                # panoramas demo Santiago
│   └── migrations/             # 002_publish_and_users, 003_reviews
├── app.json                    # config Expo
└── vercel.json                 # config deploy
```

## Comandos útiles

```bash
npm start                       # Expo dev server
npx expo lint                   # lint
npx tsc --noEmit                # typecheck
npx expo export --platform web  # build web
npx vercel --prod               # deploy prod
```

## Reset de BD (destructivo)

Para empezar desde cero, ejecutar en **SQL Editor** de Supabase:

```sql
drop function if exists public.panoramas_cerca cascade;
drop function if exists public.panoramas_top_favoritos cascade;
drop function if exists public.touch_updated_at cascade;
drop table if exists public.reviews cascade;
drop table if exists public.favoritos cascade;
drop table if exists public.panoramas cascade;
delete from storage.objects where bucket_id = 'panoramas-imagenes';
delete from storage.buckets where id = 'panoramas-imagenes';
```

Luego re-ejecutar `supabase/schema.sql` y `supabase/seed.sql`.

## Roadmap

Ver [MEJORAS.md](MEJORAS.md) — plan de 20 mejoras propuestas para próximas iteraciones.

## Documentación para contribuir

Ver [CLAUDE.md](CLAUDE.md) — contexto técnico completo: convenciones, pitfalls, patterns, comandos.

## Licencia

MIT.
