import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CATEGORIAS_MAP } from '@/constants/categories';
import { formatDistancia, formatPrecio } from '@/lib/distance';
import { supabase } from '@/lib/supabase';
import type { Panorama } from '@/lib/types';
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import { useLocationStore } from '@/stores/useLocationStore';

export default function Detalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const ubicacion = useLocationStore((s) => s.ubicacion);
  const toggleFav = useFavoritesStore((s) => s.toggle);
  const esFav = useFavoritesStore((s) => !!s.favoritos[id]);

  const [panorama, setPanorama] = useState<Panorama | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaItem: { fontSize: 14, color: '#44AF69', fontWeight: '600' },
  metaSep: { color: '#ccc' },
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
});
