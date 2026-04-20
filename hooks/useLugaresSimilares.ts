import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { CategoriaId, Lugar } from '@/lib/types';

/** C.15 — lugares misma categoría cercanos al dado */
export function useLugaresSimilares(lugar: Lugar | null, limite = 8) {
  const [similares, setSimilares] = useState<Lugar[]>([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!lugar) return;
    let cancelado = false;
    (async () => {
      setCargando(true);
      const { data, error } = await supabase.rpc('lugares_cerca', {
        lat: lugar.lat,
        lng: lugar.lng,
        radio_m: 20000,
        tipos: null,
        q: null,
        p_limit: limite + 1,
        p_offset: 0,
      });
      if (cancelado) return;
      if (error) console.warn('[similares]', error.message);
      const list = ((data ?? []) as Lugar[])
        .filter((l) => l.id !== lugar.id && l.categoria === lugar.categoria)
        .slice(0, limite);
      setSimilares(list);
      setCargando(false);
    })();
    return () => {
      cancelado = true;
    };
  }, [lugar?.id, lugar?.categoria, limite]);

  return { similares, cargando };
}
