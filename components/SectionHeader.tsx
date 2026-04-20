import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  titulo: string;
  subtitulo?: string;
  onVerTodos?: () => void;
};

export function SectionHeader({ titulo, subtitulo, onVerTodos }: Props) {
  return (
    <Pressable style={styles.wrap} onPress={onVerTodos} disabled={!onVerTodos}>
      <View style={{ flex: 1 }}>
        <Text style={styles.titulo}>{titulo}</Text>
        {subtitulo && <Text style={styles.sub}>{subtitulo}</Text>}
      </View>
      {onVerTodos && <Ionicons name="chevron-forward" size={22} color="#999" />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 20,
  },
  titulo: { fontSize: 20, fontWeight: '800', color: '#111' },
  sub: { fontSize: 13, color: '#888', marginTop: 2 },
});
