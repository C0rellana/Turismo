export function formatDistancia(metros: number | undefined): string {
  if (metros == null) return '';
  if (metros < 1000) return `${Math.round(metros)} m`;
  return `${(metros / 1000).toFixed(1)} km`;
}

/**
 * Precio niveles (CLP):
 * 0 = Gratis
 * 1 = ~$10.000
 * 2 = ~$30.000
 * 3 = ~$50.000
 * 4 = +$100.000
 */
export function formatPrecio(nivel: 0 | 1 | 2 | 3 | 4): string {
  switch (nivel) {
    case 0:
      return 'Gratis';
    case 1:
      return '$10k';
    case 2:
      return '$30k';
    case 3:
      return '$50k';
    case 4:
      return '+$100k';
    default:
      return '$';
  }
}

export function formatPrecioLargo(nivel: 0 | 1 | 2 | 3 | 4): string {
  switch (nivel) {
    case 0:
      return 'Gratis';
    case 1:
      return 'Hasta $10.000';
    case 2:
      return 'Hasta $30.000';
    case 3:
      return 'Hasta $50.000';
    case 4:
      return 'Más de $100.000';
    default:
      return 'Sin info';
  }
}

export const PRECIO_NIVELES = [0, 1, 2, 3, 4] as const;
export const PRECIO_MAX_NIVEL = 4;
