import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import { useEffect, useRef, useState } from 'react';
import { hideStationMapStyle } from '../data/mapStyle';
import type { Station } from '../types';

interface StationMapProps {
  station: Station;
  /** Show a pin + name label at the station's real coordinates. */
  revealed?: boolean;
}

const DEFAULT_ZOOM = 15;

interface LoadedMapsApi {
  maps: google.maps.MapsLibrary;
  marker: google.maps.MarkerLibrary;
}

// A single shared loading promise avoids reloading the Maps JS bundle or
// re-creating the map (and its network requests) on every question change.
let apiPromise: Promise<LoadedMapsApi> | null = null;

function loadGoogleMaps(): Promise<LoadedMapsApi> {
  if (!apiPromise) {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return Promise.reject(
        new Error('VITE_GOOGLE_MAPS_API_KEY が設定されていません。.env.local を確認してください。'),
      );
    }
    setOptions({ key: apiKey, v: 'weekly' });
    apiPromise = Promise.all([importLibrary('maps'), importLibrary('marker')]).then(
      ([maps, marker]) => ({ maps, marker }),
    );
  }
  return apiPromise;
}

export function StationMap({ station, revealed = false }: StationMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Create the map once.
  useEffect(() => {
    let cancelled = false;

    loadGoogleMaps()
      .then(({ maps, marker }) => {
        if (cancelled || !containerRef.current || mapRef.current) return;
        mapRef.current = new maps.Map(containerRef.current, {
          center: { lat: station.latitude, lng: station.longitude },
          zoom: DEFAULT_ZOOM,
          // No mapId here on purpose: `styles` (JSON styling) only applies to
          // the default raster renderer, not vector maps.
          styles: hideStationMapStyle,
          disableDefaultUI: false,
          streetViewControl: false, // Street View imagery would show station signage.
          mapTypeControl: false,
          fullscreenControl: false,
          clickableIcons: false,
          gestureHandling: 'greedy',
        });
        markerRef.current = new marker.Marker({ map: mapRef.current, visible: false });
        infoWindowRef.current = new maps.InfoWindow();
        setMapReady(true);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-center on the existing map instance whenever the question's station
  // changes (also covers the case where the player dragged/zoomed away).
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    map.setCenter({ lat: station.latitude, lng: station.longitude });
    map.setZoom(DEFAULT_ZOOM);
    infoWindowRef.current?.close();
    markerRef.current?.setVisible(false);
  }, [station, mapReady]);

  // Show the answer pin using the marker's real coordinates, so it stays
  // correct even if the player panned/zoomed away before answering.
  useEffect(() => {
    if (!mapReady) return;
    const map = mapRef.current;
    const marker = markerRef.current;
    const infoWindow = infoWindowRef.current;
    if (!map || !marker || !infoWindow) return;

    if (revealed) {
      const position = { lat: station.latitude, lng: station.longitude };
      marker.setPosition(position);
      marker.setVisible(true);
      infoWindow.setContent(station.displayName);
      infoWindow.open({ map, anchor: marker });
      map.panTo(position);
    } else {
      infoWindow.close();
      marker.setVisible(false);
    }
  }, [revealed, station, mapReady]);

  if (error) {
    return <div className="station-map station-map--error">{error}</div>;
  }

  return <div ref={containerRef} className="station-map" />;
}
