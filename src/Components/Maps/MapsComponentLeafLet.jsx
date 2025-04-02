// import React from 'react';
// import { MapContainer, TileLayer, GeoJSON, LayersControl } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import { FullscreenControl } from 'react-leaflet-fullscreen';
// import 'react-leaflet-fullscreen/styles.css';

// import { FitBoundsControl } from './FitBoundsControl';

// export const MapsComponent = ({ data }) => {
//   const getStyle = feature => {
//     return {
//       fillColor: feature.properties ? feature.properties.color || '#3388ff' : '#3388ff', // Можно задать разные цвета
//       weight: 2,
//       opacity: 0.5,
//       color: '#2679D9',
//       dashArray: '',
//       fillOpacity: 0.7,
//     };
//   };

//   const handleMouseOver = event => {
//     const layer = event.target;
//     layer.setStyle({
//       fillColor: '#2679D9',
//       color: '#fff',
//       fillOpacity: 1,
//       opacity: 1,
//     });
//   };

//   const handleMouseOut = event => {
//     const layer = event.target;
//     layer.setStyle({
//       fillColor: '#3388ff',
//       opacity: 0.5,
//       fillOpacity: 0.7,
//       color: '#2679D9',
//     });
//   };

//   const onEachFeature = (feature, layer) => {
//     const fieldcode = feature.properties.field_details.fieldcode;

//     layer.bindTooltip(fieldcode, {
//       permanent: false, // Подсказка будет появляться только при наведении
//       direction: 'top',
//     });

//     // layer.on('add', () => {
//     //   // Получаем центр полигона
//     //   const center = layer.getBounds().getCenter();

//     //   const label = L.divIcon({
//     //     html: `<span>${fieldcode}</span>`,
//     //   });

//     //   L.marker(center, { icon: label }).addTo(layer._map);

//     //   // Создаем маркер в центре полигона
//     //   // const marker = L.marker(center, {
//     //   //   title: fieldcode,
//     //   // }).addTo(layer._map); // Добавляем маркер на карту
//     // });

//     layer.on({
//       mouseover: handleMouseOver,
//       mouseout: handleMouseOut,
//     });
//   };

//   return (
//     <MapContainer center={[50.554397361808654, 42.83134274002525]} zoom={7} style={{ height: '100%', width: '100%' }}>
//       <LayersControl position="bottomleft">
//         <LayersControl.BaseLayer name="OpenStreetMap">
//           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="Geliopaxgeo" />
//         </LayersControl.BaseLayer>
//         <LayersControl.BaseLayer checked name="Карты">
//           <TileLayer
//             url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png"
//             attribution="Geliopaxgeo"
//           />
//         </LayersControl.BaseLayer>
//       </LayersControl>

//       <GeoJSON data={data} style={getStyle} onEachFeature={onEachFeature} />
//       <FitBoundsControl data={data} />
//       <FullscreenControl
//         position="bottomright"
//         title="Открыть полноэкранный режим"
//         titleCancel="Выход с полноэкранного режима"
//         forcePseudoFullscreen={true}
//       />
//     </MapContainer>
//   );
// };
