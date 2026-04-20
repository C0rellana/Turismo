import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PanoramaCardAirbnb } from '@/components/PanoramaCardAirbnb';
import { useNearbyPanoramas } from '@/hooks/useNearbyPanoramas';
import { useTopFavoritos } from '@/hooks/useTopFavoritos';
import type { Panorama } from '@/lib/types';
import { useOnboardingStore } from '@/stores/useOnboardingStore';

const TITULOS: Record<string, { titulo: string; subtitulo: string }> = {
  cerca: { titulo: 'Cerca de ti', subtitulo: 'Panoramas a pocos km' },
  intereses: { titulo: 'Basado en tus intereses', subtitulo: 'Según tus categorías' },
  favoritos: { titulo: 'Favoritos entre usuarios', subtitulo: 'Los más guardados' },
  disponibles: { titulo: 'Disponibles ahora', subtitulo: 'Todos los panoramas' },
};

export default function Seccion() {
  const router = useRouter();
  const { tipo } = useLocalSearchParams<{ tipo: string }>();
  const { width } = useWindowDimensions();
  const { panoramas, estado } = useNearbyPanoramas();
  const { panoramas: topFavs } = useTopFavoritos(30);
  const intereses = useOnboardingStore((s) => s.intereses);

  const meta = TITULOS[tipo ?? ''] ?? TITULOS.disponibles;

  const items: Panorama[] = useMemo(() => {
    switch (tipo) {
      case 'cerca':
        return panoramas;
      case 'intereses':
        return intereses.length
          ? panoramas.filter((p) => intereses.includes(p.categoria))
          : panoramas;
      case 'favoritos':
        return topFavs;
      default:
        return panoramas;
    }
  }, [tipo, panoramas, topFavs, intereses]);

  const columnas = width > 1200 ? 4 : width > 900 ? 3 : width > 600 ? 2 : 1;
  const gap = 16;
  const cardW = (width - 32 - gap * (columnas - 1)) / columnas;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: meta.titulo, headerShown: true }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.heroHead}>
          <Text style={styles.titulo}>{meta.titulo}</Text>
          <Text style={styles.subtitulo}>{meta.subtitulo}</Text>
        </View>

        {estado === 'cargando' && items.length === 0 && (
          <View style={styles.centro}>
            <ActivityIndicator />
          </View>
        )}

        <View style={[styles.grid, { gap }]}>
          {items.map((p) => (
            <View key={p.id} style={{ width: cardW }}>
              <PanoramaCardAirbnb
                panorama={p}
                onPress={() => router.push(`/panorama/${p.id}`)}
                size="large"
              />
            </View>
          ))}
        </View>

        {estado === 'ok' && items.length === 0 && (
          <View style={styles.centro}>
            <Text style={styles.vacio}>Sin resultados para esta sección.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 16, paddingBottom: 48 },
  heroHead: { marginBottom: 16 },
  titulo: { fontSize: 26, fontWeight: '800', color: '#111' },
  subtitulo: { fontSize: 14, color: '#777', marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  centro: { alignItems: 'center', padding: 32, gap: 8 },
  vacio: { fontSize: 14, color: '#888' },
});
