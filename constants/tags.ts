import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

type IonName = ComponentProps<typeof Ionicons>['name'];

export type TagId =
  | 'pet-friendly'
  | 'lgbt-friendly'
  | 'accesible-silla-ruedas'
  | 'apto-bebes'
  | 'wifi-gratis'
  | 'estacionamiento'
  | 'terraza'
  | 'aire-acondicionado'
  | 'reservar-antes'
  | 'solo-efectivo';

type TagDef = { id: TagId; label: string; icon: IonName; color: string };

export const TAGS: TagDef[] = [
  { id: 'pet-friendly', label: 'Pet-friendly', icon: 'paw', color: '#FFB400' },
  { id: 'lgbt-friendly', label: 'LGBT+', icon: 'heart-circle', color: '#FF5E9E' },
  { id: 'accesible-silla-ruedas', label: 'Accesible', icon: 'accessibility', color: '#3A86FF' },
  { id: 'apto-bebes', label: 'Apto bebés', icon: 'happy-outline', color: '#06A77D' },
  { id: 'wifi-gratis', label: 'Wifi gratis', icon: 'wifi', color: '#8338EC' },
  { id: 'estacionamiento', label: 'Estacionamiento', icon: 'car', color: '#666' },
  { id: 'terraza', label: 'Terraza', icon: 'sunny', color: '#E94F37' },
  { id: 'aire-acondicionado', label: 'A/C', icon: 'snow', color: '#44AF69' },
  { id: 'reservar-antes', label: 'Reservar antes', icon: 'calendar', color: '#FF9500' },
  { id: 'solo-efectivo', label: 'Solo efectivo', icon: 'cash', color: '#999' },
];

export const TAGS_MAP = TAGS.reduce<Record<string, TagDef>>((acc, t) => {
  acc[t.id] = t;
  return acc;
}, {});
