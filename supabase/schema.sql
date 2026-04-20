-- ============================================================
-- magical-planet / Panoramas Cerca — SCHEMA CONSOLIDADO
-- Ejecutar en Supabase SQL Editor (tras reset si aplica).
-- Orden: extensions → tablas → triggers → RPCs → RLS.
-- ============================================================

create extension if not exists postgis;

-- ============================================================
-- 1. Tablas
-- ============================================================

create table if not exists panoramas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  categoria text not null check (categoria in
    ('gastronomia', 'aire_libre', 'cultura', 'nocturno', 'familiar', 'deporte')),
  precio_nivel smallint not null default 1 check (precio_nivel between 0 and 3),
  direccion text,
  location geography(point, 4326) not null,
  imagen_url text,
  creado_por uuid references auth.users(id) on delete set null,
  moderado boolean not null default false,
  created_at timestamptz default now()
);

create index if not exists panoramas_location_idx on panoramas using gist (location);
create index if not exists panoramas_categoria_idx on panoramas (categoria);
create index if not exists panoramas_creado_por_idx on panoramas(creado_por);

create table if not exists favoritos (
  user_id uuid not null references auth.users(id) on delete cascade,
  panorama_id uuid not null references panoramas(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, panorama_id)
);

create index if not exists favoritos_user_idx on favoritos(user_id);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  panorama_id uuid not null references panoramas(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comentario text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (panorama_id, user_id)
);

create index if not exists reviews_panorama_idx on reviews(panorama_id);
create index if not exists reviews_user_idx on reviews(user_id);

-- ============================================================
-- 2. Triggers
-- ============================================================

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists reviews_touch_updated_at on reviews;
create trigger reviews_touch_updated_at
  before update on reviews
  for each row execute function public.touch_updated_at();

-- ============================================================
-- 3. RPCs
-- ============================================================

create or replace function panoramas_cerca(
  lat double precision,
  lng double precision,
  radio_m int default 10000
) returns table (
  id uuid,
  nombre text,
  descripcion text,
  categoria text,
  precio_nivel smallint,
  direccion text,
  imagen_url text,
  lat double precision,
  lng double precision,
  distancia_m double precision,
  rating_promedio numeric,
  total_reviews bigint
) language sql stable security invoker as $$
  select
    p.id, p.nombre, p.descripcion, p.categoria, p.precio_nivel,
    p.direccion, p.imagen_url,
    st_y(p.location::geometry) as lat,
    st_x(p.location::geometry) as lng,
    st_distance(p.location, st_makepoint(lng, lat)::geography) as distancia_m,
    coalesce(round(avg(r.rating)::numeric, 1), 0) as rating_promedio,
    coalesce(count(r.id), 0) as total_reviews
  from panoramas p
  left join reviews r on r.panorama_id = p.id
  where st_dwithin(p.location, st_makepoint(lng, lat)::geography, radio_m)
    and (p.moderado = true or p.creado_por = auth.uid())
  group by p.id, p.location
  order by p.location <-> st_makepoint(lng, lat)::geography;
$$;

create or replace function panoramas_top_favoritos(
  lat double precision,
  lng double precision,
  radio_m int default 50000,
  limite int default 10
) returns table (
  id uuid,
  nombre text,
  descripcion text,
  categoria text,
  precio_nivel smallint,
  direccion text,
  imagen_url text,
  lat double precision,
  lng double precision,
  distancia_m double precision,
  total_favoritos bigint,
  rating_promedio numeric,
  total_reviews bigint
) language sql stable security invoker as $$
  select
    p.id, p.nombre, p.descripcion, p.categoria, p.precio_nivel,
    p.direccion, p.imagen_url,
    st_y(p.location::geometry) as lat,
    st_x(p.location::geometry) as lng,
    st_distance(p.location, st_makepoint(lng, lat)::geography) as distancia_m,
    coalesce(count(distinct f.panorama_id), 0) as total_favoritos,
    coalesce(round(avg(r.rating)::numeric, 1), 0) as rating_promedio,
    coalesce(count(distinct r.id), 0) as total_reviews
  from panoramas p
  left join favoritos f on f.panorama_id = p.id
  left join reviews r on r.panorama_id = p.id
  where st_dwithin(p.location, st_makepoint(lng, lat)::geography, radio_m)
    and (p.moderado = true or p.creado_por = auth.uid())
  group by p.id, p.location
  order by total_favoritos desc, distancia_m asc
  limit limite;
$$;

-- ============================================================
-- 4. RLS: panoramas
-- ============================================================

alter table panoramas enable row level security;

drop policy if exists "panoramas_read_public" on panoramas;
drop policy if exists "panoramas_read_anon" on panoramas;
drop policy if exists "panoramas_read_auth" on panoramas;
drop policy if exists "panoramas_insert_auth" on panoramas;
drop policy if exists "panoramas_update_own" on panoramas;
drop policy if exists "panoramas_delete_own" on panoramas;

create policy "panoramas_read_anon" on panoramas
  for select to anon
  using (moderado = true);

create policy "panoramas_read_auth" on panoramas
  for select to authenticated
  using (moderado = true or creado_por = auth.uid());

create policy "panoramas_insert_auth" on panoramas
  for insert to authenticated
  with check (creado_por = auth.uid() and moderado = false);

create policy "panoramas_update_own" on panoramas
  for update to authenticated
  using (creado_por = auth.uid() and moderado = false)
  with check (creado_por = auth.uid() and moderado = false);

create policy "panoramas_delete_own" on panoramas
  for delete to authenticated
  using (creado_por = auth.uid() and moderado = false);

-- ============================================================
-- 5. RLS: favoritos
-- ============================================================

alter table favoritos enable row level security;

drop policy if exists "favoritos_own" on favoritos;
create policy "favoritos_own" on favoritos
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ============================================================
-- 6. RLS: reviews
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
