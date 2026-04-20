import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { CATEGORIAS } from '@/constants/categories';
import type { CategoriaId } from '@/lib/types';
import { useFiltersStore } from '@/stores/useFiltersStore';

/** Chips de categorías compartido entre Explorar, Mapa, Panoramas. */
export function CategoryTabs() {
  const { categorias, setCategorias } = useFiltersStore();

  const toggle = (c: CategoriaId) => {
    if (categorias.includes(c)) setCategorias([]);
    else setCategorias([c]);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.wrap}
      contentContainerStyle={styles.scroll}>
      <Pressable
        onPress={() => setCategorias([])}
        style={[styles.tab, categorias.length === 0 && styles.tabActive]}>
        <Ionicons
          name="sparkles"
          size={18}
          color={categorias.length === 0 ? '#fff' : '#888'}
        />
        <Text style={[styles.txt, categorias.length === 0 && styles.txtActive]}>Todo</Text>
      </Pressable>
      {CATEGORIAS.map((cat) => {
        const activo = categorias.includes(cat.id);
        return (
          <Pressable
            key={cat.id}
            onPress={() => toggle(cat.id)}
            style={[styles.tab, activo && styles.tabActive]}>
            <Ionicons name={cat.icono as any} size={18} color={activo ? cat.color : '#888'} />
            <Text style={[styles.txt, activo && { color: cat.color }]}>{cat.nombre}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { flexGrow: 0, flexShrink: 0, maxHeight: 56 },
  scroll: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
    alignSelf: 'center',
  },
  tabActive: { backgroundColor: '#111' },
  txt: { fontSize: 13, color: '#666', fontWeight: '700' },
  txtActive: { color: '#fff' },
});
