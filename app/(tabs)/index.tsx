import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CoachMark } from '@/components/CoachMark';
import { LugarCard } from '@/components/LugarCard';
import { SectionHeader } from '@/components/SectionHeader';
import { SkeletonRow } from '@/components/Skeleton';
import { WelcomeCTA } from '@/components/WelcomeCTA';
import { useNearbyLugares } from '@/hooks/useNearbyLugares';
import { usePanoramasProximos } from '@/hooks/usePanoramasProximos';
import { useRecientes } from '@/hooks/useRecientes';
import { useTopFavoritos } from '@/hooks/useTopFavoritos';
import { DEMO_LUGARES } from '@/lib/demoLugares';
import type { Lugar } from '@/lib/types';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLocationStore } from '@/stores/useLocationStore';

export default function Inicio() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const ubicacion = useLocationStore((s) => s.ubicacion);
  const solicitar = useLocationStore((s) => s.solicitar);

  const { lugares: cercanos, estado, refetch } = useNearbyLugares({ pageSize: 8 });
  const { lugares: topFavs } = useTopFavoritos(8);
  const { lugares: recientes } = useRecientes(8);
  const { lugares: proximos } = usePanoramasProximos(30, 8);

  useEffect(() => {
    if (!ubicacion) void solicitar();
  }, [ubicacion, solicitar]);

  const saludo = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 19) return 'Buenas tardes';
    return 'Buenas noches';
  })();

  const nombre =
    (user?.user_metadata?.full_name as string)?.split(' ')[0] ??
    (user?.user_metadata?.name as string)?.split(' ')[0] ??
    'explorador';

  const abrirDetalle = (l: Lugar) => router.push(`/lugar/${l.id}` as any);

  const cargandoInicial = estado === 'cargando' && cercanos.length === 0;

  // A.2 Demo mode: si guest + sin resultados reales, mostrar mock
  const modoDemoActivo = !user && cercanos.length === 0 && estado === 'ok';
  const cercanosShow = modoDemoActivo ? DEMO_LUGARES.slice(0, 6) : cercanos;
  const topFavsShow = modoDemoActivo ? DEMO_LUGARES.slice(2, 6) : topFavs;
  const recientesShow = modoDemoActivo ? DEMO_LUGARES.slice(1, 5) : recientes;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CoachMark
        id="inicio-welcome"
        titulo="¡Bienvenido!"
        mensaje="Explorá lugares turísticos, panoramas y eventos. Tocá las cards para ver más."
      />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={estado === 'cargando'} onRefresh={refetch} />}>
        {/* Header saludo + zona */}
        <View style={styles.hero}>
          <Text style={styles.saludo}>
            {saludo}, {nombre} 👋
          </Text>
          <View style={styles.heroRow}>
            <Ionicons name="location" size={14} color="#E94F37" />
            <Text style={styles.heroSub}>
              {ubicacion?.esDefault
                ? 'Santiago centro (ubicación por defecto)'
                : 'Tu zona actual'}
            </Text>
          </View>
        </View>

        {/* WelcomeCTA guest */}
        {!user && <WelcomeCTA />}

        {/* Bloque Tu zona — CTA explorar zona */}
        <Pressable
          style={styles.bloqueZona}
          onPress={() => router.push('/(tabs)/explorar' as any)}>
          <View style={styles.bloqueZonaHero}>
            <Ionicons name="earth" size={36} color="#fff" />
            <View style={{ flex: 1 }}>
              <Text style={styles.bloqueZonaTitle}>Descubrí tu zona</Text>
              <Text style={styles.bloqueZonaSub}>
                Lugares turísticos y panoramas a tu alrededor
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#fff" />
          </View>
        </Pressable>

        {/* Cerca de ti */}
        <SectionHeader
          titulo="Cerca de ti"
          subtitulo="Lugares y panoramas a pocos km"
          onVerTodos={() => router.push('/seccion/cerca' as any)}
        />
        {cargandoInicial ? (
          <SkeletonRow size="medium" />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
            {cercanosShow.map((l) => (
              <LugarCard key={l.id} lugar={l} onPress={() => abrirDetalle(l)} size="medium" />
            ))}
          </ScrollView>
        )}

        {modoDemoActivo && (
          <View style={styles.demoBadge}>
            <Ionicons name="flask" size={14} color="#8338EC" />
            <Text style={styles.demoBadgeTxt}>
              Modo demo — datos de ejemplo. Iniciá sesión para ver lugares reales.
            </Text>
          </View>
        )}

        {/* Próximos panoramas */}
        {proximos.length > 0 && (
          <>
            <SectionHeader
              titulo="Próximos panoramas"
              subtitulo="Eventos esta semana"
              onVerTodos={() => router.push('/(tabs)/panoramas' as any)}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
              {proximos.map((l) => (
                <LugarCard
                  key={l.id}
                  lugar={l}
                  onPress={() => abrirDetalle(l)}
                  size="medium"
                  badge="Próximo"
                />
              ))}
            </ScrollView>
          </>
        )}

        {/* Destacados (top favoritos) */}
        {topFavsShow.length > 0 && (
          <>
            <SectionHeader
              titulo="Destacados"
              subtitulo="Lo más guardado por la comunidad"
              onVerTodos={() => router.push('/seccion/favoritos' as any)}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
              {topFavsShow.map((l) => (
                <LugarCard
                  key={l.id}
                  lugar={l}
                  onPress={() => abrirDetalle(l)}
                  size="large"
                  badge="Top"
                />
              ))}
            </ScrollView>
          </>
        )}

        {/* Recién agregados */}
        {recientesShow.length > 0 && (
          <>
            <SectionHeader
              titulo="Recién agregados"
              subtitulo="Nuevos lugares en la comunidad"
              onVerTodos={() => router.push('/seccion/recientes' as any)}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
              {recientesShow.map((l) => (
                <LugarCard
                  key={l.id}
                  lugar={l}
                  onPress={() => abrirDetalle(l)}
                  size="small"
                  badge="Nuevo"
                />
              ))}
            </ScrollView>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  hero: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  saludo: { fontSize: 24, fontWeight: '800', color: '#111' },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  heroSub: { fontSize: 13, color: '#666' },
  bloqueZona: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 18,
    backgroundColor: '#E94F37',
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? ({ boxShadow: '0 4px 16px rgba(233,79,55,0.25)' } as any)
      : {
          shadowColor: '#E94F37',
          shadowOpacity: 0.25,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4,
        }),
  },
  bloqueZonaHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 20,
  },
  bloqueZonaTitle: { fontSize: 17, fontWeight: '800', color: '#fff' },
  bloqueZonaSub: { fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 2 },
  hScroll: { paddingHorizontal: 16 },
  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f1ecff',
  },
  demoBadgeTxt: { flex: 1, fontSize: 12, color: '#5c2fbf' },
});
