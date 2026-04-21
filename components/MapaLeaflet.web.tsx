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
  const readyRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const leafletMod: any = await import('leaflet');
      const L = leafletMod.default ?? leafletMod;
      await import('leaflet/dist/leaflet.css');
      // Expose L global para plugins
      if (typeof window !== 'undefined') (window as any).L = L;

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
        fillColor: '#1B4965',
        fillOpacity: 1,
        weight: 3,
      }).addTo(map);

      // Intentar cargar markercluster. Si falla, fallback a LayerGroup.
      let cluster: any = null;
      try {
        await import('leaflet.markercluster');
        await import('leaflet.markercluster/dist/MarkerCluster.css');
        await import('leaflet.markercluster/dist/MarkerCluster.Default.css');
        if ((L as any).markerClusterGroup) {
          cluster = (L as any).markerClusterGroup({
            showCoverageOnHover: false,
            spiderfyOnMaxZoom: true,
            maxClusterRadius: 55,
            iconCreateFunction: (c: any) => {
              const count = c.getChildCount();
              let size = 38;
              let bg = '#2D6A4F';
              if (count >= 50) {
                size = 56;
                bg = '#D62828';
              } else if (count >= 20) {
                size = 48;
                bg = '#8B5A3C';
              } else if (count >= 10) {
                size = 42;
                bg = '#1B4965';
              }
              return L.divIcon({
                html: `<div style="background:${bg};color:#fff;width:${size}px;height:${size}px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">${count}</div>`,
                className: 'custom-cluster',
                iconSize: [size, size],
              });
            },
          });
        }
      } catch (e) {
        console.warn('[markercluster no disponible]', e);
      }

      // Fallback si cluster no existe
      if (!cluster) cluster = L.layerGroup();
      map.addLayer(cluster);
      markersLayerRef.current = cluster;
      mapRef.current = map;
      readyRef.current = true;

      // Renderizar markers iniciales si ya hay lugares
      renderMarkers(L, cluster, lugares, onSelect);

      // Bordes regiones Chile (GeoJSON)
      try {
        const resp = await fetch(
          'https://raw.githubusercontent.com/caracena/chile-geojson/master/regiones.json',
        );
        if (resp.ok) {
          const geo = await resp.json();
          if (cancelled) return;
          L.geoJSON(geo, {
            style: () => ({
              color: '#1B4965',
              weight: 1.5,
              opacity: 0.35,
              fillColor: '#1B4965',
              fillOpacity: 0.04,
              dashArray: '3, 4',
            }),
            onEachFeature: (feature: any, layer: any) => {
              const nombre =
                feature.properties?.Region ?? feature.properties?.nombre ?? 'Región';
              layer.bindTooltip(nombre, { sticky: true, direction: 'center' });
              layer.on({
                mouseover: (e: any) =>
                  e.target.setStyle({ weight: 3, opacity: 0.8, fillOpacity: 0.15 }),
                mouseout: (e: any) =>
                  e.target.setStyle({ weight: 1.5, opacity: 0.35, fillOpacity: 0.04 }),
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
    if (!readyRef.current) return;
    const L = LRef.current;
    if (!L || !markersLayerRef.current) return;
    renderMarkers(L, markersLayerRef.current, lugares, onSelect);
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

function renderMarkers(L: any, layer: any, lugares: Lugar[], onSelect: (l: Lugar) => void) {
  layer.clearLayers();
  for (const l of lugares) {
    const cat = CATEGORIAS_MAP[l.categoria];
    const color = cat?.color ?? '#2D6A4F';
    const icon = L.divIcon({
      html: `<div style="background:${color};width:22px;height:22px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 22],
    });
    const mk = L.marker([l.lat, l.lng], { icon });
    const popup = `
      <div style="min-width:200px">
        <div style="font-weight:700;font-size:14px;margin-bottom:4px">${l.nombre}</div>
        <div style="color:#666;font-size:12px">${l.direccion ?? ''}</div>
        <div style="color:#2D6A4F;font-size:11px;margin-top:4px;cursor:pointer;font-weight:700" data-id="${l.id}">Ver detalle →</div>
      </div>`;
    mk.bindPopup(popup);
    mk.on('popupopen', (e: any) => {
      const link = e.popup.getElement()?.querySelector(`[data-id="${l.id}"]`);
      if (link) link.addEventListener('click', () => onSelect(l));
    });
    layer.addLayer(mk);
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 400 },
});
