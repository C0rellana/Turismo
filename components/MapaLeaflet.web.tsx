import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { CATEGORIAS_MAP } from '@/constants/categories';
import type { Lugar, UbicacionActual } from '@/lib/types';

type Props = {
  ubicacion: UbicacionActual;
  lugares: Lugar[];
  onSelect: (l: Lugar) => void;
  seleccionadoId?: string;
};

export function MapaLeaflet({ ubicacion, lugares, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const LRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = await import('leaflet');
      await import('leaflet/dist/leaflet.css');
      if (cancelled || !containerRef.current || mapRef.current) return;

      LRef.current = L;
      const map = L.map(containerRef.current).setView([ubicacion.lat, ubicacion.lng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      // Marker ubicación actual
      L.circleMarker([ubicacion.lat, ubicacion.lng], {
        radius: 8,
        color: '#fff',
        fillColor: '#3A86FF',
        fillOpacity: 1,
        weight: 3,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;

      // Bordes regiones Chile (GeoJSON público)
      try {
        const resp = await fetch(
          'https://raw.githubusercontent.com/caracena/chile-geojson/master/regiones.json',
        );
        if (resp.ok) {
          const geo = await resp.json();
          if (cancelled) return;
          L.geoJSON(geo, {
            style: () => ({
              color: '#E94F37',
              weight: 1.5,
              opacity: 0.35,
              fillColor: '#E94F37',
              fillOpacity: 0.03,
              dashArray: '3, 4',
            }),
            onEachFeature: (feature: any, layer: any) => {
              const nombre =
                feature.properties?.Region ?? feature.properties?.nombre ?? 'Región';
              layer.bindTooltip(nombre, { sticky: true, direction: 'center' });
              layer.on({
                mouseover: (e: any) => {
                  e.target.setStyle({ weight: 3, opacity: 0.8, fillOpacity: 0.15 });
                },
                mouseout: (e: any) => {
                  e.target.setStyle({ weight: 1.5, opacity: 0.35, fillOpacity: 0.03 });
                },
              });
            },
          }).addTo(map);
        }
      } catch (e) {
        console.warn('[regiones geojson]', e);
      }
    })();
    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redraw markers al cambiar lugares
  useEffect(() => {
    const L = LRef.current;
    if (!L || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();
    for (const l of lugares) {
      const cat = CATEGORIAS_MAP[l.categoria];
      const icon = L.divIcon({
        html: `<div style="background:${cat.color};width:22px;height:22px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 22],
      });
      const mk = L.marker([l.lat, l.lng], { icon }).addTo(markersLayerRef.current);
      const popup = `
        <div style="min-width:200px">
          <div style="font-weight:700;font-size:14px;margin-bottom:4px">${l.nombre}</div>
          <div style="color:#666;font-size:12px">${l.direccion ?? ''}</div>
          <div style="color:#E94F37;font-size:11px;margin-top:4px;cursor:pointer" data-id="${l.id}">Ver detalle →</div>
        </div>`;
      mk.bindPopup(popup);
      mk.on('popupopen', (e: any) => {
        const link = e.popup.getElement()?.querySelector(`[data-id="${l.id}"]`);
        if (link) link.addEventListener('click', () => onSelect(l));
      });
    }
  }, [lugares, onSelect]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView([ubicacion.lat, ubicacion.lng]);
    }
  }, [ubicacion.lat, ubicacion.lng]);

  return (
    <View style={styles.container}>
      <div ref={containerRef as any} style={{ width: '100%', height: '100%' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 400 },
});
