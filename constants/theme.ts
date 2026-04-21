/**
 * Design tokens — paleta turismo Chile: tierra, bosque, océano y patrimonio.
 *
 * Verde bosque (primary): naturaleza, conciencia ambiental.
 * Azul océano (secondary): Pacífico, lagos australes.
 * Café cordillera (accent): tierra, huaso, Andes.
 * Dorado (gold): sol, trigo, patrimonio.
 * Rojo bandera (terracotta): identidad chilena, favoritos.
 */

export const colors = {
  // Primary: verde bosque Patagonia
  primary: '#2D6A4F',
  primaryDark: '#1B4332',
  primarySoft: '#D8F3DC',

  // Secondary: azul océano Pacífico
  secondary: '#1B4965',
  secondaryDark: '#0F2E44',
  secondarySoft: '#CDE6F5',

  // Accent: café cordillera
  accent: '#8B5A3C',
  accentDark: '#5C3A22',
  accentSoft: '#F4E8D8',

  // Dorado patrimonio
  gold: '#E9C46A',
  goldDark: '#C69B3F',
  goldSoft: '#FBF1D7',

  // Rojo bandera Chile (favoritos, corazones, alertas suaves)
  terracotta: '#D62828',
  terracottaDark: '#A31919',
  terracottaSoft: '#FADDDD',

  success: '#52B788',
  error: '#BA1A1A',
  warning: '#E9C46A',
  info: '#1B4965',

  // Tipografía
  text: '#1B2D20', // verde oscuro casi negro, cálido
  textMuted: '#586873',
  textSoft: '#8B9199',

  // Superficies
  surface: '#FFFFFF',
  bgSoft: '#FEFAE0', // crema trigo
  bgCard: '#F7F4EC',
  border: '#E4DFD3',
  borderSoft: '#F0ECDF',
};

export const fonts = {
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemi: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
  display: 'Fraunces_700Bold',
  displayItalic: 'Fraunces_400Regular_Italic',
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  pill: 32,
  circle: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
};

export const theme = { colors, fonts, radius, spacing, shadows };
