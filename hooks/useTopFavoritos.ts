import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Panorama } from '@/lib/types';
import { useLocationStore } from '@/stores/useLocationStore';

type TopPanorama = Panorama & { total_favoritos: number };

export function useTopFavoritos(limite = 10) {
  const ubicacion = useLocationStore((s) => s.ubicacion);
  const [panoramas, setPanoramas] = useState<TopPanorama[]>([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!ubicacion) return;
    let cancelado = false;

    (async () => {
      setCargando(true);
      const { data, error } = await supabase.rpc('panoramas_top_favoritos', {
        lat: ubicacion.lat,
        lng: ubicacion.lng,
        radio_m: 50000,
        limite,
      });
      if (cancelado) return;
      if (error) {
        console.warn('[top-favs]', error.message);
        setPanoramas([]);
      } else {
        setPanoramas((data ?? []) as TopPanorama[]);
      }
      setCargando(false);
    })();

    return () => {
      cancelado = true;
    };
  }, [ubicacion, limite]);

  return { panoramas, cargando };
}
