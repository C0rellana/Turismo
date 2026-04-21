import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoryTabs } from '@/components/CategoryTabs';
import { LugarCard } from '@/components/LugarCard';
import { RegionBadge } from '@/components/RegionBadge';
import { SearchPill } from '@/components/SearchPill';
import { SectionHeader } from '@/components/SectionHeader';
import { SkeletonRow } from '@/components/Skeleton';
import { colors, fonts } from '@/constants/theme';
import { useNearbyLugares } from '@/hooks/useNearbyLugares';
import { usePanoramasProximos } from '@/hooks/usePanoramasProximos';
import { useTopFavoritos } from '@/hooks/useTopFavoritos';
import type { Lugar } from '@/lib/types';
import { useFiltersStore } from '@/stores/useFiltersStore';
import { useLocationStore } from '@/stores/useLocationStore';

export default function Panoramas() {
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

  const categorias = useFiltersStore((s) => s.categorias);

  const { lugares, estado, refetch, hayMas, loadMore } = useNearbyLugares({
    tipos: ['panorama'],
    q: qDebounced,
    pageSize: 20,
  });
  const { lugares: proximosRaw } = usePanoramasProximos(7, 20);
  const { lugares: topFavsRaw } = useTopFavoritos(20, ['panorama']);

  // Aplicar filtro categorías (compartido del store)
  const proximos =
    categorias.length > 0
      ? proximosRaw.filter((l) => categorias.includes(l.categoria))
      : proximosRaw.slice(0, 6);
  const topFavs =
    categorias.length > 0
      ? topFavsRaw.filter((l) => categorias.includes(l.categoria))
      : topFavsRaw.slice(0, 6);

  useEffect(() => {
    if (!ubicacion) void solicitar();
  }, [ubicacion, solicitar]);

  const columnas = width > 1200 ? 3 : width > 700 ? 2 : 1;
  const gap = 16;
  const maxContent = Math.min(width, 1400);
  const cardW = (maxContent - 32 - gap * (columnas - 1)) / columnas;

  const abrirDetalle = (l: Lugar) => router.push(`/lugar/${l.id}` as any);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={lugares}
        keyExtractor={(l) => l.id}
        numColumns={columnas}
        key={`cols-${columnas}`}
        columnWrapperStyle={columnas > 1 ? { gap, paddingHorizontal: 16 } : undefined}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={estado === 'cargando'} onRefresh={refetch} />}
        onEndReached={() => {
          if (hayMas && estado !== 'cargando') loadMore();
        }}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <>
            <View style={styles.headerWrap}>
              <View style={styles.headerTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.titulo}>Panoramas</Text>
                  <Text style={styles.sub}>Eventos y actividades con fecha</Text>
                </View>
                <RegionBadge compacto />
              </View>
            </View>
            <SearchPill value={q} onChange={setQ} placeholder="Buscar panoramas..." />
            <CategoryTabs />

            {proximos.length > 0 && !qDebounced && (
              <>
                <SectionHeader titulo="Esta semana" subtitulo="Lo que viene próximo" />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.hScroll}>
                  {proximos.map((l) => (
                    <LugarCard
                      key={l.id}
                      lugar={l}
                      onPress={() => abrirDetalle(l)}
                      size="large"
                      badge="Próximo"
                    />
                  ))}
                </ScrollView>
              </>
            )}

            {topFavs.length > 0 && !qDebounced && (
              <>
                <SectionHeader titulo="Favoritos de la comunidad" />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.hScroll}>
                  {topFavs.map((l) => (
                    <LugarCard
                      key={l.id}
                      lugar={l}
                      onPress={() => abrirDetalle(l)}
                      size="medium"
                      badge="Top"
                    />
                  ))}
                </ScrollView>
              </>
            )}

            <View style={{ marginTop: 20, marginBottom: 10, paddingHorizontal: 16 }}>
              <Text style={styles.listTitle}>
                {qDebounced ? `Resultados para "${qDebounced}"` : 'Todos los panoramas'}
              </Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View
            style={{
              width: columnas > 1 ? cardW : '100%',
              paddingHorizontal: columnas === 1 ? 16 : 0,
              marginBottom: gap,
            }}>
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
            <View style={{ marginTop: 20 }}>
              <SkeletonRow count={3} size="large" />
            </View>
          ) : (
            <View style={styles.empty}>
              <Ionicons name="calendar-outline" size={32} color="#ccc" />
              <Text style={styles.emptyTxt}>No hay panoramas próximos</Text>
              <Text style={styles.emptySub}>
                {qDebounced ? 'Prueba con otra búsqueda' : 'Vuelve pronto o publica el tuyo'}
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgSoft },
  headerWrap: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  titulo: { fontSize: 26, color: colors.text, fontFamily: fonts.display },
  sub: { fontSize: 13, color: colors.textMuted, marginTop: 2, fontFamily: fonts.body },
  listTitle: { fontSize: 18, color: colors.text, fontFamily: fonts.display },
  hScroll: { paddingHorizontal: 16 },
  empty: { alignItems: 'center', padding: 40, gap: 8 },
  emptyTxt: { fontSize: 15, color: '#666', fontWeight: '600' },
  emptySub: { fontSize: 13, color: '#999' },
});
