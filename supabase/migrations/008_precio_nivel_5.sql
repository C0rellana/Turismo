-- 008_precio_nivel_5.sql
-- Expande precio_nivel de 0-3 a 0-4 para cubrir rango monetario real CLP.
-- 0 = Gratis, 1 = ~$10.000, 2 = ~$30.000, 3 = ~$50.000, 4 = +$100.000

alter table public.lugares drop constraint if exists lugares_precio_nivel_check;
alter table public.lugares drop constraint if exists panoramas_precio_nivel_check;

alter table public.lugares
  add constraint lugares_precio_nivel_check check (precio_nivel between 0 and 4);
