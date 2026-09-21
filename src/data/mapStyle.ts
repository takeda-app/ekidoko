/**
 * Google Maps JSON styling (Maps JavaScript API `styles` option).
 *
 * IMPORTANT: `styles` only takes effect on the default RASTER map renderer.
 * Do NOT pass a `mapId` alongside this — a vector map (required for Map IDs /
 * Advanced Markers) ignores inline JSON styles entirely and would leak
 * station names/icons again.
 *
 * Hidden: transit (rail/subway lines, stations, icons, route names) and all
 * POI labels/icons (business, government, school, etc.) since a nearby POI
 * name can incidentally contain the station name.
 * Kept visible: roads, water, parks, terrain, and administrative/locality
 * place names — these are the intended guessing hints per the spec.
 */
export const hideStationMapStyle: google.maps.MapTypeStyle[] = [
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ visibility: 'on' }] },
  { featureType: 'poi.park', elementType: 'labels', stylers: [{ visibility: 'on' }] },
];
