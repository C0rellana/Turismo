import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';
import type { CategoriaDef } from '@/constants/categories';

type Props = {
  categoria: CategoriaDef;
  activa: boolean;
  onPress: () => void;
};

export function CategoryChip({ categoria, activa, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        activa && { backgroundColor: categoria.color, borderColor: categoria.color },
      ]}
    >
      <Ionicons
        name={categoria.icono as keyof typeof Ionicons.glyphMap}
        size={16}
        color={activa ? '#fff' : categoria.color}
      />
      <Text style={[styles.text, activa && styles.textActive]}>{categoria.nombre}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  text: { fontSize: 13, fontWeight: '500', color: '#333' },
  textActive: { color: '#fff' },
});
