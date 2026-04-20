import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Lugar, TipoLugar } from '@/lib/types';
import { useLocationStore } from '@/stores/useLocationStore';

type TopLugar = Lugar & { total_favoritos: number };

export function useTopFavoritos(limite = 10, tipos?: TipoLugar[]) {
  const ubicacion = useLocationStore((s) => s.ubicacion);
  const [lugares, setLugares] = useState<TopLugar[]>([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!ubicacion) return;
    let cancelado = false;

    (async () => {
      setCargando(true);
      const { data, error } = await supabase.rpc('lugares_top_favoritos', {
        lat: ubicacion.lat,
        lng: ubicacion.lng,
        radio_m: 50000,
        limite,
        tipos: tipos && tipos.length > 0 ? tipos : null,
      });
      if (cancelado) return;
      if (error) {
        console.warn('[top-favs]', error.message);
        setLugares([]);
      } else {
        setLugares((data ?? []) as TopLugar[]);
      }
      setCargando(false);
    })();

    return () => {
      cancelado = true;
    };
  }, [ubicacion, limite, tipos?.join(',')]);

  return { lugares, cargando, panoramas: lugares };
}
