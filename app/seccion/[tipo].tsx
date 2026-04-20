import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LugarCard } from '@/components/LugarCard';
import { useNearbyLugares } from '@/hooks/useNearbyLugares';
import { useRecientes } from '@/hooks/useRecientes';
import { useTopFavoritos } from '@/hooks/useTopFavoritos';
import type { Lugar } from '@/lib/types';
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import { useOnboardingStore } from '@/stores/useOnboardingStore';

const TITULOS: Record<string, { titulo: string; subtitulo: string }> = {
  cerca: { titulo: 'Cerca de ti', subtitulo: 'Panoramas a pocos km' },
  intereses: { titulo: 'Basado en tus intereses', subtitulo: 'Según tus categorías' },
  favoritos: { titulo: 'Favoritos entre usuarios', subtitulo: 'Los más guardados' },
  recientes: { titulo: 'Recién agregados', subtitulo: 'Nuevos lugares' },
  disponibles: { titulo: 'Disponibles', subtitulo: 'Todos los lugares' },
};

export default function Seccion() {
  const router = useRouter();
  const { tipo } = useLocalSearchParams<{ tipo: string }>();
  const { width } = useWindowDimensions();
  const { lugares, estado } = useNearbyLugares({ pageSize: 200 });
  const { lugares: topFavs } = useTopFavoritos(30);
  const { lugares: recientes } = useRecientes(30);
  const misFavoritos = useFavoritesStore((s) => Object.values(s.favoritos));
  const intereses = useOnboardingStore((s) => s.intereses);

  const meta = TITULOS[tipo ?? ''] ?? TITULOS.disponibles;

  const items: Lugar[] = useMemo(() => {
    switch (tipo) {
      case 'cerca':
        return lugares;
      case 'intereses':
        return intereses.length
          ? lugares.filter((l) => intereses.includes(l.categoria))
          : lugares;
      case 'favoritos':
        // Si es "Mis favoritos" desde perfil, usa misFavoritos. Sino top de comunidad.
        return misFavoritos.length > 0 ? misFavoritos : topFavs;
      case 'recientes':
        return recientes;
      default:
        return lugares;
    }
  }, [tipo, lugares, topFavs, recientes, misFavoritos, intereses]);

  const columnas = width > 1200 ? 4 : width > 900 ? 3 : width > 600 ? 2 : 1;
  const gap = 16;
  const maxContent = Math.min(width, 1400);
  const cardW = (maxContent - 32 - gap * (columnas - 1)) / columnas;

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
          {items.map((l) => (
            <View key={l.id} style={{ width: cardW }}>
              <LugarCard
                lugar={l}
                onPress={() => router.push(`/lugar/${l.id}` as any)}
                size="large"
                fullWidth
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
