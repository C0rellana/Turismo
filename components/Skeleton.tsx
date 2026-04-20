import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, type ViewStyle } from 'react-native';

type Props = {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
};

export function Skeleton({ width = '100%', height = 16, borderRadius = 6, style }: Props) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.9, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.base,
        { width: width as any, height, borderRadius, opacity },
        style,
      ]}
    />
  );
}

export function SkeletonCard({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  const h = size === 'large' ? 240 : size === 'medium' ? 200 : 160;
  const w = size === 'large' ? 300 : size === 'medium' ? 220 : 180;
  return (
    <View style={{ marginRight: 14 }}>
      <Skeleton width={w} height={h} borderRadius={14} />
      <View style={{ paddingTop: 8, gap: 6 }}>
        <Skeleton width={w * 0.7} height={14} />
        <Skeleton width={w * 0.5} height={12} />
        <Skeleton width={w * 0.4} height={12} />
      </View>
    </View>
  );
}

export function SkeletonRow({ count = 3, size }: { count?: number; size?: 'small' | 'medium' | 'large' }) {
  return (
    <View style={{ flexDirection: 'row', paddingHorizontal: 16 }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} size={size} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { backgroundColor: '#e8e8e8' },
});
