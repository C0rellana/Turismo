export function formatDistancia(metros: number | undefined): string {
  if (metros == null) return '';
  if (metros < 1000) return `${Math.round(metros)} m`;
  return `${(metros / 1000).toFixed(1)} km`;
}

export function formatPrecio(nivel: 0 | 1 | 2 | 3): string {
  if (nivel === 0) return 'Gratis';
  return '$'.repeat(nivel);
}
