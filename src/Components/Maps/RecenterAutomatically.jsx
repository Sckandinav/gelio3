import React, { useEffect } from 'react';
import { useMap } from 'https://cdn.esm.sh/react-leaflet/hooks';

export const RecenterAutomatically = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng]);
  return null;
};
