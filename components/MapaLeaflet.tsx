import { MapaPanoramas } from './MapaPanoramas';
import type { Lugar, UbicacionActual } from '@/lib/types';

/** Wrapper para compatibilidad: mobile usa MapaPanoramas (react-native-maps) */
export function MapaLeaflet(props: {
  ubicacion: UbicacionActual;
  lugares: Lugar[];
  onSelect: (l: Lugar) => void;
  seleccionadoId?: string;
}) {
  // En mobile redirige al componente existente con la misma API
  return (
    <MapaPanoramas
      ubicacion={props.ubicacion}
      panoramas={props.lugares as any}
      onSelect={props.onSelect as any}
      seleccionadoId={props.seleccionadoId}
    />
  );
}
