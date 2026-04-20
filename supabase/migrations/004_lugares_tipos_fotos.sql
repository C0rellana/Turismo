-- 004_lugares_tipos_fotos.sql
-- Re-architecture: panoramas → lugares con enum tipo, fechas evento,
-- fotos múltiples, full-text search.
-- Ejecutar DESPUÉS de 001-003.

-- ============================================================
-- 1. Enum tipo_lugar
-- ============================================================

do $$ begin
  create type tipo_lugar as enum ('turistico', 'panorama');
exception when duplicate_object then null; end $$;

-- ============================================================
-- 2. Rename + columnas nuevas
-- ============================================================

alter table if exists public.panoramas rename to lugares;

alter table public.lugares
  add column if not exists tipo tipo_lugar not null default 'panorama',
  add column if not exists fecha_inicio timestamptz,
  add column if not exists fecha_fin timestamptz,
  add column if not exists recurrente boolean not null default false;

create index if not exists lugares_tipo_idx on public.lugares(tipo);
create index if not exists lugares_fecha_inicio_idx on public.lugares(fecha_inicio)
  where fecha_inicio is not null;

-- Marcar como turísticos: lugares con categoria cultura, aire_libre, sin fecha
update public.lugares
set tipo = 'turistico'
where categoria in ('cultura', 'aire_libre', 'gastronomia')
  and fecha_inicio is null
  and tipo = 'panorama';

-- ============================================================
-- 3. Rename FKs en tablas relacionadas
-- ============================================================

do $$ begin
  alter table public.favoritos rename column panorama_id to lugar_id;
exception when undefined_column then null; end $$;

do $$ begin
  alter table public.reviews rename column panorama_id to lugar_id;
exception when undefined_column then null; end $$;

-- ============================================================
-- 4. Tabla fotos múltiples (D.20)
-- ============================================================

create table if not exists public.lugar_imagenes (
  id uuid primary key default gen_random_uuid(),
  lugar_id uuid not null references public.lugares(id) on delete cascade,
  url text not null,
  orden smallint not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists lugar_imagenes_lugar_idx on public.lugar_imagenes(lugar_id);

alter table public.lugar_imagenes enable row level security;

drop policy if exists "lugar_imagenes_read_public" on public.lugar_imagenes;
drop policy if exists "lugar_imagenes_insert_own" on public.lugar_imagenes;
drop policy if exists "lugar_imagenes_delete_own" on public.lugar_imagenes;

create policy "lugar_imagenes_read_public" on public.lugar_imagenes
  for select using (true);

create policy "lugar_imagenes_insert_own" on public.lugar_imagenes
  for insert to authenticated
  with check (
    exists (select 1 from public.lugares l
            where l.id = lugar_imagenes.lugar_id and l.creado_por = auth.uid())
  );

create policy "lugar_imagenes_delete_own" on public.lugar_imagenes
  for delete to authenticated
  using (
    exists (select 1 from public.lugares l
            where l.id = lugar_imagenes.lugar_id and l.creado_por = auth.uid())
  );

-- Migrar imagen_url a lugar_imagenes (1 foto por lugar existente)
insert into public.lugar_imagenes (lugar_id, url, orden)
select id, imagen_url, 0
from public.lugares
where imagen_url is not null
  and not exists (
    select 1 from public.lugar_imagenes li where li.lugar_id = lugares.id
  );

-- ============================================================
-- 5. Full-text search (B.4)
-- ============================================================

alter table public.lugares
  add column if not exists busqueda_tsv tsvector
  generated always as (
    setweight(to_tsvector('spanish', coalesce(nombre, '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(descripcion, '')), 'B') ||
    setweight(to_tsvector('spanish', coalesce(direccion, '')), 'C')
  ) stored;

create index if not exists lugares_busqueda_idx on public.lugares
  using gin(busqueda_tsv);

-- ============================================================
-- 6. RPCs: lugares_cerca + paginación + tipos + busqueda
-- ============================================================

drop function if exists public.panoramas_cerca cascade;
drop function if exists public.lugares_cerca cascade;

create or replace function public.lugares_cerca(
  lat double precision,
  lng double precision,
  radio_m int default 10000,
  tipos tipo_lugar[] default null,
  q text default null,
  p_limit int default 50,
  p_offset int default 0
) returns table (
  id uuid,
  nombre text,
  descripcion text,
  categoria text,
  tipo tipo_lugar,
  precio_nivel smallint,
  direccion text,
  imagen_url text,
  fecha_inicio timestamptz,
  fecha_fin timestamptz,
  lat double precision,
  lng double precision,
  distancia_m double precision,
  rating_promedio numeric,
  total_reviews bigint
) language sql stable security invoker as $$
  select
    l.id, l.nombre, l.descripcion, l.categoria, l.tipo, l.precio_nivel,
    l.direccion, l.imagen_url, l.fecha_inicio, l.fecha_fin,
    st_y(l.location::geometry) as lat,
    st_x(l.location::geometry) as lng,
    st_distance(l.location, st_makepoint(lng, lat)::geography) as distancia_m,
    coalesce(round(avg(r.rating)::numeric, 1), 0) as rating_promedio,
    coalesce(count(r.id), 0) as total_reviews
  from public.lugares l
  left join public.reviews r on r.lugar_id = l.id
  where st_dwithin(l.location, st_makepoint(lng, lat)::geography, radio_m)
    and (l.moderado = true or l.creado_por = auth.uid())
    and (tipos is null or l.tipo = any(tipos))
    and (q is null or l.busqueda_tsv @@ websearch_to_tsquery('spanish', q))
    -- Panoramas (eventos): filtrar vigentes solo si tipo=panorama
    and (l.tipo != 'panorama' or l.fecha_fin is null or l.fecha_fin >= now() or l.recurrente = true)
  group by l.id, l.location
  order by
    case when q is not null then ts_rank(l.busqueda_tsv, websearch_to_tsquery('spanish', q)) end desc nulls last,
    l.location <-> st_makepoint(lng, lat)::geography
  limit p_limit
  offset p_offset;
$$;

-- ============================================================
-- 7. RPC panoramas_top_favoritos actualizado a lugares
-- ============================================================

drop function if exists public.panoramas_top_favoritos cascade;
drop function if exists public.lugares_top_favoritos cascade;

create or replace function public.lugares_top_favoritos(
  lat double precision,
  lng double precision,
  radio_m int default 50000,
  limite int default 10,
  tipos tipo_lugar[] default null
) returns table (
  id uuid,
  nombre text,
  descripcion text,
  categoria text,
  tipo tipo_lugar,
  precio_nivel smallint,
  direccion text,
  imagen_url text,
  fecha_inicio timestamptz,
  fecha_fin timestamptz,
  lat double precision,
  lng double precision,
  distancia_m double precision,
  total_favoritos bigint,
  rating_promedio numeric,
  total_reviews bigint
) language sql stable security invoker as $$
  select
    l.id, l.nombre, l.descripcion, l.categoria, l.tipo, l.precio_nivel,
    l.direccion, l.imagen_url, l.fecha_inicio, l.fecha_fin,
    st_y(l.location::geometry) as lat,
    st_x(l.location::geometry) as lng,
    st_distance(l.location, st_makepoint(lng, lat)::geography) as distancia_m,
    coalesce(count(distinct f.lugar_id), 0) as total_favoritos,
    coalesce(round(avg(r.rating)::numeric, 1), 0) as rating_promedio,
    coalesce(count(distinct r.id), 0) as total_reviews
  from public.lugares l
  left join public.favoritos f on f.lugar_id = l.id
  left join public.reviews r on r.lugar_id = l.id
  where st_dwithin(l.location, st_makepoint(lng, lat)::geography, radio_m)
    and (l.moderado = true or l.creado_por = auth.uid())
    and (tipos is null or l.tipo = any(tipos))
  group by l.id, l.location
  order by total_favoritos desc, distancia_m asc
  limit limite;
$$;

-- ============================================================
-- 8. RPC nueva: panoramas próximos (eventos con fecha)
-- ============================================================

create or replace function public.panoramas_proximos(
  lat double precision,
  lng double precision,
  radio_m int default 100000,
  dias int default 30,
  p_limit int default 20
) returns table (
  id uuid,
  nombre text,
  descripcion text,
  categoria text,
  precio_nivel smallint,
  direccion text,
  imagen_url text,
  fecha_inicio timestamptz,
  fecha_fin timestamptz,
  lat double precision,
  lng double precision,
  distancia_m double precision
) language sql stable security invoker as $$
  select
    l.id, l.nombre, l.descripcion, l.categoria, l.precio_nivel,
    l.direccion, l.imagen_url, l.fecha_inicio, l.fecha_fin,
    st_y(l.location::geometry) as lat,
    st_x(l.location::geometry) as lng,
    st_distance(l.location, st_makepoint(lng, lat)::geography) as distancia_m
  from public.lugares l
  where l.tipo = 'panorama'
    and l.fecha_inicio is not null
    and l.fecha_inicio >= now()
    and l.fecha_inicio <= now() + (dias || ' days')::interval
    and st_dwithin(l.location, st_makepoint(lng, lat)::geography, radio_m)
    and (l.moderado = true or l.creado_por = auth.uid())
  order by l.fecha_inicio asc
  limit p_limit;
$$;
