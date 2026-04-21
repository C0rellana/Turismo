import { StyleSheet, View } from 'react-native';

type Props = { size?: number };

/** Bandera chilena estilizada. Proporción 3:2. */
export function FlagChile({ size = 20 }: Props) {
  const w = size;
  const h = size * (2 / 3);
  const mitad = h / 2;
  const ancho_azul = mitad; // Cuadrado azul proporcional
  const estrella = mitad * 0.5;

  return (
    <View style={[styles.flag, { width: w, height: h }]}>
      {/* Banda roja (inferior) */}
      <View style={[styles.roja, { height: mitad, backgroundColor: '#D52B1E' }]} />
      {/* Banda blanca (superior derecha) */}
      <View
        style={[
          styles.blanca,
          {
            left: ancho_azul,
            height: mitad,
            backgroundColor: '#fff',
          },
        ]}
      />
      {/* Cuadrado azul (superior izquierda) */}
      <View style={[styles.azul, { width: ancho_azul, height: mitad, backgroundColor: '#0039A6' }]}>
        <View
          style={[
            styles.estrella,
            {
              top: mitad / 2 - estrella / 2,
              left: ancho_azul / 2 - estrella / 2,
              width: estrella,
              height: estrella,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flag: { overflow: 'hidden', borderRadius: 2, position: 'relative' },
  roja: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  blanca: { position: 'absolute', top: 0, right: 0 },
  azul: { position: 'absolute', top: 0, left: 0 },
  estrella: {
    position: 'absolute',
    backgroundColor: '#fff',
    transform: [{ rotate: '45deg' }],
  },
});
