import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CATEGORIAS_MAP } from '@/constants/categories';
import { formatDistancia, formatPrecio } from '@/lib/distance';
import type { Panorama } from '@/lib/types';

type Props = {
  panorama: Panorama;
  onPress: () => void;
  compacto?: boolean;
};

export function PanoramaCard({ panorama, onPress, compacto = false }: Props) {
  const cat = CATEGORIAS_MAP[panorama.categoria];
  return (
    <Pressable onPress={onPress} style={[styles.card, compacto && styles.cardCompacto]}>
      <Image
        source={panorama.imagen_url ? { uri: panorama.imagen_url } : undefined}
        style={compacto ? styles.imagenCompacta : styles.imagen}
        contentFit="cover"
        placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
      />
      <View style={styles.body}>
        <View style={styles.headerRow}>
          <View style={[styles.catDot, { backgroundColor: cat.color }]}>
            <Ionicons
              name={cat.icono as keyof typeof Ionicons.glyphMap}
              size={12}
              color="#fff"
            />
          </View>
          <Text style={styles.categoria}>{cat.nombre}</Text>
          <Text style={styles.distancia}>{formatDistancia(panorama.distancia_m)}</Text>
        </View>
        <Text style={styles.nombre} numberOfLines={1}>
          {panorama.nombre}
        </Text>
        {!compacto && panorama.direccion && (
          <Text style={styles.direccion} numberOfLines={1}>
            {panorama.direccion}
          </Text>
        )}
        <Text style={styles.precio}>{formatPrecio(panorama.precio_nivel)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    marginHorizontal: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardCompacto: { marginHorizontal: 0, marginVertical: 0 },
  imagen: { width: '100%', height: 160, backgroundColor: '#eee' },
  imagenCompacta: { width: '100%', height: 120, backgroundColor: '#eee' },
  body: { padding: 12, gap: 4 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  catDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoria: { fontSize: 12, color: '#666', flex: 1 },
  distancia: { fontSize: 12, color: '#888', fontWeight: '500' },
  nombre: { fontSize: 16, fontWeight: '600', color: '#111' },
  direccion: { fontSize: 13, color: '#777' },
  precio: { fontSize: 14, fontWeight: '600', color: '#44AF69', marginTop: 2 },
});
