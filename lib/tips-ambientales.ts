import type { Tip } from './regiones-info';

/** Tips de cuidado ambiental universales aplicables a toda Chile. */
export const TIPS_AMBIENTALES: Tip[] = [
  {
    titulo: 'Lleva tu basura',
    descripcion: 'No la dejes en senderos, playas ni miradores. Chile es de todos.',
    icono: 'trash',
  },
  {
    titulo: 'Botella reutilizable',
    descripcion: 'Agua de las cordilleras es potable en muchas zonas. Evita plástico.',
    icono: 'water',
  },
  {
    titulo: 'Respeta la flora nativa',
    descripcion: 'No arranques plantas. Copihue y queñoas son patrimonio.',
    icono: 'leaf',
  },
  {
    titulo: 'Fogatas con cuidado',
    descripcion: 'Solo en zonas habilitadas. Los incendios forestales destruyen años.',
    icono: 'flame',
  },
  {
    titulo: 'Fauna silvestre',
    descripcion: 'Observa a distancia. No alimentes zorros, pudúes ni guanacos.',
    icono: 'paw',
  },
  {
    titulo: 'Compra local',
    descripcion: 'Artesanía y comida de productores. Sostén la economía de cada región.',
    icono: 'basket',
  },
];
