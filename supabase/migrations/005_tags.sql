-- 005_tags.sql — Tags emergentes (B.11)
-- Agrega column `tags text[]` a lugares para filtros como pet-friendly,
-- LGBT+, accesible silla ruedas, apto bebés, wifi, etc.

alter table public.lugares
  add column if not exists tags text[] not null default '{}';

create index if not exists lugares_tags_idx on public.lugares using gin (tags);

-- Ejemplo de uso:
-- SELECT * FROM lugares WHERE 'pet-friendly' = any(tags);
-- UPDATE lugares SET tags = array_append(tags, 'wifi') WHERE id = '...';

-- Tags sugeridos (documentación, no es enum rígido):
--   pet-friendly, lgbt-friendly, accesible-silla-ruedas,
--   apto-bebes, wifi-gratis, estacionamiento, aire-acondicionado,
--   reservar-antes, solo-efectivo, terraza
