'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface AirQualityMapProps {
  latitude: number;
  longitude: number;
  aqi: number;
}

const AirQualityMap = ({ latitude, longitude, aqi }: AirQualityMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const nearbyMarkersRef = useRef<L.Marker[]>([]);

  const getAQIColor = (aqiValue: number) => {
    if (aqiValue <= 50) return '#00E400';
    if (aqiValue <= 100) return '#FFFF00';
    if (aqiValue <= 150) return '#FF7E00';
    if (aqiValue <= 200) return '#FF0000';
    if (aqiValue <= 300) return '#8F3F97';
    return '#7E0023';
  };

  const createMarker = (lat: number, lon: number, aqiValue: number, isMainLocation = false) => {
    const aqiColor = getAQIColor(aqiValue);
    const size = isMainLocation ? 30 : 24;
    const fontSize = isMainLocation ? 12 : 10;
    const borderWidth = isMainLocation ? 2 : 1;
    
    return L.divIcon({
      className: 'aqi-marker',
      html: `
        <div style="
          width: ${size}px;
          height: ${size}px;
          background: ${aqiColor};
          border-radius: 50%;
          border: ${borderWidth}px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: ${fontSize}px;
          box-shadow: 0 0 10px rgba(0,0,0,0.3);
        ">
          ${aqiValue}
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2]
    });
  };

  const fetchNearbyAQI = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.waqi.info/map/bounds/?latlng=${lat-1},${lon-1},${lat+1},${lon+1}&token=1b8317418438c9635ca986176d79907d539026b4`
      );
      const data = await response.json();
      
      if (data.status === "ok" && data.data) {
        return data.data.map((station: any) => ({
          lat: station.lat,
          lon: station.lon,
          aqi: station.aqi
        }));
      }
      return [];
    } catch (err) {
      console.error("Error fetching nearby stations:", err);
      return [];
    }
  };

  useEffect(() => {
    if (!latitude || !longitude || !mapRef.current) return;

    const lat = latitude;
    const lon = longitude;

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        attributionControl: false
      }).setView([lat, lon], 13);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance.current);
    } else {
      mapInstance.current.setView([lat, lon], 13);
    }

    nearbyMarkersRef.current.forEach(marker => {
      if (mapInstance.current) {
        mapInstance.current.removeLayer(marker);
      }
    });
    nearbyMarkersRef.current = [];

    const mainMarkerIcon = createMarker(lat, lon, aqi, true);
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lon]).setIcon(mainMarkerIcon);
    } else {
      markerRef.current = L.marker([lat, lon], { icon: mainMarkerIcon }).addTo(mapInstance.current);
    }

    fetchNearbyAQI(lat, lon).then(nearbyPoints => {
      nearbyPoints.forEach((point: any) => {
        const markerIcon = createMarker(point.lat, point.lon, point.aqi);
        const marker = L.marker([point.lat, point.lon], { icon: markerIcon });
        if (mapInstance.current) {
          marker.addTo(mapInstance.current);
          nearbyMarkersRef.current.push(marker);
        }
      });
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [latitude, longitude, aqi]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-64 md:h-96 rounded-xl shadow-lg"
      style={{ position: 'relative' }}
    />
  );
};

export default AirQualityMap;