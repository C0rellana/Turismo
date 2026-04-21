import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { DenunciarBtn } from '@/components/DenunciarBtn';
import { LugarCard } from '@/components/LugarCard';
import { MediaView, VideoBadge } from '@/components/MediaView';
import { RatingStars } from '@/components/RatingStars';
import { TAGS_MAP } from '@/constants/tags';
import { CATEGORIAS_MAP } from '@/constants/categories';
import { useLugaresCreador } from '@/hooks/useLugaresCreador';
import { useLugaresSimilares } from '@/hooks/useLugaresSimilares';
import { type ReviewFiltro, useReviews } from '@/hooks/useReviews';
import { formatDistancia, formatPrecio } from '@/lib/distance';
import { supabase } from '@/lib/supabase';
import type { Lugar, LugarImagen } from '@/lib/types';
import { useAuthStore } from '@/stores/useAuthStore';
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import { useLocationStore } from '@/stores/useLocationStore';

/** C.14 — distancia aproximada en km + tiempos caminando/bici/auto */
function tiempos(dist_m: number | undefined) {
  if (dist_m == null) return null;
  const km = dist_m / 1000;
  return {
    caminando: Math.round(km * 12), // ~5 km/h
    bici: Math.round(km * 4), // ~15 km/h
    auto: Math.round(km * 1.5), // ~40 km/h urbano
    km: km.toFixed(1),
  };
}

export default function Detalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const ubicacion = useLocationStore((s) => s.ubicacion);
  const toggleFav = useFavoritesStore((s) => s.toggle);
  const esFav = useFavoritesStore((s) => !!s.favoritos[id]);
  const user = useAuthStore((s) => s.user);

  const [lugar, setLugar] = useState<Lugar | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagenes, setImagenes] = useState<LugarImagen[]>([]);
  const [ratingDraft, setRatingDraft] = useState(0);
  const [comentarioDraft, setComentarioDraft] = useState('');
  const [enviandoReview, setEnviandoReview] = useState(false);
  const [reviewFiltro, setReviewFiltro] = useState<ReviewFiltro>('recientes');
  const [reviewMinStars, setReviewMinStars] = useState(0);
  const [idxGaleria, setIdxGaleria] = useState(0);
  const galRef = useRef<FlatList<LugarImagen>>(null);

  const { reviews, miReview, upsertReview, eliminarReview, promedio, total } = useReviews(
    id,
    reviewFiltro,
  );

  const reviewsFiltradasPorEstrellas = useMemo(
    () => (reviewMinStars > 0 ? reviews.filter((r) => r.rating >= reviewMinStars) : reviews),
    [reviews, reviewMinStars],
  );

  const { similares } = useLugaresSimilares(lugar);
  const { lugares: delCreador } = useLugaresCreador(id);

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
        const { data, error: err } = await supabase.rpc('lugares_cerca', {
          lat: ubicacion?.lat ?? -33.4489,
          lng: ubicacion?.lng ?? -70.6693,
          radio_m: 500000,
          tipos: null,
          q: null,
          p_limit: 500,
          p_offset: 0,
        });
        if (err) throw err;
        const encontrado = ((data ?? []) as Lugar[]).find((p) => p.id === id);
        if (!encontrado) throw new Error('Lugar no encontrado');
        if (!cancelled) setLugar(encontrado);

        const { data: imgs } = await supabase
          .from('lugar_imagenes')
          .select('id, lugar_id, url, orden')
          .eq('lugar_id', id)
          .order('orden', { ascending: true });
        if (!cancelled) setImagenes((imgs ?? []) as LugarImagen[]);
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

  // C.13 — deep links "cómo llegar"
  const abrirEnMaps = () => {
    if (!lugar) return;
    const url = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(lugar.nombre)}@${lugar.lat},${lugar.lng}`,
      android: `geo:0,0?q=${lugar.lat},${lugar.lng}(${encodeURIComponent(lugar.nombre)})`,
      default: `https://www.google.com/maps/search/?api=1&query=${lugar.lat},${lugar.lng}`,
    });
    if (url) void Linking.openURL(url);
  };

  const abrirUber = () => {
    if (!lugar) return;
    const pickup =
      ubicacion && !ubicacion.esDefault
        ? `&pickup[latitude]=${ubicacion.lat}&pickup[longitude]=${ubicacion.lng}`
        : '&pickup=my_location';
    const url = `https://m.uber.com/ul/?action=setPickup${pickup}&dropoff[latitude]=${lugar.lat}&dropoff[longitude]=${lugar.lng}&dropoff[nickname]=${encodeURIComponent(lugar.nombre)}`;
    void Linking.openURL(url);
  };

  const abrirTransantiago = () => {
    if (!lugar) return;
    const origen =
      ubicacion && !ubicacion.esDefault ? `${ubicacion.lat},${ubicacion.lng}` : '';
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origen}&destination=${lugar.lat},${lugar.lng}&travelmode=transit`;
    void Linking.openURL(url);
  };

  const compartir = async () => {
    if (!lugar) return;
    const url = `https://magical-planet.vercel.app/lugar/${lugar.id}`;
    const texto = `Mira este lugar: ${lugar.nombre}${lugar.direccion ? ` - ${lugar.direccion}` : ''}`;
    try {
      if (Platform.OS === 'web') {
        if (typeof navigator !== 'undefined' && (navigator as any).share) {
          await (navigator as any).share({ title: lugar.nombre, text: texto, url });
        } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
          await navigator.clipboard.writeText(url);
          Alert.alert('Link copiado', url);
        } else {
          window.open(`https://wa.me/?text=${encodeURIComponent(`${texto}\n${url}`)}`, '_blank');
        }
      } else {
        await Share.share({ message: `${texto}\n${url}`, url });
      }
    } catch (e) {
      console.warn('[share]', e);
    }
  };

  const enviarReview = async () => {
    if (!user) {
      router.push({ pathname: '/auth/login' as any, params: { redirect: `/lugar/${id}` } });
      return;
    }
    if (ratingDraft < 1) {
      Alert.alert('Calificación requerida', 'Elige entre 1 y 5 estrellas.');
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

  if (error || !lugar) {
    return (
      <View style={styles.centro}>
        <Text style={styles.errorTxt}>{error ?? 'No se pudo cargar'}</Text>
        <Pressable onPress={() => router.back()} style={styles.btnVolver}>
          <Text style={styles.btnVolverTxt}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  const cat = CATEGORIAS_MAP[lugar.categoria];
  const t = tiempos(lugar.distancia_m);

  // Galería: usa lugar_imagenes si hay, sino imagen_url única
  const fotos: LugarImagen[] =
    imagenes.length > 0
      ? imagenes
      : lugar.imagen_url
        ? [{ id: 'main', lugar_id: lugar.id, url: lugar.imagen_url, orden: 0 }]
        : [];

  const screenW = Math.min(width, 900);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* D.20 — Galería swipeable */}
      {fotos.length > 0 ? (
        <View>
          <FlatList
            ref={galRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            data={fotos}
            keyExtractor={(f) => f.id}
            onMomentumScrollEnd={(ev) => {
              const idx = Math.round(ev.nativeEvent.contentOffset.x / screenW);
              setIdxGaleria(idx);
            }}
            renderItem={({ item }) => (
              <View style={[styles.hero, { width: screenW }]}>
                <MediaView
                  url={item.url}
                  tipo={(item.tipo as any) ?? 'image'}
                  thumbnail={item.thumbnail_url ?? null}
                  style={{ width: screenW, height: 280 }}
                />
                {item.tipo === 'video' && <VideoBadge />}
              </View>
            )}
          />
          {fotos.length > 1 && (
            <View style={styles.dots}>
              {fotos.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i === idxGaleria && styles.dotActive]}
                />
              ))}
            </View>
          )}
        </View>
      ) : (
        <Image source={undefined} style={styles.hero} contentFit="cover" />
      )}

      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={[styles.catPill, { backgroundColor: cat.color }]}>
            <Ionicons name={cat.icono as any} size={12} color="#fff" />
            <Text style={styles.catTxt}>{cat.nombre}</Text>
          </View>
          <Pressable onPress={() => toggleFav(lugar)} style={styles.favBtn}>
            <Ionicons
              name={esFav ? 'heart' : 'heart-outline'}
              size={26}
              color={esFav ? '#E94F37' : '#333'}
            />
          </Pressable>
        </View>

        <Text style={styles.nombre}>{lugar.nombre}</Text>

        <View style={styles.meta}>
          <Text style={styles.metaItem}>{formatPrecio(lugar.precio_nivel)}</Text>
          {lugar.distancia_m != null && (
            <>
              <Text style={styles.metaSep}>·</Text>
              <Text style={styles.metaItem}>{formatDistancia(lugar.distancia_m)}</Text>
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

        {lugar.direccion && (
          <View style={styles.direccionRow}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.direccion}>{lugar.direccion}</Text>
          </View>
        )}

        {/* Evento: fecha */}
        {lugar.tipo === 'panorama' && lugar.fecha_inicio && (
          <View style={styles.direccionRow}>
            <Ionicons name="calendar" size={16} color="#E94F37" />
            <Text style={styles.direccion}>
              {new Date(lugar.fecha_inicio).toLocaleDateString('es-CL', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        )}

        {lugar.descripcion && <Text style={styles.descripcion}>{lugar.descripcion}</Text>}

        {/* C.13 — Cómo llegar */}
        <Text style={styles.sectionTitle}>Cómo llegar</Text>
        <View style={styles.comollegarRow}>
          <Pressable style={styles.comollegarBtn} onPress={abrirEnMaps}>
            <Ionicons name="map" size={20} color="#111" />
            <Text style={styles.comollegarTxt}>Maps</Text>
          </Pressable>
          <Pressable style={styles.comollegarBtn} onPress={abrirUber}>
            <Ionicons name="car" size={20} color="#111" />
            <Text style={styles.comollegarTxt}>Uber</Text>
          </Pressable>
          <Pressable style={styles.comollegarBtn} onPress={abrirTransantiago}>
            <Ionicons name="bus" size={20} color="#111" />
            <Text style={styles.comollegarTxt}>Transporte</Text>
          </Pressable>
          <Pressable style={styles.comollegarBtn} onPress={compartir}>
            <Ionicons name="share-outline" size={20} color="#111" />
            <Text style={styles.comollegarTxt}>Compartir</Text>
          </Pressable>
        </View>

        {/* C.14 — Tiempos estimados */}
        {t && (
          <View style={styles.tiemposBox}>
            <Text style={styles.tiemposLabel}>Aprox {t.km} km desde tu ubicación</Text>
            <View style={styles.tiemposRow}>
              <View style={styles.tiempoItem}>
                <Ionicons name="walk" size={18} color="#666" />
                <Text style={styles.tiempoTxt}>{t.caminando} min</Text>
              </View>
              <View style={styles.tiempoItem}>
                <Ionicons name="bicycle" size={18} color="#666" />
                <Text style={styles.tiempoTxt}>{t.bici} min</Text>
              </View>
              <View style={styles.tiempoItem}>
                <Ionicons name="car-sport" size={18} color="#666" />
                <Text style={styles.tiempoTxt}>{t.auto} min</Text>
              </View>
            </View>
          </View>
        )}

        {/* C.15 — Similares */}
        {similares.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Similares</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {similares.map((s) => (
                <LugarCard
                  key={s.id}
                  lugar={s}
                  size="small"
                  onPress={() => router.push(`/lugar/${s.id}` as any)}
                />
              ))}
            </ScrollView>
          </>
        )}

        {/* C.16 — Más del creador */}
        {delCreador.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Más de este creador</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {delCreador.map((s) => (
                <LugarCard
                  key={s.id}
                  lugar={s}
                  size="small"
                  onPress={() => router.push(`/lugar/${s.id}` as any)}
                />
              ))}
            </ScrollView>
          </>
        )}

        {/* Características (tags) */}
        {lugar.tags && lugar.tags.length > 0 && (
          <View style={styles.caractSection}>
            <Text style={styles.sectionTitle}>Características</Text>
            <View style={styles.caractGrid}>
              {lugar.tags.map((t) => {
                const tagDef = TAGS_MAP[t];
                if (!tagDef) return null;
                return (
                  <View
                    key={t}
                    style={[styles.caractChip, { backgroundColor: tagDef.color + '18', borderColor: tagDef.color + '50' }]}>
                    <Ionicons name={tagDef.icon as any} size={14} color={tagDef.color} />
                    <Text style={[styles.caractTxt, { color: tagDef.color }]}>{tagDef.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Denunciar */}
        <View style={styles.reportSection}>
          <DenunciarBtn targetTipo="lugar" targetId={lugar.id} />
        </View>

        {/* Reviews */}
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

          {/* Form */}
          <View style={styles.formReview}>
            <Text style={styles.formTitle}>
              {miReview ? 'Tu reseña' : '¿Visitaste este lugar?'}
            </Text>
            <RatingStars rating={ratingDraft} onChange={setRatingDraft} size={28} />
            <TextInput
              value={comentarioDraft}
              onChangeText={setComentarioDraft}
              placeholder="Cuéntanos tu experiencia (opcional)"
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
                    {user ? (miReview ? 'Actualizar' : 'Publicar reseña') : 'Iniciar sesión'}
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

          {/* C.17 — Filtros reviews */}
          {reviews.length > 0 && (
            <View style={styles.filtrosReviews}>
              <Pressable
                onPress={() => setReviewFiltro('recientes')}
                style={[styles.filtroChip, reviewFiltro === 'recientes' && styles.filtroChipActive]}>
                <Text
                  style={[
                    styles.filtroTxt,
                    reviewFiltro === 'recientes' && styles.filtroTxtActive,
                  ]}>
                  Recientes
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setReviewFiltro('mejores')}
                style={[styles.filtroChip, reviewFiltro === 'mejores' && styles.filtroChipActive]}>
                <Text
                  style={[
                    styles.filtroTxt,
                    reviewFiltro === 'mejores' && styles.filtroTxtActive,
                  ]}>
                  Mejores
                </Text>
              </Pressable>
              {[5, 4, 3].map((n) => (
                <Pressable
                  key={n}
                  onPress={() => setReviewMinStars(reviewMinStars === n ? 0 : n)}
                  style={[
                    styles.filtroChip,
                    reviewMinStars === n && styles.filtroChipActive,
                  ]}>
                  <Ionicons name="star" size={12} color={reviewMinStars === n ? '#fff' : '#FFB400'} />
                  <Text
                    style={[
                      styles.filtroTxt,
                      reviewMinStars === n && styles.filtroTxtActive,
                    ]}>
                    {n}+
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* Lista reviews */}
          {reviewsFiltradasPorEstrellas.length === 0 && (
            <Text style={styles.sinReviews}>Sin reseñas con estos filtros.</Text>
          )}
          {reviewsFiltradasPorEstrellas.map((r) => (
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
  hero: { height: 280, backgroundColor: '#eee' },
  dots: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { backgroundColor: '#fff', width: 18 },
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
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111', marginTop: 20 },
  comollegarRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  comollegarBtn: {
    flex: 1,
    minWidth: 80,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fafafa',
  },
  comollegarTxt: { fontSize: 11, fontWeight: '600', color: '#222' },
  tiemposBox: { padding: 12, borderRadius: 10, backgroundColor: '#f5f5f5', marginTop: 8 },
  tiemposLabel: { fontSize: 12, color: '#666', marginBottom: 8 },
  tiemposRow: { flexDirection: 'row', justifyContent: 'space-around' },
  tiempoItem: { alignItems: 'center', gap: 4 },
  tiempoTxt: { fontSize: 13, color: '#222', fontWeight: '600' },
  reviewsSection: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 14,
  },
  caractSection: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 10,
  },
  caractGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  caractChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  caractTxt: { fontSize: 12, fontWeight: '700' },
  reportSection: {
    marginTop: 20,
    alignItems: 'flex-start',
  },
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
  filtrosReviews: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  filtroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  filtroChipActive: { backgroundColor: '#111', borderColor: '#111' },
  filtroTxt: { fontSize: 12, color: '#666', fontWeight: '500' },
  filtroTxtActive: { color: '#fff' },
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
