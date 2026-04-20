# Plan de mejoras

Roadmap priorizado. 50 items totales. Organizado por tema.

**Leyenda impacto**: 🔥 alto · ⚡ medio · 💡 bajo
**Leyenda esfuerzo**: S (≤1 día) · M (2-4 días) · L (1+ sem)

Items marcados ✅ ya implementados (abril 2026).

---

## A. Onboarding y primeros momentos (3)

- ✅ **A.1** ⚡ S — Reconfigurar preferencias en Perfil (modal con intereses/radio/compañía).
- ✅ **A.2** ⚡ S — Demo mode con datos mock sin permisos/login (activado para guests sin resultados reales).
- ✅ **A.3** 💡 M — Coach-marks tooltips first-time (persistido AsyncStorage, dismissible).

## B. Home / Descubrimiento (9)

- ✅ **B.4** 🔥 M — Búsqueda texto + autocomplete (FTS Postgres `tsvector` stored + input debounced).
- ✅ **B.5** 🔥 M — Paginación infinite scroll (RPC `p_limit`/`p_offset` + `onEndReached`).
- ✅ **B.6** ⚡ S — Filtros persistidos entre sesiones (zustand persist AsyncStorage).
- ✅ **B.7** ⚡ S — Sección "Recién agregados" (hook `useRecientes`, order by created_at).
- ✅ **B.8** ⚡ M — Sección "Tendencias/Destacados" (RPC `lugares_top_favoritos`).
- ✅ **B.9** ⚡ M — Agrupación por tipo (tab Mapa filtra turístico/panorama; Explorar usa `tipos=['turistico']`).
- **B.10** 💡 M — Clima integrado (OpenWeather). Sugerencias indoor si llueve. **Pendiente: API key.**
- ✅ **B.11** ⚡ M — Tags emergentes (pet-friendly, LGBT+, accesible, apto bebés, wifi, estacionamiento, terraza, A/C, reservar antes, solo efectivo). Filtro en modal.
- ✅ **B.12** ⚡ S — Skeleton loaders (`SkeletonCard`, `SkeletonRow`).

## C. Detalle lugar (6)

- ✅ **C.13** 🔥 S — "Cómo llegar" con deep links Maps/Uber/Transantiago + Compartir.
- ✅ **C.14** ⚡ S — Tiempos estimados (caminando/bici/auto, cálculo aprox por distancia).
- ✅ **C.15** ⚡ S — Carrusel "Lugares similares" (`useLugaresSimilares` misma cat + cercanos).
- ✅ **C.16** ⚡ S — "Más del mismo creador" (`useLugaresCreador`).
- ✅ **C.17** ⚡ S — Filtrar reviews por recientes/mejores/N+ estrellas.
- **C.18** ⚡ M — Fotos en reviews (user-uploaded). **Pendiente schema `review_imagenes`.**

## D. Creación de contenido (9)

- ✅ **D.19** 🔥 S — Selector pin manual con mini-mapa (Leaflet web, react-native-maps mobile).
- ✅ **D.20** 🔥 M — Fotos múltiples + galería swipeable (tabla `lugar_imagenes`, hasta 5 fotos, upload multi).
- **D.21** ⚡ M — Horarios JSONB + badge "abierto ahora" + filtro. **Pendiente.**
- **D.22** 🔥 M — "Mis lugares" con estado (pendiente/aprobado/rechazado) + motivo. **Pendiente: reemplazar `moderado bool` por enum estado.**
- **D.23** ⚡ S — Preview antes de publicar (simula card).
- **D.24** ⚡ S — Borrador autosave AsyncStorage.
- **D.25** ⚡ S — Duplicar lugar.
- **D.26** ⚡ M — Importar desde URL Google Maps (parser link).
- **D.27** 💡 M — Plantillas por categoría (prompts sub-campos).

## E. Comunidad y reviews (5)

- **E.28** ⚡ S — "Útil" / likes en reviews.
- **E.29** ⚡ S — Dueño creador responde reviews.
- **E.30** ⚡ M — Perfil público de usuario.
- **E.31** 💡 L — Seguir usuarios + feed actividad.
- **E.32** 💡 M — Check-in con geo + badge.

## F. Reportes y moderación (3)

- **F.33** 🔥 M — Panel admin con flujo estados + motivo rechazo + notif creador.
- **F.34** ⚡ S — Reportar lugar/review.
- **F.35** 🔥 M — Rate limiting publicación + validaciones server-side.

## G. Engagement y retención (3)

- **G.36** 🔥 L — Push mobile (EAS) + web notifications.
- **G.37** ⚡ M — Email newsletter semanal (Supabase Edge + Resend).
- **G.38** ⚡ M — Referral con reward.

## H. Gamificación (2)

- **H.39** 💡 M — Badges contribución.
- **H.40** 💡 M — Leaderboard mensual top contribuidores.

## I. Performance y técnica (3)

- **I.41** 🔥 M — React Query + cache SWR.
- **I.42** ⚡ S — Imágenes responsive con params + blurhash.
- **I.43** ⚡ M — PWA service worker offline.

## J. Accesibilidad e internacionalización (3)

- **J.44** ⚡ M — A11y: VoiceOver/TalkBack + navegación teclado + tamaños dinámicos.
- **J.45** ⚡ M — Dark mode auto + toggle manual + design tokens.
- **J.46** ⚡ L — i18n español/inglés/portugués (react-i18next).

## K. Integraciones y datos (2)

- **K.47** 🔥 S — Sentry + PostHog (errores + funnels + flags + A/B).
- **K.48** ⚡ S — Deep links app + OG tags + sitemap web.

## L. Monetización y escalado (2)

- **L.49** 💡 L — Reservas + pagos (Stripe/MercadoPago + comisión).
- **L.50** 💡 L — Listados premium / sponsored con disclaimer.

---

## Status actual

**Implementado (abril 2026)**: A.1, A.2, A.3, B.4, B.5, B.6, B.7, B.8, B.9, B.11, B.12, C.13, C.14, C.15, C.16, C.17, D.19, D.20.

**18 items (36%)** completados. Plus re-architecture a plataforma turismo con 5 tabs + tabla `lugares` unificada.

**Próximos sprints sugeridos**

**Sprint 1 "Cerrar loop creador"**
- D.22 Mis lugares con estado
- F.33 Panel admin
- D.23 Preview antes publicar
- D.24 Borrador autosave

**Sprint 2 "Calidad contenido"**
- D.21 Horarios
- C.18 Fotos en reviews
- D.25 Duplicar
- D.26 Import Google Maps

**Sprint 3 "Retención"**
- G.36 Push
- G.38 Referral
- K.47 Sentry + PostHog
- K.48 Deep links + OG

**Sprint 4 "Performance + UX"**
- I.41 React Query
- I.42 Imágenes responsive
- J.44 A11y
- J.45 Dark mode

---

## Métricas a medir (con PostHog post K.47)

- Conversión onboarding completo → primera sesión
- CTR carousels vs "Ver todos"
- Bounce al login (al tap publicar)
- % usuarios que dejan review tras visitar detalle
- Tiempo hasta primer favorito
- Retención D1 / D7 / D30
- Ratio publicaciones aprobadas vs rechazadas
- Búsquedas sin resultados (mejorar seed contenido)
