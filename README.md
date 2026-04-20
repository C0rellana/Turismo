# Panoramas Cerca

POC de app híbrida (iOS / Android / Web) para descubrir panoramas y actividades cercanos.
Stack: Expo + expo-router + TypeScript + Zustand + Supabase (Postgres + PostGIS).

## Pantallas

1. **Onboarding** — pide permiso de ubicación
2. **Explorar** (Home) — toggle Mapa / Lista con pins y cards por categoría
3. **Filtros** (modal) — categorías, radio, precio
4. **Detalle** — foto, descripción, acciones (abrir en Maps, compartir, favorito)
5. **Favoritos** — lista local persistida con AsyncStorage

## Requisitos

- Node ≥ 20.19.4 (actualmente detectado: advertencia si usás Node 18)
- Cuenta Supabase (free tier alcanza)
- iOS: Xcode + simulador / Android: Android Studio + emulador
- Web: navegador

## Setup

1. Crear proyecto Supabase en https://supabase.com
2. En SQL Editor, ejecutar `supabase/schema.sql` y luego `supabase/seed.sql`
3. Copiar credenciales:
   ```bash
   cp .env.example .env
   ```
   Completar `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY` con valores del dashboard.
4. Instalar dependencias (ya corrió `create-expo-app`):
   ```bash
   npm install
   ```

## Correr

```bash
npm run ios      # iOS Simulator
npm run android  # Android emulator / device
npm run web      # Navegador (mapa deshabilitado, solo lista)
```

## Estructura

```
app/
  _layout.tsx            # Stack raíz
  index.tsx              # Redirect a onboarding o tabs
  (onboarding)/welcome.tsx
  (tabs)/
    _layout.tsx          # Tab bar
    index.tsx            # Home: mapa/lista
    favorites.tsx
  panorama/[id].tsx      # Detalle
  filters.tsx            # Modal
components/              # UI reusable
constants/categories.ts  # Categorías y color/icono
hooks/                   # useNearbyPanoramas
lib/                     # supabase client, types, formatters
stores/                  # Zustand (location, filters, favorites, onboarding)
supabase/                # schema.sql, seed.sql
```

## Datos

Tabla `panoramas` con PostGIS (`geography(point, 4326)`). Cliente llama RPC `panoramas_cerca(lat, lng, radio_m)` que devuelve resultados ordenados por distancia.

## Fuera de alcance (POC)

Auth, Sentry, CI/CD, Docker, tests, stores, notificaciones push, i18n.
