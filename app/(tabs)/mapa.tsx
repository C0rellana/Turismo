import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoryTabs } from '@/components/CategoryTabs';
import { LugarCard } from '@/components/LugarCard';
import { MapaLeaflet } from '@/components/MapaLeaflet';
import { SearchPill } from '@/components/SearchPill';
import { ZonaPicker } from '@/components/ZonaPicker';
import { useNearbyLugares } from '@/hooks/useNearbyLugares';
import type { Lugar, TipoLugar } from '@/lib/types';
import { useLocationStore } from '@/stores/useLocationStore';

type Filtro = 'todos' | 'turistico' | 'panorama';

export default function Mapa() {
  const router = useRouter();
  const ubicacion = useLocationStore((s) => s.ubicacion);
  const solicitar = useLocationStore((s) => s.solicitar);
  const custom = useLocationStore((s) => s.custom);
  const limpiarCustom = useLocationStore((s) => s.limpiarCustom);
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [seleccionado, setSeleccionado] = useState<Lugar | null>(null);
  const [zonaOpen, setZonaOpen] = useState(false);

  const [q, setQ] = useState('');
  const [qDebounced, setQDebounced] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setQDebounced(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  const tipos: TipoLugar[] | undefined = filtro === 'todos' ? undefined : [filtro];
  const { lugares, estado } = useNearbyLugares({
    tipos,
    q: qDebounced,
    pageSize: 200,
  });

  useEffect(() => {
    if (!ubicacion) void solicitar();
  }, [ubicacion, solicitar]);

  if (!ubicacion) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingBox}>
          <ActivityIndicator />
          <Text style={styles.loadingTxt}>Solicitando ubicación...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Mapa</Text>
        <Pressable style={styles.btnZona} onPress={() => setZonaOpen(true)}>
          <Ionicons name="location" size={14} color="#fff" />
          <Text style={styles.btnZonaTxt}>
            {custom?.label ?? (ubicacion?.esDefault ? 'Santiago' : 'Mi ubicación')}
          </Text>
          <Ionicons name="chevron-down" size={14} color="#fff" />
        </Pressable>
      </View>

      {custom && (
        <View style={styles.bannerCustom}>
          <Ionicons name="information-circle" size={14} color="#5c2fbf" />
          <Text style={styles.bannerCustomTxt}>
            Zona custom: <Text style={{ fontWeight: '700' }}>{custom.label}</Text>
          </Text>
          <Pressable onPress={limpiarCustom}>
            <Text style={styles.bannerLink}>Volver a mi ubicación</Text>
          </Pressable>
        </View>
      )}

      <SearchPill value={q} onChange={setQ} placeholder="Buscar en el mapa..." />

      {/* Filtros tipo */}
      <View style={styles.filtrosRow}>
        {(['todos', 'turistico', 'panorama'] as Filtro[]).map((f) => {
          const activo = filtro === f;
          const label = f === 'todos' ? 'Todos' : f === 'turistico' ? 'Turísticos' : 'Panoramas';
          const icon = f === 'todos' ? 'earth' : f === 'turistico' ? 'location' : 'sparkles';
          return (
            <Pressable
              key={f}
              onPress={() => setFiltro(f)}
              style={[styles.filtroChip, activo && styles.filtroChipActive]}>
              <Ionicons name={icon as any} size={14} color={activo ? '#fff' : '#666'} />
              <Text style={[styles.filtroTxt, activo && styles.filtroTxtActive]}>{label}</Text>
            </Pressable>
          );
        })}
        {estado === 'cargando' && (
          <View style={styles.loadingInline}>
            <ActivityIndicator size="small" />
          </View>
        )}
      </View>

      <CategoryTabs />

      <View style={{ flex: 1 }}>
        <MapaLeaflet
          ubicacion={ubicacion}
          lugares={lugares}
          seleccionadoId={seleccionado?.id}
          onSelect={setSeleccionado}
        />

        {seleccionado && (
          <View style={styles.bottomSheet}>
            <LugarCard
              lugar={seleccionado}
              onPress={() => router.push(`/lugar/${seleccionado.id}` as any)}
              fullWidth
              size="medium"
            />
            <Pressable onPress={() => setSeleccionado(null)} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#111" />
            </Pressable>
          </View>
        )}

        <View style={styles.contador}>
          <Text style={styles.contadorTxt}>{lugares.length} lugares</Text>
        </View>
      </View>

      <ZonaPicker visible={zonaOpen} onClose={() => setZonaOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titulo: { fontSize: 26, fontWeight: '800', color: '#111' },
  btnZona: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#111',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  btnZonaTxt: { color: '#fff', fontSize: 13, fontWeight: '700' },
  bannerCustom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f1ecff',
  },
  bannerCustomTxt: { flex: 1, fontSize: 12, color: '#5c2fbf' },
  bannerLink: { fontSize: 12, fontWeight: '700', color: '#E94F37' },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  loadingTxt: { color: '#666', fontSize: 13 },
  filtrosRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  filtroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  filtroChipActive: { backgroundColor: '#111' },
  filtroTxt: { fontSize: 13, color: '#666', fontWeight: '700' },
  filtroTxtActive: { color: '#fff' },
  loadingInline: { marginLeft: 'auto' },
  bottomSheet: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    elevation: 4,
  },
  closeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contador: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  contadorTxt: { color: '#fff', fontSize: 11, fontWeight: '700' },
});
