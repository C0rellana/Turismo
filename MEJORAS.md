# Plan de mejoras — checklist

Roadmap evolutivo. 50 items organizados por tema + extras post-arquitectura.

**Leyenda impacto**: 🔥 alto · ⚡ medio · 💡 bajo
**Leyenda esfuerzo**: S (≤1 día) · M (2-4 días) · L (1+ sem)

**Status**: ✅ implementado · ⏸ skip/pendiente · 🚧 en progreso

Última actualización: abril 2026 (post re-arquitectura plataforma turismo).

---

## Fase 0 — Re-arquitectura (✅ completa)

- ✅ Schema consolidado con tabla única `lugares` + enum `tipo_lugar` (turistico|panorama)
- ✅ Fechas evento (`fecha_inicio`, `fecha_fin`, `recurrente`)
- ✅ Rename `panoramas_*` → `lugares_*` en código y RPCs
- ✅ 5 tabs: Inicio, Explorar, Mapa, Panoramas, Perfil
- ✅ Mapa funcional web (Leaflet + OSM) + mobile (react-native-maps)
- ✅ Bordes regiones Chile dibujados en mapa web (GeoJSON de caracena/chile-geojson)
- ✅ Seeds Región del Maule (25 turísticos + 13 panoramas próximos)
- ✅ Textos español Chile neutro (voseo → tú)

---

## A. Onboarding y primeros momentos (3/3)

- ✅ **A.1** ⚡ S — Reconfigurar preferencias en Perfil (modal con intereses/radio/compañía).
- ✅ **A.2** ⚡ S — Demo mode con datos mock sin permisos/login (activado para guests sin resultados).
- ✅ **A.3** 💡 M — Coach-marks first-time dismissible (persist AsyncStorage).

## B. Home / Descubrimiento (8/9)

- ✅ **B.4** 🔥 M — Búsqueda texto + autocomplete (FTS Postgres tsvector stored + input debounced 300ms).
- ✅ **B.5** 🔥 M — Paginación infinite scroll (RPC `p_limit`/`p_offset` + `onEndReached`).
- ✅ **B.6** ⚡ S — Filtros persistidos entre sesiones (zustand persist AsyncStorage).
- ✅ **B.7** ⚡ S — Sección "Recién agregados" (hook `useRecientes`, order by created_at).
- ✅ **B.8** ⚡ M — Sección "Destacados/Tendencias" (RPC `lugares_top_favoritos`).
- ✅ **B.9** ⚡ M — Filtros transversales por tipo (turístico/panorama) en Mapa + categorías compartidas entre Inicio/Explorar/Mapa/Panoramas.
- ⏸ **B.10** 💡 M — Clima integrado (OpenWeather). Pendiente API key.
- ✅ **B.11** ⚡ M — Tags emergentes (10 tipos: pet-friendly, LGBT+, accesible, apto bebés, wifi, etc.) + filtro en modal.
- ✅ **B.12** ⚡ S — Skeleton loaders (`SkeletonCard`, `SkeletonRow`).

## C. Detalle lugar (6/6)

- ✅ **C.13** 🔥 S — "Cómo llegar" con deep links Maps / Uber / Transantiago / Compartir.
- ✅ **C.14** ⚡ S — Tiempos estimados (caminando 5 km/h, bici 15 km/h, auto 40 km/h urbano).
- ✅ **C.15** ⚡ S — Carrusel "Lugares similares" (`useLugaresSimilares` misma cat + cercanos).
- ✅ **C.16** ⚡ S — "Más del mismo creador" (`useLugaresCreador`).
- ✅ **C.17** ⚡ S — Filtrar reviews por recientes/mejores/N+ estrellas.
- ⏸ **C.18** ⚡ M — Fotos en reviews (user-uploaded). Pendiente schema `review_imagenes`.

## D. Creación de contenido (2/9)

- ✅ **D.19** 🔥 S — Selector pin manual con mini-mapa (Leaflet web, react-native-maps mobile, draggable + click).
- ✅ **D.20** 🔥 M — Fotos múltiples + galería swipeable (tabla `lugar_imagenes`, hasta 5 fotos, dots indicator).
- ⏸ **D.21** ⚡ M — Horarios JSONB + badge "abierto ahora" + filtro.
- ⏸ **D.22** 🔥 M — "Mis lugares" con estado (pendiente/aprobado/rechazado) + motivo. Requiere reemplazar `moderado bool` por enum estado.
- ⏸ **D.23** ⚡ S — Preview antes de publicar.
- ⏸ **D.24** ⚡ S — Borrador autosave AsyncStorage.
- ⏸ **D.25** ⚡ S — Duplicar lugar.
- ⏸ **D.26** ⚡ M — Importar desde URL Google Maps (parser).
- ⏸ **D.27** 💡 M — Plantillas por categoría (prompts sub-campos).

## E. Comunidad y reviews (0/5)

- ⏸ **E.28** ⚡ S — "Útil" / likes en reviews.
- ⏸ **E.29** ⚡ S — Dueño creador responde reviews.
- ⏸ **E.30** ⚡ M — Perfil público de usuario.
- ⏸ **E.31** 💡 L — Seguir usuarios + feed actividad.
- ⏸ **E.32** 💡 M — Check-in con geo + badge.

## F. Reportes y moderación (0/3)

- ⏸ **F.33** 🔥 M — Panel admin con flujo estados + motivo rechazo + notif creador.
- ⏸ **F.34** ⚡ S — Reportar lugar/review (tabla `reportes`).
- ⏸ **F.35** 🔥 M — Rate limiting publicación + validaciones server-side.

## G. Engagement y retención (0/3)

- ⏸ **G.36** 🔥 L — Push mobile (EAS) + web notifications.
- ⏸ **G.37** ⚡ M — Email newsletter semanal (Supabase Edge + Resend).
- ⏸ **G.38** ⚡ M — Referral con reward.

## H. Gamificación (0/2)

- ⏸ **H.39** 💡 M — Badges contribución.
- ⏸ **H.40** 💡 M — Leaderboard mensual top contribuidores.

## I. Performance y técnica (0/3)

- ⏸ **I.41** 🔥 M — React Query + cache SWR.
- ⏸ **I.42** ⚡ S — Imágenes responsive con params `?w=X&q=70` + blurhash pre-computado.
- ⏸ **I.43** ⚡ M — PWA service worker offline.

## J. Accesibilidad e internacionalización (0/3)

- ⏸ **J.44** ⚡ M — A11y: VoiceOver/TalkBack + navegación teclado + tamaños dinámicos.
- ⏸ **J.45** ⚡ M — Dark mode auto + toggle manual + design tokens.
- ⏸ **J.46** ⚡ L — i18n español/inglés/portugués (react-i18next).

## K. Integraciones y datos (0/2)

- ⏸ **K.47** 🔥 S — Sentry + PostHog (errores + funnels + flags + A/B).
- ⏸ **K.48** ⚡ S — Deep links app + OG tags + sitemap web.

## L. Monetización y escalado (0/2)

- ⏸ **L.49** 💡 L — Reservas + pagos (Stripe/MercadoPago + comisión).
- ⏸ **L.50** 💡 L — Listados premium / sponsored con disclaimer.

---

## Extras fuera de los 50 originales (✅ implementados)

Trabajos no listados originalmente pero surgidos en sprint:

- ✅ **Selector zona custom** — modal `ZonaPicker` con 21 ciudades Chile (Arica a Punta Arenas) + opción "Mi ubicación (GPS)". Store `useLocationStore` con campos `gps`/`custom`/`ubicacion` resuelta. Persist de custom. Integrado en tab Mapa (botón pill header + banner "Volver a mi ubicación") e Inicio (header saludo pressable). Afecta todas las tabs transversalmente.
- ✅ **Categorías transversales** — componente `CategoryTabs` reutilizable en Explorar, Mapa, Panoramas. Secciones horizontales de Inicio/Panoramas filtran por categorías del store (fetch 20 + filter client).
- ✅ **Buscador transversal** — componente `SearchPill` en Explorar, Mapa, Panoramas. Debounce 300ms. Usa FTS Postgres via param `q` del RPC.
- ✅ **Mapa con bordes regiones** — Leaflet web dibuja polígonos de regiones Chile con hover + tooltip nombre región.
- ✅ **Seed Región Maule** — `supabase/seed_maule.sql` con 25 turísticos (Siete Tazas, Altos de Lircay, Laguna del Maule, playas, termas, viñas, museos Talca, Lago Vichuquén) + 13 panoramas próximos con fechas relativas `now() + interval`.

---

## Progreso total

**Implementado**: 23/50 items originales (46%) + 5 extras críticos.

**Distribución por categoría**:
- A Onboarding: 3/3 ✅
- B Home/Descubrimiento: 8/9 ✅
- C Detalle: 6/6 ✅ (falta solo C.18)
- D Creación: 2/9 🚧
- E Comunidad: 0/5 ⏸
- F Moderación: 0/3 ⏸
- G Engagement: 0/3 ⏸
- H Gamificación: 0/2 ⏸
- I Performance: 0/3 ⏸
- J A11y/i18n: 0/3 ⏸
- K Integraciones: 0/2 ⏸
- L Monetización: 0/2 ⏸

**Sprints descubrimiento/consumidor (A+B+C)**: 17/18 = 94% ✅

---

## Prioridad próximos sprints

### Sprint 1 "Cerrar loop creador" (alto impacto objetivo "aumentar contenido")

- **D.22** 🔥 M — Mis lugares con estado (+ schema migration estado enum)
- **F.33** 🔥 M — Panel admin con aprobación/rechazo
- **D.23** ⚡ S — Preview antes publicar
- **D.24** ⚡ S — Borrador autosave
- **F.35** 🔥 M — Rate limiting publicación + validaciones

### Sprint 2 "Calidad contenido"

- **D.21** ⚡ M — Horarios + abierto ahora
- **C.18** ⚡ M — Fotos en reviews
- **D.25** ⚡ S — Duplicar lugar
- **D.26** ⚡ M — Import Google Maps URL

### Sprint 3 "Retención + growth"

- **G.36** 🔥 L — Push notifications
- **G.38** ⚡ M — Referral con reward
- **K.47** 🔥 S — Sentry + PostHog
- **K.48** ⚡ S — Deep links + OG tags

### Sprint 4 "Escala + performance"

- **I.41** 🔥 M — React Query migration
- **I.42** ⚡ S — Imágenes responsive
- **B.10** 💡 M — Clima integrado (si API key disponible)
- **I.43** ⚡ M — PWA service worker

### Sprint 5 "Pulido + a11y"

- **J.44** ⚡ M — A11y labels + navegación teclado
- **J.45** ⚡ M — Dark mode + design tokens
- **E.28** ⚡ S — Likes en reviews
- **E.29** ⚡ S — Responder reviews (creador)

### Largo plazo (cuando haya masa crítica users)

- **E.30-E.32** — Perfil público, seguir, check-in
- **H.39-H.40** — Badges + leaderboard
- **J.46** — i18n multi-idioma
- **L.49-L.50** — Reservas + listados premium

---

## Métricas a medir (post K.47)

Con PostHog configurado, trackear:

- Conversión onboarding completo → primera sesión
- CTR carousels vs "Ver todos"
- Bounce al login (al tap publicar)
- % usuarios que dejan review tras visitar detalle
- Tiempo hasta primer favorito
- Retención D1 / D7 / D30
- Ratio publicaciones aprobadas vs rechazadas
- Búsquedas sin resultados (mejorar seed contenido)
- % guests que se convierten a usuarios (demo mode efectividad)
- Clics en botón "Cambiar zona" → qué ciudades se seleccionan más
