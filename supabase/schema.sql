-- ============================================================
-- magical-planet — SCHEMA CONSOLIDADO (plataforma turismo)
-- Incluye: lugares + tipos + favoritos + reviews + fotos + FTS + RPCs
-- Ejecutar en Supabase SQL Editor (tras reset si aplica).
-- ============================================================

create extension if not exists postgis;

-- ============================================================
-- 1. Enum tipo_lugar
-- ============================================================

do $$ begin
  create type tipo_lugar as enum ('turistico', 'panorama');
exception when duplicate_object then null; end $$;

-- ============================================================
-- 2. Tabla lugares
-- ============================================================

create table if not exists lugares (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  categoria text not null check (categoria in
    ('gastronomia', 'aire_libre', 'cultura', 'nocturno', 'familiar', 'deporte')),
  tipo tipo_lugar not null default 'panorama',
  precio_nivel smallint not null default 1 check (precio_nivel between 0 and 3),
  direccion text,
  location geography(point, 4326) not null,
  imagen_url text,
  fecha_inicio timestamptz,
  fecha_fin timestamptz,
  recurrente boolean not null default false,
  tags text[] not null default '{}',
  creado_por uuid references auth.users(id) on delete set null,
  moderado boolean not null default false,
  created_at timestamptz default now(),
  busqueda_tsv tsvector generated always as (
    setweight(to_tsvector('spanish', coalesce(nombre, '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(descripcion, '')), 'B') ||
    setweight(to_tsvector('spanish', coalesce(direccion, '')), 'C')
  ) stored
);

create index if not exists lugares_location_idx on lugares using gist (location);
create index if not exists lugares_categoria_idx on lugares (categoria);
create index if not exists lugares_tipo_idx on lugares (tipo);
create index if not exists lugares_creado_por_idx on lugares (creado_por);
create index if not exists lugares_fecha_inicio_idx on lugares (fecha_inicio)
  where fecha_inicio is not null;
create index if not exists lugares_busqueda_idx on lugares using gin (busqueda_tsv);
create index if not exists lugares_tags_idx on lugares using gin (tags);

-- ============================================================
-- 3. Tabla favoritos
-- ============================================================

create table if not exists favoritos (
  user_id uuid not null references auth.users(id) on delete cascade,
  lugar_id uuid not null references lugares(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, lugar_id)
);

create index if not exists favoritos_user_idx on favoritos(user_id);

-- ============================================================
-- 4. Tabla reviews
-- ============================================================

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  lugar_id uuid not null references lugares(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comentario text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lugar_id, user_id)
);

create index if not exists reviews_lugar_idx on reviews(lugar_id);
create index if not exists reviews_user_idx on reviews(user_id);

-- ============================================================
-- 5. Tabla lugar_imagenes (fotos múltiples)
-- ============================================================

create table if not exists lugar_imagenes (
  id uuid primary key default gen_random_uuid(),
  lugar_id uuid not null references lugares(id) on delete cascade,
  url text not null,
  orden smallint not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists lugar_imagenes_lugar_idx on lugar_imagenes(lugar_id);

-- ============================================================
-- 6. Triggers
-- ============================================================

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists reviews_touch_updated_at on reviews;
create trigger reviews_touch_updated_at
  before update on reviews
  for each row execute function public.touch_updated_at();

-- ============================================================
-- 7. RPC lugares_cerca (con tipos, búsqueda, paginación)
-- ============================================================

create or replace function lugares_cerca(
  lat double precision,
  lng double precision,
  radio_m int default 10000,
  tipos tipo_lugar[] default null,
  q text default null,
  p_limit int default 50,
  p_offset int default 0
) returns table (
  id uuid, nombre text, descripcion text, categoria text,
  tipo tipo_lugar, precio_nivel smallint, direccion text,
  imagen_url text, fecha_inicio timestamptz, fecha_fin timestamptz,
  lat double precision, lng double precision,
  distancia_m double precision,
  rating_promedio numeric, total_reviews bigint
) language sql stable security invoker as $$
  select
    l.id, l.nombre, l.descripcion, l.categoria, l.tipo, l.precio_nivel,
    l.direccion, l.imagen_url, l.fecha_inicio, l.fecha_fin,
    st_y(l.location::geometry) as lat,
    st_x(l.location::geometry) as lng,
    st_distance(l.location, st_makepoint(lng, lat)::geography) as distancia_m,
    coalesce(round(avg(r.rating)::numeric, 1), 0) as rating_promedio,
    coalesce(count(r.id), 0) as total_reviews
  from lugares l
  left join reviews r on r.lugar_id = l.id
  where st_dwithin(l.location, st_makepoint(lng, lat)::geography, radio_m)
    and (l.moderado = true or l.creado_por = auth.uid())
    and (tipos is null or l.tipo = any(tipos))
    and (q is null or l.busqueda_tsv @@ websearch_to_tsquery('spanish', q))
    and (l.tipo != 'panorama' or l.fecha_fin is null or l.fecha_fin >= now() or l.recurrente = true)
  group by l.id, l.location
  order by
    case when q is not null then ts_rank(l.busqueda_tsv, websearch_to_tsquery('spanish', q)) end desc nulls last,
    l.location <-> st_makepoint(lng, lat)::geography
  limit p_limit
  offset p_offset;
$$;

-- ============================================================
-- 8. RPC lugares_top_favoritos
-- ============================================================

create or replace function lugares_top_favoritos(
  lat double precision,
  lng double precision,
  radio_m int default 50000,
  limite int default 10,
  tipos tipo_lugar[] default null
) returns table (
  id uuid, nombre text, descripcion text, categoria text,
  tipo tipo_lugar, precio_nivel smallint, direccion text,
  imagen_url text, fecha_inicio timestamptz, fecha_fin timestamptz,
  lat double precision, lng double precision,
  distancia_m double precision,
  total_favoritos bigint,
  rating_promedio numeric, total_reviews bigint
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
  from lugares l
  left join favoritos f on f.lugar_id = l.id
  left join reviews r on r.lugar_id = l.id
  where st_dwithin(l.location, st_makepoint(lng, lat)::geography, radio_m)
    and (l.moderado = true or l.creado_por = auth.uid())
    and (tipos is null or l.tipo = any(tipos))
  group by l.id, l.location
  order by total_favoritos desc, distancia_m asc
  limit limite;
$$;

-- ============================================================
-- 9. RPC panoramas_proximos (eventos con fecha)
-- ============================================================

create or replace function panoramas_proximos(
  lat double precision,
  lng double precision,
  radio_m int default 100000,
  dias int default 30,
  p_limit int default 20
) returns table (
  id uuid, nombre text, descripcion text, categoria text,
  precio_nivel smallint, direccion text, imagen_url text,
  fecha_inicio timestamptz, fecha_fin timestamptz,
  lat double precision, lng double precision, distancia_m double precision
) language sql stable security invoker as $$
  select
    l.id, l.nombre, l.descripcion, l.categoria, l.precio_nivel,
    l.direccion, l.imagen_url, l.fecha_inicio, l.fecha_fin,
    st_y(l.location::geometry) as lat,
    st_x(l.location::geometry) as lng,
    st_distance(l.location, st_makepoint(lng, lat)::geography) as distancia_m
  from lugares l
  where l.tipo = 'panorama'
    and l.fecha_inicio is not null
    and l.fecha_inicio >= now()
    and l.fecha_inicio <= now() + (dias || ' days')::interval
    and st_dwithin(l.location, st_makepoint(lng, lat)::geography, radio_m)
    and (l.moderado = true or l.creado_por = auth.uid())
  order by l.fecha_inicio asc
  limit p_limit;
$$;

-- ============================================================
-- 10. RLS: lugares
-- ============================================================

alter table lugares enable row level security;

drop policy if exists "lugares_read_anon" on lugares;
drop policy if exists "lugares_read_auth" on lugares;
drop policy if exists "lugares_insert_auth" on lugares;
drop policy if exists "lugares_update_own" on lugares;
drop policy if exists "lugares_delete_own" on lugares;

create policy "lugares_read_anon" on lugares
  for select to anon
  using (moderado = true);

create policy "lugares_read_auth" on lugares
  for select to authenticated
  using (moderado = true or creado_por = auth.uid());

create policy "lugares_insert_auth" on lugares
  for insert to authenticated
  with check (creado_por = auth.uid() and moderado = false);

create policy "lugares_update_own" on lugares
  for update to authenticated
  using (creado_por = auth.uid() and moderado = false)
  with check (creado_por = auth.uid() and moderado = false);

create policy "lugares_delete_own" on lugares
  for delete to authenticated
  using (creado_por = auth.uid() and moderado = false);

-- ============================================================
-- 11. RLS: favoritos
-- ============================================================

alter table favoritos enable row level security;

drop policy if exists "favoritos_own" on favoritos;
create policy "favoritos_own" on favoritos
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ============================================================
-- 12. RLS: reviews
-- ============================================================

alter table reviews enable row level security;

drop policy if exists "reviews_read_public" on reviews;
drop policy if exists "reviews_insert_own" on reviews;
drop policy if exists "reviews_update_own" on reviews;
drop policy if exists "reviews_delete_own" on reviews;

create policy "reviews_read_public" on reviews
  for select using (true);

create policy "reviews_insert_own" on reviews
  for insert to authenticated
  with check (user_id = auth.uid());

create policy "reviews_update_own" on reviews
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "reviews_delete_own" on reviews
  for delete to authenticated
  using (user_id = auth.uid());

-- ============================================================
-- 13. RLS: lugar_imagenes
-- ============================================================

alter table lugar_imagenes enable row level security;

drop policy if exists "lugar_imagenes_read_public" on lugar_imagenes;
drop policy if exists "lugar_imagenes_insert_own" on lugar_imagenes;
drop policy if exists "lugar_imagenes_delete_own" on lugar_imagenes;

create policy "lugar_imagenes_read_public" on lugar_imagenes
  for select using (true);

create policy "lugar_imagenes_insert_own" on lugar_imagenes
  for insert to authenticated
  with check (
    exists (select 1 from lugares l
            where l.id = lugar_imagenes.lugar_id and l.creado_por = auth.uid())
  );

create policy "lugar_imagenes_delete_own" on lugar_imagenes
  for delete to authenticated
  using (
    exists (select 1 from lugares l
            where l.id = lugar_imagenes.lugar_id and l.creado_por = auth.uid())
  );
