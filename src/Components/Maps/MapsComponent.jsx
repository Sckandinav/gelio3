import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { FitBoundsControl } from './FitBoundsControl';

export const MapsComponent = ({ data }) => {
  return (
    <MapContainer center={[50.554397361808654, 42.83134274002525]} zoom={7} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON data={data} />
      <FitBoundsControl data={data} />
    </MapContainer>
  );
};
