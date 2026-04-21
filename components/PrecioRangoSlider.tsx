import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius } from '@/constants/theme';
import { formatPrecio } from '@/lib/distance';

type Nivel = 1 | 2 | 3 | 4;

type Props = {
  min: 0 | 1 | 2 | 3 | 4;
  max: 0 | 1 | 2 | 3 | 4;
  onChange: (min: 0 | 1 | 2 | 3 | 4, max: 0 | 1 | 2 | 3 | 4) => void;
};

const PASOS: Nivel[] = [1, 2, 3, 4];

export function PrecioRangoSlider({ min, max, onChange }: Props) {
  // Normalize 0 → 1 si user activa rango
  const minN: Nivel = (min < 1 ? 1 : min) as Nivel;
  const maxN: Nivel = (max < 1 ? 4 : max) as Nivel;
  // pct en rango [1..4] → 0..100
  const pct = (v: number) => ((v - 1) / 3) * 100;

  return (
    <View style={styles.wrap}>
      <View style={styles.valores}>
        <View style={styles.valorCol}>
          <Text style={styles.valorLabel}>Mín</Text>
          <Text style={styles.valorTxt}>{formatPrecio(minN)}</Text>
        </View>
        <Ionicons name="remove" size={16} color={colors.textMuted} />
        <View style={styles.valorCol}>
          <Text style={styles.valorLabel}>Máx</Text>
          <Text style={styles.valorTxt}>{formatPrecio(maxN)}</Text>
        </View>
      </View>

      {/* Track */}
      <View style={styles.trackWrap}>
        <View style={styles.track} />
        <View
          style={[
            styles.trackActive,
            {
              left: `${pct(minN)}%`,
              width: `${pct(maxN) - pct(minN)}%`,
            },
          ]}
        />
        {PASOS.map((p) => (
          <View
            key={p}
            style={[
              styles.tick,
              { left: `${pct(p)}%` },
              p >= minN && p <= maxN && styles.tickActive,
            ]}
          />
        ))}
      </View>

      {/* Botones mínimo */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Mínimo</Text>
        <View style={styles.chipsRow}>
          {PASOS.map((p) => (
            <Chip
              key={`min-${p}`}
              label={formatPrecio(p)}
              activo={minN === p}
              onPress={() => onChange(p, p > maxN ? p : maxN)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Máximo</Text>
        <View style={styles.chipsRow}>
          {PASOS.map((p) => (
            <Chip
              key={`max-${p}`}
              label={formatPrecio(p)}
              activo={maxN === p}
              onPress={() => onChange(p < minN ? p : minN, p)}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

function Chip({
  label,
  activo,
  onPress,
}: {
  label: string;
  activo: boolean;
  onPress: () => void;
}) {
  const { Pressable } = require('react-native');
  return (
    <Pressable onPress={onPress} style={[chipStyles.chip, activo && chipStyles.chipActivo]}>
      <Text style={[chipStyles.txt, activo && chipStyles.txtActivo]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 14 },
  valores: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  valorCol: { alignItems: 'center', flex: 1 },
  valorLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  valorTxt: { fontSize: 18, color: colors.primary, fontFamily: fonts.bodyBold, marginTop: 2 },
  trackWrap: {
    height: 30,
    justifyContent: 'center',
    paddingHorizontal: 6,
    position: 'relative',
  },
  track: {
    height: 4,
    backgroundColor: colors.borderSoft,
    borderRadius: 2,
  },
  trackActive: {
    position: 'absolute',
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
    top: '50%',
    marginTop: -2,
  },
  tick: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.borderSoft,
    top: '50%',
    marginTop: -7,
    marginLeft: -7,
  },
  tickActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  section: { gap: 6 },
  sectionLabel: {
    fontSize: 11,
    fontFamily: fonts.bodyBold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipsRow: { flexDirection: 'row', gap: 8 },
});

const chipStyles = StyleSheet.create({
  chip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  chipActivo: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  txt: { fontSize: 14, fontFamily: fonts.bodyBold, color: colors.textMuted },
  txtActivo: { color: colors.primaryDark },
});
