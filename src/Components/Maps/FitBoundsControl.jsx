// import { useEffect } from 'react';
// import { useMap } from 'react-leaflet/hooks';
// import L from 'leaflet';

// export const FitBoundsControl = ({ data }) => {
//   const map = useMap();

//   useEffect(() => {
//     if (!data) return;

//     const geojsonLayer = L.geoJSON(data);
//     const bounds = geojsonLayer.getBounds();

//     if (!bounds.isValid()) {
//       return;
//     }

//     map.fitBounds(bounds);
//     const center = bounds.getCenter();
//     map.setView([center.lat, center.lng]);
//   }, [data, map]);

//   return null;
// };
