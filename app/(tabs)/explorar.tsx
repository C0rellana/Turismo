import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoryTabs } from '@/components/CategoryTabs';
import { LugarCard } from '@/components/LugarCard';
import { SearchPill } from '@/components/SearchPill';
import { SkeletonRow } from '@/components/Skeleton';
import { useNearbyLugares } from '@/hooks/useNearbyLugares';
import type { Lugar } from '@/lib/types';
import { useLocationStore } from '@/stores/useLocationStore';

export default function Explorar() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const ubicacion = useLocationStore((s) => s.ubicacion);
  const solicitar = useLocationStore((s) => s.solicitar);

  const [q, setQ] = useState('');
  const [qDebounced, setQDebounced] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setQDebounced(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  const { lugares, estado, error, refetch, hayMas, loadMore } = useNearbyLugares({
    tipos: ['turistico'],
    q: qDebounced,
    pageSize: 20,
  });

  useEffect(() => {
    if (!ubicacion) void solicitar();
  }, [ubicacion, solicitar]);

  const columnas = width > 1200 ? 4 : width > 900 ? 3 : width > 600 ? 2 : 1;
  const gap = 16;
  const maxContent = Math.min(width, 1400);
  const cardW = (maxContent - 32 - gap * (columnas - 1)) / columnas;

  const abrirDetalle = (l: Lugar) => router.push(`/lugar/${l.id}` as any);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerWrap}>
        <Text style={styles.titulo}>Explorar</Text>
        <Text style={styles.sub}>Lugares turísticos fijos</Text>
      </View>

      <SearchPill value={q} onChange={setQ} placeholder="Museos, parques, restaurantes..." />
      <CategoryTabs />

      <FlatList
        data={lugares}
        keyExtractor={(l) => l.id}
        numColumns={columnas}
        key={`cols-${columnas}`}
        columnWrapperStyle={columnas > 1 ? { gap, paddingHorizontal: 16 } : undefined}
        contentContainerStyle={{
          paddingBottom: 40,
          paddingHorizontal: columnas > 1 ? 0 : 16,
          gap,
        }}
        refreshControl={<RefreshControl refreshing={estado === 'cargando'} onRefresh={refetch} />}
        onEndReached={() => {
          if (hayMas && estado !== 'cargando') loadMore();
        }}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <View style={{ width: columnas > 1 ? cardW : '100%' }}>
            <LugarCard
              lugar={item}
              onPress={() => abrirDetalle(item)}
              size="large"
              fullWidth={columnas === 1}
            />
          </View>
        )}
        ListEmptyComponent={
          estado === 'cargando' ? (
            <SkeletonRow count={4} size="large" />
          ) : (
            <View style={styles.empty}>
              <Ionicons name="search" size={32} color="#ccc" />
              <Text style={styles.emptyTxt}>Sin resultados</Text>
              {qDebounced && (
                <Text style={styles.emptySub}>
                  Probá con otra búsqueda o ajustá los filtros.
                </Text>
              )}
            </View>
          )
        }
        ListFooterComponent={
          estado === 'cargando' && lugares.length > 0 ? (
            <View style={{ padding: 20 }}>
              <ActivityIndicator />
            </View>
          ) : null
        }
      />

      {error && (
        <View style={styles.errorBar}>
          <Text style={styles.errorTxt}>{error}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerWrap: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  titulo: { fontSize: 26, fontWeight: '800', color: '#111' },
  sub: { fontSize: 13, color: '#777', marginTop: 2 },
  empty: { alignItems: 'center', padding: 40, gap: 8 },
  emptyTxt: { fontSize: 15, color: '#666', fontWeight: '600' },
  emptySub: { fontSize: 13, color: '#999', textAlign: 'center' },
  errorBar: { padding: 12, backgroundColor: '#fee', alignItems: 'center' },
  errorTxt: { color: '#c33', fontSize: 13 },
});
