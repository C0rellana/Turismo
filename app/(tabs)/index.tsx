import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapaPanoramas } from '@/components/MapaPanoramas';
import { PanoramaCardAirbnb } from '@/components/PanoramaCardAirbnb';
import { CATEGORIAS } from '@/constants/categories';
import { useNearbyPanoramas } from '@/hooks/useNearbyPanoramas';
import { useTopFavoritos } from '@/hooks/useTopFavoritos';
import type { CategoriaId, Panorama } from '@/lib/types';
import { useAuthStore } from '@/stores/useAuthStore';
import { useFiltersStore } from '@/stores/useFiltersStore';
import { useLocationStore } from '@/stores/useLocationStore';
import { useOnboardingStore } from '@/stores/useOnboardingStore';

export default function Home() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const ubicacion = useLocationStore((s) => s.ubicacion);
  const solicitar = useLocationStore((s) => s.solicitar);
  const { categorias, setCategorias } = useFiltersStore();
  const intereses = useOnboardingStore((s) => s.intereses);
  const user = useAuthStore((s) => s.user);
  const { panoramas, estado, error, refetch } = useNearbyPanoramas();
  const { panoramas: topFavs } = useTopFavoritos(8);

  const [verMapa, setVerMapa] = useState(false);
  const [seleccionado, setSeleccionado] = useState<Panorama | null>(null);

  const columnas = width > 1200 ? 4 : width > 900 ? 3 : width > 600 ? 2 : 1;
  const gap = 16;
  const maxContent = Math.min(width, 1400);
  const cardW = (maxContent - 32 - gap * (columnas - 1)) / columnas;

  useEffect(() => {
    if (!ubicacion) void solicitar();
  }, [ubicacion, solicitar]);

  const abrirDetalle = (p: Panorama) => router.push(`/panorama/${p.id}`);
  const toggleCategoriaTop = (c: CategoriaId) => {
    if (categorias.includes(c)) setCategorias([]);
    else setCategorias([c]);
  };

  const cercanos = useMemo(() => panoramas.slice(0, 8), [panoramas]);
  const basadoEnIntereses = useMemo(() => {
    if (!intereses.length) return [];
    return panoramas.filter((p) => intereses.includes(p.categoria)).slice(0, 8);
  }, [panoramas, intereses]);
  const disponibles = useMemo(() => panoramas.slice(0, 20), [panoramas]);

  const onPublicar = () => {
    if (!user) {
      router.push({ pathname: '/auth/login' as any, params: { redirect: '/crear-panorama' } });
    } else {
      router.push('/crear-panorama' as any);
    }
  };

  if (verMapa) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.headerMapa}>
          <Pressable onPress={() => setVerMapa(false)} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#111" />
          </Pressable>
          <Text style={styles.headerMapaTxt}>Mapa</Text>
          <View style={{ width: 40 }} />
        </View>
        {ubicacion && (
          <View style={{ flex: 1 }}>
            <MapaPanoramas
              ubicacion={ubicacion}
              panoramas={panoramas}
              seleccionadoId={seleccionado?.id}
              onSelect={setSeleccionado}
            />
            {seleccionado && (
              <View style={styles.bottomSheet}>
                <Pressable onPress={() => abrirDetalle(seleccionado)} style={styles.miniCard}>
                  <Text style={styles.miniNombre}>{seleccionado.nombre}</Text>
                  <Text style={styles.miniDir} numberOfLines={1}>
                    {seleccionado.direccion ?? 'Ver detalles'}
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={estado === 'cargando'} onRefresh={refetch} />
        }
        contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Search bar pill */}
        <View style={styles.searchRow}>
          <Pressable style={styles.searchPill} onPress={() => router.push('/filters')}>
            <Ionicons name="search" size={18} color="#111" />
            <View style={{ flex: 1 }}>
              <Text style={styles.searchTitle}>Empezá la búsqueda</Text>
              <Text style={styles.searchSub}>
                {categorias.length > 0
                  ? `${categorias.length} categoría${categorias.length > 1 ? 's' : ''} activa${categorias.length > 1 ? 's' : ''}`
                  : 'Panoramas cerca tuyo'}
              </Text>
            </View>
            <View style={styles.filterIcon}>
              <Ionicons name="options" size={16} color="#111" />
            </View>
          </Pressable>
        </View>

        {/* CTA publicar banner si no logueado */}
        {!user && (
          <Pressable style={styles.ctaPublicar} onPress={onPublicar}>
            <View style={styles.ctaEmoji}>
              <Ionicons name="megaphone" size={22} color="#E94F37" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.ctaTitle}>¿Querés publicar un panorama?</Text>
              <Text style={styles.ctaDesc}>Iniciá sesión con Google para compartir tu lugar favorito.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#bbb" />
          </Pressable>
        )}

        {/* Tabs categorías top (segmented horizontal) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catsScroll}>
          <Pressable
            onPress={() => setCategorias([])}
            style={[styles.catTab, categorias.length === 0 && styles.catTabActive]}>
            <Ionicons
              name="sparkles"
              size={20}
              color={categorias.length === 0 ? '#fff' : '#888'}
            />
            <Text
              style={[styles.catTabTxt, categorias.length === 0 && styles.catTabTxtActive]}>
              Todo
            </Text>
          </Pressable>
          {CATEGORIAS.map((cat) => {
            const activo = categorias.includes(cat.id);
            return (
              <Pressable
                key={cat.id}
                onPress={() => toggleCategoriaTop(cat.id)}
                style={[styles.catTab, activo && styles.catTabActive]}>
                <Ionicons
                  name={cat.icono as any}
                  size={20}
                  color={activo ? cat.color : '#888'}
                />
                <Text style={[styles.catTabTxt, activo && { color: cat.color, fontWeight: '700' }]}>
                  {cat.nombre}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {ubicacion?.esDefault && (
          <View style={styles.avisoDefault}>
            <Ionicons name="information-circle" size={14} color="#8338EC" />
            <Text style={styles.avisoDefaultTxt}>
              Mostrando Santiago centro. Permití ubicación para panoramas reales cerca.
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

        {/* Sección: Cerca de ti */}
        {cercanos.length > 0 && (
          <Section
            titulo="Cerca de ti"
            subtitulo={ubicacion?.esDefault ? 'Santiago centro' : 'Panoramas a pocos km'}
            items={cercanos}
            onPress={abrirDetalle}
            onVerTodos={() => router.push('/seccion/cerca' as any)}
          />
        )}

        {/* Sección: Basado en intereses */}
        {basadoEnIntereses.length > 0 && (
          <Section
            titulo="Basado en tus intereses"
            subtitulo="Seleccionados según tus categorías"
            items={basadoEnIntereses}
            badge="Para vos"
            size="large"
            onPress={abrirDetalle}
            onVerTodos={() => router.push('/seccion/intereses' as any)}
          />
        )}

        {/* Sección: Favoritos entre usuarios */}
        {topFavs.length > 0 && (
          <Section
            titulo="Favoritos entre usuarios"
            subtitulo="Los más guardados por la comunidad"
            items={topFavs}
            badge="Top"
            onPress={abrirDetalle}
            onVerTodos={() => router.push('/seccion/favoritos' as any)}
          />
        )}

        {/* Sección: Disponibles (grid responsive) */}
        {disponibles.length > 0 && (
          <View style={styles.listaVertical}>
            <Pressable
              style={styles.seccionHeader}
              onPress={() => router.push('/seccion/disponibles' as any)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.seccionTitulo}>Disponibles ahora</Text>
                <Text style={styles.seccionSubtitulo}>Todos los panoramas cerca</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#999" />
            </Pressable>
            <View style={[styles.gridDisponibles, { gap, paddingHorizontal: 16 }]}>
              {disponibles.map((item) => (
                <View key={item.id} style={{ width: cardW }}>
                  <PanoramaCardAirbnb
                    panorama={item}
                    onPress={() => abrirDetalle(item)}
                    size="large"
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {estado === 'ok' && panoramas.length === 0 && (
          <View style={styles.centro}>
            <Ionicons name="search" size={32} color="#999" />
            <Text style={styles.vacioTxt}>Sin panoramas con los filtros actuales</Text>
          </View>
        )}
      </ScrollView>

      {/* FAB mapa */}
      <Pressable style={styles.fabMapa} onPress={() => setVerMapa(true)}>
        <Ionicons name="map" size={18} color="#fff" />
        <Text style={styles.fabMapaTxt}>Mapa</Text>
      </Pressable>
    </SafeAreaView>
  );
}

type SectionProps = {
  titulo: string;
  subtitulo?: string;
  items: Panorama[];
  badge?: string;
  size?: 'small' | 'medium' | 'large';
  onPress: (p: Panorama) => void;
  onVerTodos?: () => void;
};

function Section({
  titulo,
  subtitulo,
  items,
  badge,
  size = 'medium',
  onPress,
  onVerTodos,
}: SectionProps) {
  return (
    <View style={styles.seccion}>
      <Pressable style={styles.seccionHeader} onPress={onVerTodos} disabled={!onVerTodos}>
        <View style={{ flex: 1 }}>
          <Text style={styles.seccionTitulo}>{titulo}</Text>
          {subtitulo && <Text style={styles.seccionSubtitulo}>{subtitulo}</Text>}
        </View>
        {onVerTodos && <Ionicons name="chevron-forward" size={22} color="#999" />}
      </Pressable>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.seccionScroll}>
        {items.map((p) => (
          <PanoramaCardAirbnb
            key={p.id}
            panorama={p}
            onPress={() => onPress(p)}
            badge={badge}
            size={size}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  searchPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 32,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    ...(Platform.OS === 'web'
      ? ({ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' } as any)
      : {
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 3,
          shadowOffset: { width: 0, height: 1 },
          elevation: 1,
        }),
  },
  searchTitle: { fontSize: 14, fontWeight: '700', color: '#111' },
  searchSub: { fontSize: 12, color: '#888' },
  filterIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  publicarBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E94F37',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaPublicar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#fff8f6',
    borderWidth: 1,
    borderColor: '#ffe0d7',
  },
  ctaEmoji: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffe0d7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaTitle: { fontSize: 14, fontWeight: '700', color: '#111' },
  ctaDesc: { fontSize: 12, color: '#666', marginTop: 2 },
  catsScroll: { paddingHorizontal: 12, gap: 8, paddingVertical: 8 },
  catTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  catTabActive: { backgroundColor: '#111' },
  catTabTxt: { fontSize: 13, color: '#666', fontWeight: '500' },
  catTabTxtActive: { color: '#fff', fontWeight: '700' },
  avisoDefault: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f1ecff',
  },
  avisoDefaultTxt: { flex: 1, fontSize: 12, color: '#5c2fbf' },
  centro: { alignItems: 'center', justifyContent: 'center', gap: 8, padding: 32 },
  errorTxt: { fontSize: 13, color: '#c33', textAlign: 'center' },
  vacioTxt: { fontSize: 14, color: '#999' },
  reintentarBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#111',
    borderRadius: 8,
  },
  reintentarTxt: { color: '#fff', fontWeight: '600' },
  gridDisponibles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  seccion: { marginTop: 20 },
  seccionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  seccionTitulo: { fontSize: 20, fontWeight: '800', color: '#111' },
  seccionSubtitulo: { fontSize: 13, color: '#888', marginTop: 2 },
  seccionScroll: { paddingHorizontal: 16 },
  listaVertical: { marginTop: 24 },
  fabMapa: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#111',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    ...(Platform.OS === 'web'
      ? ({ boxShadow: '0 4px 16px rgba(0,0,0,0.2)' } as any)
      : {
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4,
        }),
  },
  fabMapaTxt: { color: '#fff', fontSize: 14, fontWeight: '700' },
  headerMapa: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerMapaTxt: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700' },
  bottomSheet: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    ...(Platform.OS === 'web'
      ? ({ boxShadow: '0 4px 16px rgba(0,0,0,0.15)' } as any)
      : {
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 4,
        }),
  },
  miniCard: {},
  miniNombre: { fontSize: 15, fontWeight: '700', color: '#111' },
  miniDir: { fontSize: 13, color: '#666', marginTop: 2 },
});
