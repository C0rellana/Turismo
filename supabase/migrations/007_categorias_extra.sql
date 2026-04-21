-- 007_categorias_extra.sql
-- Añade categorías: musica, bienestar, compras, eco

alter table public.lugares drop constraint if exists lugares_categoria_check;
alter table public.lugares drop constraint if exists panoramas_categoria_check;

alter table public.lugares
  add constraint lugares_categoria_check check (categoria in (
    'gastronomia', 'aire_libre', 'cultura', 'nocturno',
    'familiar', 'deporte', 'musica', 'bienestar', 'compras', 'eco'
  ));
