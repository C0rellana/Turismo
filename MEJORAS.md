# Plan de mejoras — 20 puntos

Roadmap priorizado para iteraciones futuras. Agrupado por tema.

**Leyenda impacto**: 🔥 alto · ⚡ medio · 💡 bajo
**Leyenda esfuerzo**: S (≤1 día) · M (2-4 días) · L (1+ sem)

---

## 🏗️ Infraestructura y calidad

### 1. 🔥 Tests automáticos (unit + E2E) — L
Cero tests hoy. Agregar Jest + React Native Testing Library para stores/hooks. Playwright o Maestro para E2E del flujo onboarding → login → publicar → review. Mock Supabase con MSW.

### 2. 🔥 CI/CD en GitHub Actions — S
Workflow con `typecheck`, `lint`, `build web`, `expo-doctor`. Bloquear merge si rompe. Preview deploy automático en cada PR vía Vercel.

### 3. ⚡ Error tracking + analytics — S
Integrar Sentry (errores + performance) y PostHog o Plausible (eventos). Tracker clicks en secciones, búsquedas, conversión onboarding.

### 4. ⚡ Migrar a React Query (TanStack Query) — M
Reemplazar hooks con `useState`/`useEffect` manual por `useQuery`/`useMutation`. Cache, dedupe, refetch on focus, invalidación tras mutaciones. Elimina refrescos manuales de reviews/favoritos.

### 5. 💡 Design tokens + theme system — M
Extraer colores/spacing/typography a `constants/theme.ts`. Soportar dark mode (respetando `useColorScheme`). Actualmente colores hard-coded y sin dark mode real.

---

## 📱 UX / Producto

### 6. 🔥 Búsqueda por texto — M
Input en el pill de search con autocomplete. Backend: índice GIN + `ILIKE` o full-text search en `panoramas.nombre` + `descripcion` + `direccion`. Agregar a `useNearbyPanoramas` filtro `q: string`.

### 7. 🔥 Paginación / infinite scroll — M
RPCs hoy retornan todo en una sola llamada. Agregar `offset` + `limit` a `panoramas_cerca`. En `app/seccion/[tipo].tsx` paginar con `FlatList` `onEndReached`.

### 8. 🔥 Notificaciones push — M
Via `expo-notifications` + Edge Function. Avisar cuando un panorama propio es aprobado, cuando alguien deja review en tu publicación, cuando hay nuevos panoramas en tus categorías favoritas.

### 9. ⚡ Selector de ubicación manual — S
Hoy el panorama creado usa la ubicación actual del usuario. Agregar mini-mapa interactivo en `crear-panorama.tsx` para dropear un pin en ubicación correcta. Usar `MapPressEvent` de react-native-maps.

### 10. ⚡ Fotos múltiples + galería — M
Hoy solo una foto por panorama. Tabla `panorama_imagenes (id, panorama_id, url, orden)`. Galería horizontal en detalle (Pressable → viewer full-screen). Upload múltiple con `ImagePicker` `allowsMultipleSelection`.

### 11. ⚡ Horarios y disponibilidad — M
Campo `horarios jsonb` en panoramas (ej. `{"lun": ["10:00-20:00"], ...}`). Mostrar "Abierto ahora" / "Cierra a las X" en card. Filtro "Abierto ahora".

### 12. ⚡ Compartir con deep links — S
Hoy `Share.share` envía solo texto. Implementar link `magicalplanet://panorama/<id>` + `https://magical-planet.vercel.app/panorama/<id>`. Abre detalle directo. Meta tags OpenGraph para previsualizaciones en WhatsApp/IG.

### 13. 💡 Modo "Colecciones" / guías curadas — L
Usuarios crean listas temáticas ("Ruta cafés Providencia", "Panoramas niños lluvia"). Tabla `colecciones` + `coleccion_items`. Sección home "Colecciones destacadas".

---

## 🔐 Seguridad y moderación

### 14. 🔥 Panel de admin para moderación — L
Hoy moderación = UPDATE manual en SQL. Crear tab admin (oculto detrás de rol) con lista de pendientes, preview, botones "Aprobar / Rechazar / Pedir cambios". Rol `admin` via `auth.users.app_metadata.role`.

### 15. 🔥 Rate limiting + validación server-side — M
Hoy un usuario puede crear panoramas ilimitados vía RLS. Agregar Edge Function o trigger `count(*) < 10 per día per user`. Validar URLs imagen (dominios permitidos), tamaño texto, coordenadas dentro de Chile.

### 16. ⚡ Reportar contenido — S
Botón "Reportar" en detalle. Tabla `reportes(user_id, panorama_id, motivo, descripcion)`. Admin revisa y elimina si aplica.

---

## 🚀 Performance

### 17. ⚡ Optimización de imágenes — S
Las URLs Unsplash son full-size. Usar query params `?w=400&q=70` según tamaño de card (pequeña/grande). Agregar blurhash pre-computado por imagen para placeholder. Lazy load sections horizontales.

### 18. ⚡ Cache RPC con stale-while-revalidate — S
Requiere #4 (React Query). `panoramas_cerca` cachea por 30s, revalida en background. Reduce 80% de requests redundantes al cambiar tab/regresar.

---

## 🌎 Expansión

### 19. ⚡ Multi-ciudad + multi-país — M
Hoy hard-coded "Santiago centro" como fallback. Tabla `ciudades` + `paises`. Selector de ciudad en header. RPC recibe ciudad_id opcional. Ampliar seed.

### 20. 💡 Sistema de reservas — L
Integrar con partners (restaurantes, tours): link UTM a su reserva. Luego: reserva nativa en app → tabla `reservas` + pagos Stripe/MercadoPago. Comisión por reserva = modelo de negocio viable.

---

## Prioridad sugerida próximas 2 sprints

**Sprint 1 (foundation, 2 semanas)**
- #2 CI/CD
- #3 Sentry + PostHog
- #4 React Query migration
- #6 Búsqueda por texto
- #7 Paginación

**Sprint 2 (features, 2 semanas)**
- #8 Push notifications
- #9 Selector ubicación manual
- #14 Panel admin moderación
- #12 Deep links
- #17 Optimización imágenes

Post-sprint: tests (#1), horarios (#11), fotos múltiples (#10), dark mode (#5).

---

## Métricas a medir (con PostHog post-#3)

- Conversión onboarding completo → primera sesión
- CTR carousels vs "Ver todos"
- Bounce al login (al tap publicar)
- % usuarios que dejan review tras visitar detalle
- Tiempo hasta primer favorito
- Retención D1 / D7 / D30
