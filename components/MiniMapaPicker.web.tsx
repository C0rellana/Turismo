import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
  color?: string;
};

export default function MiniMapaPicker({ lat, lng, onChange, color = '#E94F37' }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = await import('leaflet');
      await import('leaflet/dist/leaflet.css');
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current).setView([lat, lng], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
      }).addTo(map);

      const icon = L.divIcon({
        html: `<div style="background:${color};width:22px;height:22px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      markerRef.current = L.marker([lat, lng], { icon, draggable: true }).addTo(map);
      markerRef.current.on('dragend', () => {
        const pos = markerRef.current.getLatLng();
        onChange(pos.lat, pos.lng);
      });

      map.on('click', (e: any) => {
        markerRef.current.setLatLng(e.latlng);
        onChange(e.latlng.lat, e.latlng.lng);
      });

      mapRef.current = map;
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

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    }
    if (mapRef.current) mapRef.current.setView([lat, lng]);
  }, [lat, lng]);

  return (
    <View style={styles.box}>
      <div
        ref={containerRef as any}
        style={{ height: 260, borderRadius: 12, overflow: 'hidden' }}
      />
      <View style={styles.hint}>
        <Ionicons name="information-circle" size={14} color="#666" />
        <Text style={styles.hintTxt}>Click o arrastra el pin para ajustar</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { gap: 8 },
  hint: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  hintTxt: { fontSize: 12, color: '#666' },
});
