import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CIUDADES_CHILE } from '@/constants/ciudades';
import { useLocationStore } from '@/stores/useLocationStore';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function ZonaPicker({ visible, onClose }: Props) {
  const { setCustom, limpiarCustom, custom, gps } = useLocationStore();
  const [busqueda, setBusqueda] = useState('');

  const filtradas = useMemo(() => {
    if (!busqueda.trim()) return CIUDADES_CHILE;
    const q = busqueda.trim().toLowerCase();
    return CIUDADES_CHILE.filter(
      (c) => c.nombre.toLowerCase().includes(q) || c.region.toLowerCase().includes(q),
    );
  }, [busqueda]);

  const seleccionar = (nombre: string, lat: number, lng: number) => {
    setCustom(lat, lng, nombre);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={24} color="#111" />
          </Pressable>
          <Text style={styles.titulo}>Cambiar zona</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.searchWrap}>
          <View style={styles.searchPill}>
            <Ionicons name="search" size={16} color="#666" />
            <TextInput
              value={busqueda}
              onChangeText={setBusqueda}
              placeholder="Buscar ciudad o región..."
              placeholderTextColor="#999"
              style={styles.searchInput}
            />
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
          {/* Banner actual */}
          {custom && (
            <View style={styles.actualBanner}>
              <Ionicons name="location" size={16} color="#E94F37" />
              <Text style={styles.actualTxt}>
                Actual: <Text style={{ fontWeight: '700' }}>{custom.label ?? 'Custom'}</Text>
              </Text>
            </View>
          )}

          {/* Volver a GPS */}
          {gps && !gps.esDefault && (
            <Pressable
              style={styles.item}
              onPress={() => {
                limpiarCustom();
                onClose();
              }}>
              <View style={[styles.iconBox, { backgroundColor: '#3A86FF' }]}>
                <Ionicons name="navigate" size={16} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitulo}>Mi ubicación (GPS)</Text>
                <Text style={styles.itemSub}>Usar ubicación real del dispositivo</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </Pressable>
          )}

          <Text style={styles.seccion}>Ciudades destacadas</Text>
          {filtradas.map((c) => {
            const activa = custom?.label === c.nombre;
            return (
              <Pressable
                key={c.nombre}
                style={[styles.item, activa && styles.itemActivo]}
                onPress={() => seleccionar(c.nombre, c.lat, c.lng)}>
                <View style={styles.iconBox}>
                  <Ionicons name="business" size={16} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitulo}>{c.nombre}</Text>
                  <Text style={styles.itemSub}>Región de {c.region}</Text>
                </View>
                {activa ? (
                  <Ionicons name="checkmark-circle" size={20} color="#E94F37" />
                ) : (
                  <Ionicons name="chevron-forward" size={18} color="#ccc" />
                )}
              </Pressable>
            );
          })}

          {filtradas.length === 0 && (
            <Text style={styles.vacio}>Sin resultados para "{busqueda}"</Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  titulo: { fontSize: 17, fontWeight: '800', color: '#111' },
  searchWrap: { padding: 16, paddingBottom: 8 },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fafafa',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchInput: { flex: 1, fontSize: 14, color: '#111', outlineStyle: 'none' as any },
  actualBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FFF5F3',
  },
  actualTxt: { fontSize: 13, color: '#444' },
  seccion: {
    fontSize: 12,
    fontWeight: '700',
    color: '#888',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    letterSpacing: 0.5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  itemActivo: { backgroundColor: '#FFF5F3' },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitulo: { fontSize: 15, color: '#111', fontWeight: '600' },
  itemSub: { fontSize: 12, color: '#888', marginTop: 2 },
  vacio: { fontSize: 13, color: '#888', textAlign: 'center', padding: 20 },
});
