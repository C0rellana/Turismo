import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

type Props = {
  value: string;
  onChange: (q: string) => void;
  placeholder?: string;
  onOpenFilters?: () => void;
};

export function SearchPill({ value, onChange, placeholder, onOpenFilters }: Props) {
  const router = useRouter();
  const openFilters = onOpenFilters ?? (() => router.push('/filters' as any));

  return (
    <View style={styles.wrap}>
      <View style={styles.pill}>
        <Ionicons name="search" size={18} color="#666" />
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder ?? 'Buscar...'}
          placeholderTextColor="#999"
          style={styles.input}
        />
        {value.length > 0 && (
          <Pressable onPress={() => onChange('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color="#999" />
          </Pressable>
        )}
        <Pressable onPress={openFilters} style={styles.filterBtn}>
          <Ionicons name="options" size={16} color="#111" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingBottom: 10 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 32,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  input: { flex: 1, fontSize: 14, color: '#111', outlineStyle: 'none' as any },
  filterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
});
