import React, { useState } from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { TileLayer } from '@deck.gl/geo-layers';
import { Map } from 'react-map-gl/maplibre';

export const TestMapsCom = ({ data }) => {
  const [tileURL, setTileURL] = useState('https://c.tile.openstreetmap.org/{z}/{x}/{y}.png');

  const INITIAL_VIEW_STATE = {
    longitude: 42.36,
    latitude: 51.13,
    zoom: 9,
    pitch: 0,
    bearing: 0,
  };

  const geoJsonLayer = new GeoJsonLayer({
    id: 'geojson-layer',
    data: data,

    filled: true,
    getFillColor: [60, 96, 249, 150],
    stroked: true,
    getLineColor: [0, 0, 0],
    getLineWidth: 2,
    pickable: true,
    autoHighlight: true,
  });

  const tileLayer = new TileLayer({
    id: 'tile-layer',
    data: tileURL,
    minZoom: 0,
    maxZoom: 19,
  });

  const layers = [geoJsonLayer];

  //   const layers = [
  //     new GeoJsonLayer({
  //       id: 'geojson-layer',
  //       data: data,
  //       filled: true,
  //       getFillColor: [60, 96, 249, 150],
  //       stroked: true,
  //       getLineColor: [0, 0, 0],
  //       getLineWidth: 2,
  //       pickable: true,
  //       autoHighlight: true,
  //     }),
  //   ];

  return (
    <div>
      <DeckGL initialViewState={INITIAL_VIEW_STATE} controller={true} layers={layers} style={{ width: '100%', height: '100%' }}>
        <Map mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" />
      </DeckGL>
    </div>
  );
};
