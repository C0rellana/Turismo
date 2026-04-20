import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PanoramaCard } from '@/components/PanoramaCard';
import { useFavoritesStore } from '@/stores/useFavoritesStore';

export default function Favorites() {
  const router = useRouter();
  const favoritos = useFavoritesStore((s) => Object.values(s.favoritos));
  const remove = useFavoritesStore((s) => s.remove);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Favoritos</Text>
      </View>

      {favoritos.length === 0 ? (
        <View style={styles.vacio}>
          <Ionicons name="heart-outline" size={48} color="#ccc" />
          <Text style={styles.vacioTxt}>Sin favoritos todavía</Text>
          <Text style={styles.vacioSub}>
            Tocá el corazón en cualquier panorama para guardarlo acá.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoritos}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ paddingVertical: 6, paddingBottom: 24 }}
          renderItem={({ item }) => (
            <View>
              <PanoramaCard panorama={item} onPress={() => router.push(`/panorama/${item.id}`)} />
              <Pressable style={styles.remove} onPress={() => remove(item.id)}>
                <Ionicons name="trash-outline" size={16} color="#c33" />
              </Pressable>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  titulo: { fontSize: 26, fontWeight: '700', color: '#111' },
  vacio: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 32 },
  vacioTxt: { fontSize: 16, fontWeight: '600', color: '#555' },
  vacioSub: { fontSize: 13, color: '#888', textAlign: 'center' },
  remove: {
    position: 'absolute',
    top: 14,
    right: 22,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
});
