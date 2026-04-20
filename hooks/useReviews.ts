import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Review } from '@/lib/types';
import { useAuthStore } from '@/stores/useAuthStore';

type ReviewRow = Review & {
  panoramas?: unknown;
};

export function useReviews(panoramaId: string | undefined) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [cargando, setCargando] = useState(false);
  const [miReview, setMiReview] = useState<Review | null>(null);
  const user = useAuthStore((s) => s.user);

  const fetchReviews = useCallback(async () => {
    if (!panoramaId) return;
    setCargando(true);
    const { data, error } = await supabase
      .from('reviews')
      .select('id, panorama_id, user_id, rating, comentario, created_at, updated_at')
      .eq('panorama_id', panoramaId)
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
  }, [panoramaId, user]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const upsertReview = async (rating: number, comentario: string) => {
    if (!user || !panoramaId) return { error: 'No logueado' as const };
    const { error } = await supabase
      .from('reviews')
      .upsert(
        {
          panorama_id: panoramaId,
          user_id: user.id,
          rating,
          comentario: comentario.trim() || null,
        },
        { onConflict: 'panorama_id,user_id' },
      );
    if (error) return { error: error.message };
    await fetchReviews();
    return { error: null };
  };

  const eliminarReview = async () => {
    if (!user || !panoramaId || !miReview) return;
    await supabase.from('reviews').delete().eq('id', miReview.id);
    await fetchReviews();
  };

  const promedio =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  return {
    reviews,
    cargando,
    miReview,
    upsertReview,
    eliminarReview,
    refetch: fetchReviews,
    promedio,
    total: reviews.length,
  };
}
