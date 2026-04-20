-- 003_reviews.sql
-- Reviews + ratings de panoramas. Extiende RPCs con rating agregado.

-- ============================================================
-- 1. Tabla reviews
-- ============================================================

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  panorama_id uuid not null references public.panoramas(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comentario text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (panorama_id, user_id)
);

create index if not exists reviews_panorama_idx on public.reviews(panorama_id);
create index if not exists reviews_user_idx on public.reviews(user_id);

-- Trigger: updated_at
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists reviews_touch_updated_at on public.reviews;
create trigger reviews_touch_updated_at
  before update on public.reviews
  for each row execute function public.touch_updated_at();

-- ============================================================
-- 2. RLS reviews
-- ============================================================

alter table public.reviews enable row level security;

drop policy if exists "reviews_read_public" on public.reviews;
drop policy if exists "reviews_insert_own" on public.reviews;
drop policy if exists "reviews_update_own" on public.reviews;
drop policy if exists "reviews_delete_own" on public.reviews;

create policy "reviews_read_public" on public.reviews
  for select using (true);

create policy "reviews_insert_own" on public.reviews
  for insert to authenticated
  with check (user_id = auth.uid());

create policy "reviews_update_own" on public.reviews
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "reviews_delete_own" on public.reviews
  for delete to authenticated
  using (user_id = auth.uid());

-- ============================================================
-- 3. RPC panoramas_cerca extendido con rating
-- ============================================================

create or replace function public.panoramas_cerca(
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
  from public.panoramas p
  left join public.reviews r on r.panorama_id = p.id
  where st_dwithin(p.location, st_makepoint(lng, lat)::geography, radio_m)
    and (p.moderado = true or p.creado_por = auth.uid())
  group by p.id, p.location
  order by p.location <-> st_makepoint(lng, lat)::geography;
$$;

-- ============================================================
-- 4. RPC panoramas_top_favoritos extendido con rating
-- ============================================================

create or replace function public.panoramas_top_favoritos(
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
  from public.panoramas p
  left join public.favoritos f on f.panorama_id = p.id
  left join public.reviews r on r.panorama_id = p.id
  where st_dwithin(p.location, st_makepoint(lng, lat)::geography, radio_m)
    and (p.moderado = true or p.creado_por = auth.uid())
  group by p.id, p.location
  order by total_favoritos desc, distancia_m asc
  limit limite;
$$;
