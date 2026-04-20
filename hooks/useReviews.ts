import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Review } from '@/lib/types';
import { useAuthStore } from '@/stores/useAuthStore';

export type ReviewFiltro = 'recientes' | 'mejores' | 'con_foto';

export function useReviews(lugarId: string | undefined, filtro: ReviewFiltro = 'recientes') {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [cargando, setCargando] = useState(false);
  const [miReview, setMiReview] = useState<Review | null>(null);
  const user = useAuthStore((s) => s.user);

  const fetchReviews = useCallback(async () => {
    if (!lugarId) return;
    setCargando(true);
    const { data, error } = await supabase
      .from('reviews')
      .select('id, lugar_id, user_id, rating, comentario, created_at, updated_at')
      .eq('lugar_id', lugarId)
      .order('created_at', { ascending: false });
    setCargando(false);
    if (error) {
      console.warn('[reviews]', error.message);
      return;
    }
    const list = (data ?? []) as Review[];
    setReviews(list);
    if (user) {
      setMiReview(list.find((r) => r.user_id === user.id) ?? null);
    } else {
      setMiReview(null);
    }
  }, [lugarId, user]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const upsertReview = async (rating: number, comentario: string) => {
    if (!user || !lugarId) return { error: 'No logueado' as const };
    const { error } = await supabase
      .from('reviews')
      .upsert(
        {
          lugar_id: lugarId,
          user_id: user.id,
          rating,
          comentario: comentario.trim() || null,
        },
        { onConflict: 'lugar_id,user_id' },
      );
    if (error) return { error: error.message };
    await fetchReviews();
    return { error: null };
  };

  const eliminarReview = async () => {
    if (!user || !lugarId || !miReview) return;
    await supabase.from('reviews').delete().eq('id', miReview.id);
    await fetchReviews();
  };

  // Filtros cliente (C.17)
  const reviewsFiltradas = (() => {
    if (filtro === 'mejores') {
      return [...reviews].sort((a, b) => b.rating - a.rating);
    }
    return reviews;
  })();

  const promedio =
    reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;

  return {
    reviews: reviewsFiltradas,
    cargando,
    miReview,
    upsertReview,
    eliminarReview,
    refetch: fetchReviews,
    promedio,
    total: reviews.length,
  };
}
