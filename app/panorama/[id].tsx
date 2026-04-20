import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { RatingStars } from '@/components/RatingStars';
import { CATEGORIAS_MAP } from '@/constants/categories';
import { useReviews } from '@/hooks/useReviews';
import { formatDistancia, formatPrecio } from '@/lib/distance';
import { supabase } from '@/lib/supabase';
import type { Panorama } from '@/lib/types';
import { useAuthStore } from '@/stores/useAuthStore';
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import { useLocationStore } from '@/stores/useLocationStore';

export default function Detalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const ubicacion = useLocationStore((s) => s.ubicacion);
  const toggleFav = useFavoritesStore((s) => s.toggle);
  const esFav = useFavoritesStore((s) => !!s.favoritos[id]);
  const user = useAuthStore((s) => s.user);

  const [panorama, setPanorama] = useState<Panorama | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ratingDraft, setRatingDraft] = useState(0);
  const [comentarioDraft, setComentarioDraft] = useState('');
  const [enviandoReview, setEnviandoReview] = useState(false);

  const { reviews, miReview, upsertReview, eliminarReview, promedio, total } = useReviews(id);

  useEffect(() => {
    if (miReview) {
      setRatingDraft(miReview.rating);
      setComentarioDraft(miReview.comentario ?? '');
    }
  }, [miReview]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error: err } = await supabase.rpc('panoramas_cerca', {
          lat: ubicacion?.lat ?? 0,
          lng: ubicacion?.lng ?? 0,
          radio_m: 500000,
        });
        if (err) throw err;
        const encontrado = ((data ?? []) as Panorama[]).find((p) => p.id === id);
        if (!encontrado) throw new Error('Panorama no encontrado');
        if (!cancelled) setPanorama(encontrado);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Error');
      } finally {
        if (!cancelled) setCargando(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, ubicacion?.lat, ubicacion?.lng]);

  const abrirEnMaps = () => {
    if (!panorama) return;
    const url = Platform.select({
      ios: `maps:0,0?q=${panorama.nombre}@${panorama.lat},${panorama.lng}`,
      android: `geo:0,0?q=${panorama.lat},${panorama.lng}(${encodeURIComponent(panorama.nombre)})`,
      default: `https://www.google.com/maps/search/?api=1&query=${panorama.lat},${panorama.lng}`,
    });
    if (url) void Linking.openURL(url);
  };

  const compartir = () => {
    if (!panorama) return;
    void Share.share({
      message: `Mirá este panorama: ${panorama.nombre} - ${panorama.direccion ?? ''}`,
    });
  };

  const enviarReview = async () => {
    if (!user) {
      router.push({ pathname: '/auth/login' as any, params: { redirect: `/panorama/${id}` } });
      return;
    }
    if (ratingDraft < 1) {
      Alert.alert('Calificación requerida', 'Elegí entre 1 y 5 estrellas.');
      return;
    }
    setEnviandoReview(true);
    const { error: e } = await upsertReview(ratingDraft, comentarioDraft);
    setEnviandoReview(false);
    if (e) Alert.alert('Error', e);
  };

  const confirmarEliminar = () =>
    Alert.alert('¿Eliminar review?', 'Se borra tu calificación y comentario.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await eliminarReview();
          setRatingDraft(0);
          setComentarioDraft('');
        },
      },
    ]);

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !panorama) {
    return (
      <View style={styles.centro}>
        <Text style={styles.errorTxt}>{error ?? 'No se pudo cargar'}</Text>
        <Pressable onPress={() => router.back()} style={styles.btnVolver}>
          <Text style={styles.btnVolverTxt}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  const cat = CATEGORIAS_MAP[panorama.categoria];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <Image
        source={panorama.imagen_url ? { uri: panorama.imagen_url } : undefined}
        style={styles.hero}
        contentFit="cover"
      />

      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={[styles.catPill, { backgroundColor: cat.color }]}>
            <Ionicons
              name={cat.icono as keyof typeof Ionicons.glyphMap}
              size={12}
              color="#fff"
            />
            <Text style={styles.catTxt}>{cat.nombre}</Text>
          </View>
          <Pressable onPress={() => toggleFav(panorama)} style={styles.favBtn}>
            <Ionicons
              name={esFav ? 'heart' : 'heart-outline'}
              size={26}
              color={esFav ? '#E94F37' : '#333'}
            />
          </Pressable>
        </View>

        <Text style={styles.nombre}>{panorama.nombre}</Text>

        <View style={styles.meta}>
          <Text style={styles.metaItem}>{formatPrecio(panorama.precio_nivel)}</Text>
          {panorama.distancia_m != null && (
            <>
              <Text style={styles.metaSep}>·</Text>
              <Text style={styles.metaItem}>{formatDistancia(panorama.distancia_m)}</Text>
            </>
          )}
          {total > 0 && (
            <>
              <Text style={styles.metaSep}>·</Text>
              <View style={styles.ratingInline}>
                <Ionicons name="star" size={14} color="#FFB400" />
                <Text style={styles.ratingTxt}>
                  {promedio.toFixed(1)} ({total})
                </Text>
              </View>
            </>
          )}
        </View>

        {panorama.direccion && (
          <View style={styles.direccionRow}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.direccion}>{panorama.direccion}</Text>
          </View>
        )}

        {panorama.descripcion && <Text style={styles.descripcion}>{panorama.descripcion}</Text>}

        <View style={styles.acciones}>
          <Pressable style={styles.btnAccion} onPress={abrirEnMaps}>
            <Ionicons name="navigate" size={18} color="#fff" />
            <Text style={styles.btnAccionTxt}>Abrir en Maps</Text>
          </Pressable>
          <Pressable style={[styles.btnAccion, styles.btnSecundario]} onPress={compartir}>
            <Ionicons name="share-outline" size={18} color="#111" />
            <Text style={[styles.btnAccionTxt, styles.btnSecundarioTxt]}>Compartir</Text>
          </Pressable>
        </View>

        {/* ============ Reviews ============ */}
        <View style={styles.reviewsSection}>
          <Text style={styles.sectionTitle}>
            Reseñas{total > 0 ? ` (${total})` : ''}
          </Text>

          {total > 0 && (
            <View style={styles.summaryBox}>
              <Text style={styles.summaryScore}>{promedio.toFixed(1)}</Text>
              <View style={{ flex: 1 }}>
                <RatingStars rating={promedio} size={18} />
                <Text style={styles.summarySub}>
                  Basado en {total} reseña{total > 1 ? 's' : ''}
                </Text>
              </View>
            </View>
          )}

          {/* Form: dejar o editar review */}
          <View style={styles.formReview}>
            <Text style={styles.formTitle}>
              {miReview ? 'Tu reseña' : '¿Visitaste este lugar?'}
            </Text>
            <RatingStars rating={ratingDraft} onChange={setRatingDraft} size={28} />
            <TextInput
              value={comentarioDraft}
              onChangeText={setComentarioDraft}
              placeholder="Contanos tu experiencia (opcional)"
              style={styles.input}
              multiline
            />
            <View style={styles.formBtns}>
              <Pressable
                style={[styles.btnPrimario, enviandoReview && { opacity: 0.5 }]}
                onPress={enviarReview}
                disabled={enviandoReview}>
                {enviandoReview ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnPrimarioTxt}>
                    {user ? (miReview ? 'Actualizar reseña' : 'Publicar reseña') : 'Iniciar sesión para reseñar'}
                  </Text>
                )}
              </Pressable>
              {miReview && (
                <Pressable style={styles.btnBorrar} onPress={confirmarEliminar}>
                  <Ionicons name="trash-outline" size={18} color="#c33" />
                </Pressable>
              )}
            </View>
          </View>

          {/* Lista reviews */}
          {reviews.length === 0 && (
            <Text style={styles.sinReviews}>Sé el primero en dejar una reseña.</Text>
          )}
          {reviews.map((r) => (
            <View key={r.id} style={styles.reviewCard}>
              <View style={styles.reviewHead}>
                <View style={styles.reviewAvatar}>
                  <Ionicons name="person" size={16} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <RatingStars rating={r.rating} size={14} />
                  <Text style={styles.reviewFecha}>
                    {new Date(r.created_at).toLocaleDateString('es-CL', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
              </View>
              {r.comentario && <Text style={styles.reviewComentario}>{r.comentario}</Text>}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  errorTxt: { color: '#c33', fontSize: 14 },
  btnVolver: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#111', borderRadius: 8 },
  btnVolverTxt: { color: '#fff', fontWeight: '600' },
  hero: { width: '100%', height: 280, backgroundColor: '#eee' },
  body: { padding: 20, gap: 12 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  catTxt: { color: '#fff', fontSize: 12, fontWeight: '600' },
  favBtn: { padding: 4 },
  nombre: { fontSize: 26, fontWeight: '700', color: '#111' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  metaItem: { fontSize: 14, color: '#44AF69', fontWeight: '600' },
  metaSep: { color: '#ccc' },
  ratingInline: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingTxt: { fontSize: 14, color: '#111', fontWeight: '600' },
  direccionRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  direccion: { fontSize: 14, color: '#666', flex: 1 },
  descripcion: { fontSize: 15, lineHeight: 22, color: '#333', marginTop: 8 },
  acciones: { flexDirection: 'row', gap: 10, marginTop: 16 },
  btnAccion: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#111',
    paddingVertical: 14,
    borderRadius: 12,
  },
  btnSecundario: { backgroundColor: '#f0f0f0' },
  btnAccionTxt: { color: '#fff', fontSize: 15, fontWeight: '600' },
  btnSecundarioTxt: { color: '#111' },
  reviewsSection: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 14,
  },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#111' },
  summaryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 14,
    backgroundColor: '#fafafa',
    borderRadius: 12,
  },
  summaryScore: { fontSize: 36, fontWeight: '800', color: '#111' },
  summarySub: { fontSize: 12, color: '#666', marginTop: 4 },
  formReview: {
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  formTitle: { fontSize: 15, fontWeight: '700', color: '#111' },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
  formBtns: { flexDirection: 'row', gap: 8 },
  btnPrimario: {
    flex: 1,
    backgroundColor: '#111',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnPrimarioTxt: { color: '#fff', fontSize: 14, fontWeight: '700' },
  btnBorrar: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ffcdc7',
    borderRadius: 10,
  },
  sinReviews: { fontSize: 13, color: '#888', textAlign: 'center', padding: 16 },
  reviewCard: { padding: 12, borderRadius: 10, backgroundColor: '#fafafa', gap: 8 },
  reviewHead: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  reviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewFecha: { fontSize: 11, color: '#888', marginTop: 2 },
  reviewComentario: { fontSize: 14, color: '#333', lineHeight: 20 },
});
