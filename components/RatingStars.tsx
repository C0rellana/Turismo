import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

type Props = {
  rating: number;
  onChange?: (r: number) => void;
  size?: number;
  color?: string;
};

export function RatingStars({ rating, onChange, size = 18, color = '#FFB400' }: Props) {
  const interactivo = !!onChange;
  const rounded = Math.round(rating);

  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((n) => {
        const activa = n <= rounded;
        const icono: any = activa ? 'star' : 'star-outline';
        const Comp: any = interactivo ? Pressable : View;
        return (
          <Comp
            key={n}
            hitSlop={8}
            onPress={interactivo ? () => onChange(n) : undefined}
            style={styles.star}>
            <Ionicons name={icono} size={size} color={activa ? color : '#ccc'} />
          </Comp>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 2 },
  star: {},
});
