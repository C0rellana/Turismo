import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Lugar, TipoLugar } from '@/lib/types';

/**
 * Lugares agregados recientemente (B.7).
 * Consulta directa a tabla con order by created_at.
 */
export function useRecientes(limite = 10, tipos?: TipoLugar[]) {
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    let cancelado = false;
    (async () => {
      setCargando(true);
      let query = supabase
        .from('lugares')
        .select('id, nombre, descripcion, categoria, tipo, precio_nivel, direccion, imagen_url, fecha_inicio, fecha_fin')
        .eq('moderado', true)
        .order('created_at', { ascending: false })
        .limit(limite);
      if (tipos && tipos.length > 0) query = query.in('tipo', tipos);
      const { data, error } = await query;
      if (cancelado) return;
      if (error) console.warn('[recientes]', error.message);
      setLugares(
        ((data ?? []) as any[]).map((r) => ({ ...r, lat: 0, lng: 0 })) as Lugar[],
      );
      setCargando(false);
    })();
    return () => {
      cancelado = true;
    };
  }, [limite, tipos?.join(',')]);

  return { lugares, cargando };
}
