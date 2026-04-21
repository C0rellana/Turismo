import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CATEGORIAS_MAP } from '@/constants/categories';
import { TAGS_MAP } from '@/constants/tags';
import { formatPrecio } from '@/lib/distance';
import type { Lugar } from '@/lib/types';
import { useFavoritesStore } from '@/stores/useFavoritesStore';

type Props = {
  lugar: Lugar;
  onPress: () => void;
  badge?: string;
  size?: 'medium' | 'large' | 'small';
  fullWidth?: boolean;
};

const SIZES = {
  small: { width: 180, height: 160 },
  medium: { width: 220, height: 200 },
  large: { width: 300, height: 240 },
};

function formatFecha(iso?: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
}

export function LugarCard({ lugar, onPress, badge, size = 'medium', fullWidth = false }: Props) {
  const esFavorito = useFavoritesStore((s) => s.esFavorito(lugar.id));
  const toggleFav = useFavoritesStore((s) => s.toggle);
  const cat = CATEGORIAS_MAP[lugar.categoria];
  const dims = SIZES[size];
  const cardWidth = fullWidth ? '100%' : dims.width;

  const onHeart = (e: any) => {
    e.stopPropagation?.();
    toggleFav(lugar);
  };

  const fechaTxt = lugar.tipo === 'panorama' ? formatFecha(lugar.fecha_inicio) : null;

  return (
    <Pressable onPress={onPress} style={[styles.card, { width: cardWidth as any }, !fullWidth && { marginRight: 14 }]}>
      <View style={[styles.imagenWrap, { height: dims.height }]}>
        <Image
          source={lugar.imagen_url ? { uri: lugar.imagen_url } : undefined}
          style={styles.imagen}
          contentFit="cover"
          placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
        />
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeTxt}>{badge}</Text>
          </View>
        )}
        {fechaTxt && (
          <View style={styles.fechaBadge}>
            <Ionicons name="calendar" size={11} color="#fff" />
            <Text style={styles.fechaBadgeTxt}>{fechaTxt}</Text>
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
            {lugar.nombre}
          </Text>
          <View style={[styles.catDot, { backgroundColor: cat.color }]} />
        </View>
        {lugar.direccion && (
          <Text style={styles.direccion} numberOfLines={1}>
            {lugar.direccion}
          </Text>
        )}
        <View style={styles.row}>
          <Text style={styles.precio}>
            {formatPrecio(lugar.precio_nivel)} · {cat.nombre}
          </Text>
          {lugar.total_reviews != null && lugar.total_reviews > 0 && (
            <View style={styles.ratingInline}>
              <Ionicons name="star" size={12} color="#FFB400" />
              <Text style={styles.ratingTxt}>
                {Number(lugar.rating_promedio ?? 0).toFixed(1)}
              </Text>
            </View>
          )}
        </View>
        {lugar.tags && lugar.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {lugar.tags.slice(0, 3).map((t) => {
              const tagDef = TAGS_MAP[t];
              if (!tagDef) return null;
              return (
                <View key={t} style={[styles.tagChip, { backgroundColor: tagDef.color + '20' }]}>
                  <Ionicons name={tagDef.icon as any} size={10} color={tagDef.color} />
                  <Text style={[styles.tagTxt, { color: tagDef.color }]}>{tagDef.label}</Text>
                </View>
              );
            })}
            {lugar.tags.length > 3 && (
              <Text style={styles.tagsMore}>+{lugar.tags.length - 3}</Text>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {},
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
  fechaBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E94F37',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  fechaBadgeTxt: { fontSize: 11, fontWeight: '700', color: '#fff' },
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
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagTxt: { fontSize: 10, fontWeight: '700' },
  tagsMore: { fontSize: 10, color: '#888', fontWeight: '600', alignSelf: 'center' },
});

/** Alias compatibilidad. Deprecated. */
export const PanoramaCardAirbnb = LugarCard;
