-- 002_publish_and_users.sql
-- Agrega soporte de usuarios, publicación de panoramas y favoritos sincronizados.
-- Ejecutar en Supabase SQL Editor.

-- ============================================================
-- 1. Extender tabla panoramas
-- ============================================================

alter table public.panoramas
  add column if not exists creado_por uuid references auth.users(id) on delete set null,
  add column if not exists moderado boolean not null default false;

create index if not exists panoramas_creado_por_idx on public.panoramas(creado_por);

-- Marcar panoramas seed existentes como moderados (son datos iniciales curados)
update public.panoramas set moderado = true where moderado = false and creado_por is null;

-- ============================================================
-- 2. RLS panoramas: reemplazar políticas
-- ============================================================

drop policy if exists "panoramas_read_public" on public.panoramas;
drop policy if exists "panoramas_read_anon" on public.panoramas;
drop policy if exists "panoramas_read_auth" on public.panoramas;
drop policy if exists "panoramas_insert_auth" on public.panoramas;
drop policy if exists "panoramas_update_own" on public.panoramas;
drop policy if exists "panoramas_delete_own" on public.panoramas;

-- Anon: sólo moderados
create policy "panoramas_read_anon" on public.panoramas
  for select to anon
  using (moderado = true);

-- Auth: moderados + propios (aunque no moderados)
create policy "panoramas_read_auth" on public.panoramas
  for select to authenticated
  using (moderado = true or creado_por = auth.uid());

-- Auth: insertar como propios, no moderados
create policy "panoramas_insert_auth" on public.panoramas
  for insert to authenticated
  with check (creado_por = auth.uid() and moderado = false);

-- Auth: actualizar sólo propios no moderados
create policy "panoramas_update_own" on public.panoramas
  for update to authenticated
  using (creado_por = auth.uid() and moderado = false)
  with check (creado_por = auth.uid() and moderado = false);

-- Auth: borrar sólo propios no moderados
create policy "panoramas_delete_own" on public.panoramas
  for delete to authenticated
  using (creado_por = auth.uid() and moderado = false);

-- ============================================================
-- 3. RPC panoramas_cerca: respetar moderación
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
  distancia_m double precision
) language sql stable security invoker as $$
  select
    p.id,
    p.nombre,
    p.descripcion,
    p.categoria,
    p.precio_nivel,
    p.direccion,
    p.imagen_url,
    st_y(p.location::geometry) as lat,
    st_x(p.location::geometry) as lng,
    st_distance(p.location, st_makepoint(lng, lat)::geography) as distancia_m
  from public.panoramas p
  where st_dwithin(p.location, st_makepoint(lng, lat)::geography, radio_m)
    and (p.moderado = true or p.creado_por = auth.uid())
  order by p.location <-> st_makepoint(lng, lat)::geography;
$$;

-- ============================================================
-- 4. Tabla favoritos sincronizados
-- ============================================================

create table if not exists public.favoritos (
  user_id uuid not null references auth.users(id) on delete cascade,
  panorama_id uuid not null references public.panoramas(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, panorama_id)
);

create index if not exists favoritos_user_idx on public.favoritos(user_id);

alter table public.favoritos enable row level security;

drop policy if exists "favoritos_own" on public.favoritos;
create policy "favoritos_own" on public.favoritos
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ============================================================
-- 5. RPC: top favoritos entre usuarios (cerca de una ubicación)
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
  total_favoritos bigint
) language sql stable security invoker as $$
  select
    p.id,
    p.nombre,
    p.descripcion,
    p.categoria,
    p.precio_nivel,
    p.direccion,
    p.imagen_url,
    st_y(p.location::geometry) as lat,
    st_x(p.location::geometry) as lng,
    st_distance(p.location, st_makepoint(lng, lat)::geography) as distancia_m,
    coalesce(count(f.panorama_id), 0) as total_favoritos
  from public.panoramas p
  left join public.favoritos f on f.panorama_id = p.id
  where st_dwithin(p.location, st_makepoint(lng, lat)::geography, radio_m)
    and (p.moderado = true or p.creado_por = auth.uid())
  group by p.id, p.nombre, p.descripcion, p.categoria, p.precio_nivel,
           p.direccion, p.imagen_url, p.location
  order by total_favoritos desc, distancia_m asc
  limit limite;
$$;

-- ============================================================
-- 6. Storage bucket para imágenes
-- ============================================================
-- NOTA: Crear manualmente en Supabase Dashboard → Storage:
--   Bucket: 'panoramas-imagenes' (público)
--   Policy INSERT: authenticated
--   Policy SELECT: public
