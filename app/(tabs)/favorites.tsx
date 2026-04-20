import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LugarCard } from '@/components/LugarCard';
import { useFavoritesStore } from '@/stores/useFavoritesStore';

export default function Favoritos() {
  const router = useRouter();
  const favoritos = useFavoritesStore((s) => Object.values(s.favoritos));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.titulo}>Mis favoritos</Text>
      <FlatList
        data={favoritos}
        keyExtractor={(l) => l.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 16 }}>
            <LugarCard
              lugar={item}
              onPress={() => router.push(`/lugar/${item.id}` as any)}
              fullWidth
              size="large"
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={48} color="#ccc" />
            <Text style={styles.emptyTxt}>Aún no tenés favoritos</Text>
            <Text style={styles.emptySub}>
              Tocá el corazón en cualquier lugar para guardarlo acá.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  empty: { alignItems: 'center', padding: 40, gap: 8 },
  emptyTxt: { fontSize: 16, color: '#666', fontWeight: '700' },
  emptySub: { fontSize: 13, color: '#999', textAlign: 'center' },
});
