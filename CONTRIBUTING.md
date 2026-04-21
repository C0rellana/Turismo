# Contribuir a magical-planet

Guía breve para colaboradores nuevos.

## Flujo de trabajo recomendado

1. Leer [CLAUDE.md](CLAUDE.md) — contexto técnico completo
2. Leer [SETUP.md](SETUP.md) — onboarding + credenciales
3. Revisar [MEJORAS.md](MEJORAS.md) — elegir item del roadmap
4. Branch: `feature/<item>` desde `main`
5. Implementar + tipar + testear local
6. MR (GitLab) con descripción del cambio

## Estándares

### Código
- **TypeScript strict**. `npx tsc --noEmit` limpio antes de commit
- **Español** en UI + identifiers (`useNearbyLugares`, `CrearLugar`)
- **Expo typed-routes**: rutas nuevas necesitan `as any` hasta regen
- **Theme tokens**: usar `constants/theme.ts` para colores/fonts, no hard-coded
- **StyleSheet co-ubicado**, no styled-components

### Commits
Convención: `<tipo>: <resumen>` en español, imperativo:
```
feat: agregar panel admin moderación
fix: mapa no renderiza markers tras reload
refactor: extraer CategoryTabs de Explorar
docs: actualizar SETUP.md con OAuth Google
```

Tipos: `feat`, `fix`, `refactor`, `docs`, `style`, `chore`, `test`.

### Branch naming
- `feature/d22-mis-lugares-estado`
- `fix/mapa-clustering`
- `refactor/usereviews-react-query`

## Trabajar con IA (Claude Code / similar)

El repo está preparado para colaboración con IA:
- `CLAUDE.md` — contexto persistente
- `.claude/settings.json` — permisos pre-aprobados
- `.claude/mcp.json.example` — MCP servers Supabase + Vercel + Postgres
- Scripts en `scripts/` — automatización común

Para setup IA:
```bash
# Instalar Claude Code (o usar Cursor / similar)
npm install -g @anthropic-ai/claude-code

# En el repo
claude
```

Claude lee `CLAUDE.md` automáticamente y tiene acceso a todos los scripts.

### Prompts útiles para IA

- "Implementa D.22 Mis lugares con estado" (toma item de MEJORAS.md)
- "Corre migrations en la DB dev" → usa `./scripts/migrate.sh`
- "Deploy a preview" → `./scripts/deploy.sh --preview`
- "Agrega tests para useNearbyLugares"
- "Muéstrame los reportes pendientes" → query Postgres MCP

## Tareas que requieren acción manual (NO automatizables)

- **Google OAuth**: crear credentials en Cloud Console (web UI)
- **Supabase Auth Providers**: habilitar Google manual en dashboard
- **Publicar a App Store / Play Store**: EAS Build + review Apple/Google
- **Asignar rol admin a primer usuario**: SQL `UPDATE user_profiles`

## Pitfalls conocidos

Ver sección "Pitfalls" en [CLAUDE.md](CLAUDE.md).

## Preguntas

Abrir issue en GitLab con label `question`.
