import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CATEGORIAS_MAP } from '@/constants/categories';
import { formatPrecio } from '@/lib/distance';
import type { Panorama } from '@/lib/types';
import { useFavoritesStore } from '@/stores/useFavoritesStore';

type Props = {
  panorama: Panorama;
  onPress: () => void;
  badge?: string;
  size?: 'medium' | 'large' | 'small';
};

const SIZES = {
  small: { width: 180, height: 160 },
  medium: { width: 220, height: 200 },
  large: { width: 300, height: 240 },
};

export function PanoramaCardAirbnb({ panorama, onPress, badge, size = 'medium' }: Props) {
  const esFavorito = useFavoritesStore((s) => s.esFavorito(panorama.id));
  const toggleFav = useFavoritesStore((s) => s.toggle);
  const cat = CATEGORIAS_MAP[panorama.categoria];
  const dims = SIZES[size];

  const onHeart = (e: any) => {
    e.stopPropagation?.();
    toggleFav(panorama);
  };

  return (
    <Pressable onPress={onPress} style={[styles.card, { width: dims.width }]}>
      <View style={[styles.imagenWrap, { height: dims.height }]}>
        <Image
          source={panorama.imagen_url ? { uri: panorama.imagen_url } : undefined}
          style={styles.imagen}
          contentFit="cover"
          placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
        />
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeTxt}>{badge}</Text>
          </View>
        )}
        <Pressable onPress={onHeart} hitSlop={10} style={styles.heart}>
          <Ionicons
            name={esFavorito ? 'heart' : 'heart-outline'}
            size={22}
            color={esFavorito ? '#E94F37' : '#fff'}
          />
        </Pressable>
      </View>
      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={styles.nombre} numberOfLines={1}>
            {panorama.nombre}
          </Text>
          <View style={[styles.catDot, { backgroundColor: cat.color }]} />
        </View>
        {panorama.direccion && (
          <Text style={styles.direccion} numberOfLines={1}>
            {panorama.direccion}
          </Text>
        )}
        <View style={styles.row}>
          <Text style={styles.precio}>
            {formatPrecio(panorama.precio_nivel)} · {cat.nombre}
          </Text>
          {panorama.total_reviews != null && panorama.total_reviews > 0 && (
            <View style={styles.ratingInline}>
              <Ionicons name="star" size={12} color="#FFB400" />
              <Text style={styles.ratingTxt}>
                {Number(panorama.rating_promedio ?? 0).toFixed(1)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { marginRight: 14 },
  imagenWrap: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#eee',
    position: 'relative',
  },
  imagen: { width: '100%', height: '100%' },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  badgeTxt: { fontSize: 11, fontWeight: '700', color: '#111' },
  heart: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: { paddingTop: 8, gap: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  nombre: { flex: 1, fontSize: 15, fontWeight: '700', color: '#111' },
  catDot: { width: 8, height: 8, borderRadius: 4 },
  direccion: { fontSize: 13, color: '#777' },
  precio: { flex: 1, fontSize: 13, color: '#444', fontWeight: '500', marginTop: 2 },
  ratingInline: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingTxt: { fontSize: 12, color: '#111', fontWeight: '700' },
});
