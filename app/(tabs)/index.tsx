import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapaPanoramas } from '@/components/MapaPanoramas';
import { PanoramaCard } from '@/components/PanoramaCard';
import { ViewToggle } from '@/components/ViewToggle';
import { useNearbyPanoramas } from '@/hooks/useNearbyPanoramas';
import type { Panorama } from '@/lib/types';
import { useFiltersStore } from '@/stores/useFiltersStore';
import { useLocationStore } from '@/stores/useLocationStore';

export default function Home() {
  const router = useRouter();
  const ubicacion = useLocationStore((s) => s.ubicacion);
  const solicitar = useLocationStore((s) => s.solicitar);
  const { categorias } = useFiltersStore();
  const { panoramas, estado, error, refetch } = useNearbyPanoramas();
  const [modo, setModo] = useState<'mapa' | 'lista'>(Platform.OS === 'web' ? 'lista' : 'mapa');
  const [seleccionado, setSeleccionado] = useState<Panorama | null>(null);

  useEffect(() => {
    if (!ubicacion) void solicitar();
  }, [ubicacion, solicitar]);

  const abrirDetalle = (p: Panorama) => router.push(`/panorama/${p.id}`);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Explorar</Text>
        <Pressable style={styles.filtroBtn} onPress={() => router.push('/filters')}>
          <Ionicons name="options" size={20} color="#111" />
          {categorias.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeTxt}>{categorias.length}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <View style={styles.toggleWrap}>
        <ViewToggle modo={modo} onChange={setModo} disabledMapa={Platform.OS === 'web'} />
      </View>

      {ubicacion?.esDefault && (
        <View style={styles.avisoDefault}>
          <Ionicons name="information-circle" size={14} color="#8338EC" />
          <Text style={styles.avisoDefaultTxt}>
            Mostrando Santiago centro. Permití ubicación para ver panoramas reales cerca.
          </Text>
        </View>
      )}

      {estado === 'cargando' && panoramas.length === 0 && (
        <View style={styles.centro}>
          <ActivityIndicator />
        </View>
      )}

      {estado === 'error' && (
        <View style={styles.centro}>
          <Ionicons name="cloud-offline" size={32} color="#c33" />
          <Text style={styles.errorTxt}>{error}</Text>
          <Pressable onPress={refetch} style={styles.reintentarBtn}>
            <Text style={styles.reintentarTxt}>Reintentar</Text>
          </Pressable>
        </View>
      )}

      {estado === 'ok' && panoramas.length === 0 && (
        <View style={styles.centro}>
          <Ionicons name="search" size={32} color="#999" />
          <Text style={styles.vacioTxt}>Sin panoramas con los filtros actuales</Text>
        </View>
      )}

      {estado === 'ok' && panoramas.length > 0 && modo === 'mapa' && ubicacion && (
        <View style={styles.mapaWrap}>
          <MapaPanoramas
            ubicacion={ubicacion}
            panoramas={panoramas}
            seleccionadoId={seleccionado?.id}
            onSelect={setSeleccionado}
          />
          {seleccionado && (
            <View style={styles.bottomSheet}>
              <PanoramaCard
                panorama={seleccionado}
                onPress={() => abrirDetalle(seleccionado)}
                compacto
              />
            </View>
          )}
        </View>
      )}

      {modo === 'lista' && (
        <FlatList
          data={panoramas}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => (
            <PanoramaCard panorama={item} onPress={() => abrirDetalle(item)} />
          )}
          contentContainerStyle={{ paddingVertical: 6, paddingBottom: 24 }}
          refreshControl={
            <RefreshControl refreshing={estado === 'cargando'} onRefresh={refetch} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  titulo: { fontSize: 26, fontWeight: '700', color: '#111' },
  filtroBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E94F37',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeTxt: { color: '#fff', fontSize: 11, fontWeight: '700' },
  toggleWrap: { paddingBottom: 8 },
  avisoDefault: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f1ecff',
  },
  avisoDefaultTxt: { flex: 1, fontSize: 12, color: '#5c2fbf' },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 24 },
  errorTxt: { fontSize: 13, color: '#c33', textAlign: 'center' },
  vacioTxt: { fontSize: 14, color: '#999' },
  reintentarBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#111',
    borderRadius: 8,
  },
  reintentarTxt: { color: '#fff', fontWeight: '600' },
  mapaWrap: { flex: 1 },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
  },
});
