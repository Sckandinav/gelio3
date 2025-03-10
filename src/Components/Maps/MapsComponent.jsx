import React, { useState, useMemo, useRef, useEffect } from 'react';
import { DeckGL } from '@deck.gl/react';
import { TileLayer } from '@deck.gl/geo-layers';
import { GeoJsonLayer, TextLayer } from '@deck.gl/layers';
import { Map } from 'react-map-gl/maplibre';
import centroid from '@turf/centroid';
import { featureCollection } from '@turf/helpers';
import { area } from '@turf/turf';
import { Col, Row, Table, Form, Button } from 'react-bootstrap';
import { motion, AnimatePresence } from 'motion/react';
import { FaSearchLocation } from 'react-icons/fa';
import Select from 'react-select';

import './styles.css';

const INITIAL_VIEW_STATE = {
  longitude: 42.36,
  latitude: 51.13,
  zoom: 9,
  pitch: 0,
  bearing: 0,
};

export const MapsComponent = ({ data }) => {
  const [zoom, setZoom] = useState(INITIAL_VIEW_STATE.zoom);
  const [hoveredField, setHoveredField] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [options, setOptions] = useState(null);
  const searchRef = useRef(null);

  const handleViewStateChange = ({ viewState }) => {
    setZoom(viewState.zoom);
  };

  const center = useMemo(() => {
    if (data && data.length) {
      const features = featureCollection(data);
      const centeroid = centroid(features);
      return centeroid.geometry.coordinates;
    }
    return [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude];
  }, [data]);

  const searchToggle = () => {
    setIsSearchVisible(prev => !prev);
  };

  const getSelectElement = () => {
    const options = data?.map(el => ({
      value: el.properties.field_details.fieldcode + el.properties.field_details.id,
      label: el.properties.field_details.fieldcode,
    }));

    setOptions(options);
  };

  //поиск поля
  const handleSearch = () => {
    const foundField = data.find(field => field.properties.field_details.fieldcode === searchQuery);

    if (foundField) {
      const center = centroid(foundField);

      setViewState(prev => ({
        ...prev,
        longitude: center.geometry.coordinates[0],
        latitude: center.geometry.coordinates[1],
        zoom: 15,
      }));
    }
  };

  const selectHandler = option => {
    setSearchQuery(option.label);
  };

  const textLayer = new TextLayer({
    id: 'text-layer',
    data: data,
    getPosition: d => {
      const center = centroid(d);
      return center.geometry.coordinates;
    },
    getText: d => `${d.properties.field_details.fieldcode}\n${d.properties.field_details.area} га`,
    getColor: [0, 0, 0, 255],
    getSize: 14,
    getTextAnchor: 'start',
    getAlignmentBaseline: 'center',
    visible: zoom >= 12,
  });

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
    onHover: ({ object }) => {
      setHoveredField(object ? object : null);
    },
  });

  const layers = [
    new TileLayer({
      data: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
      minZoom: 0,
      maxZoom: 19,
    }),

    textLayer,
    geoJsonLayer,
  ];

  const getFieldDetails = (field, key) => {
    const result = field.properties.crop_details.reduce((acc, curr) => {
      if (!acc?.includes(curr[key])) {
        acc.push(curr[key]);
      }
      return acc;
    }, []);

    return result;
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    getSelectElement();
  }, [data]);

  if (!data) {
    return null;
  }

  if (data && data.length) {
    return (
      <Row className="mapInner p-2">
        <Col className="position-relative col-8 border">
          <Form.Group
            ref={searchRef}
            style={{ position: 'absolute', zIndex: '2', width: '200px' }}
            className="d-flex align-items-center column-gap-1"
          >
            <AnimatePresence>
              {isSearchVisible && (
                <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: '200px', opacity: 1 }} exit={{ width: 0, opacity: 0 }}>
                  <Select options={options} placeholder="Поиск" onChange={selectHandler} />
                </motion.span>
              )}
            </AnimatePresence>
            <Button onClick={isSearchVisible ? handleSearch : searchToggle} variant="secondary">
              <FaSearchLocation size={30} />
            </Button>
          </Form.Group>

          <DeckGL
            initialViewState={{
              ...INITIAL_VIEW_STATE,
              longitude: center[0],
              latitude: center[1],
            }}
            controller={true}
            layers={layers}
            style={{ width: '100%', height: '100%' }}
            onViewStateChange={handleViewStateChange}
          >
            <Map mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" />
          </DeckGL>
          <AnimatePresence>
            {hoveredField && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Table className="infoCard shadow-lg rounded">
                  <thead>
                    <tr>
                      <th>Ключ</th>
                      <th>Данные поля</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Поле:</td>
                      <td>{hoveredField.properties.field_details.fieldcode}</td>
                    </tr>
                    <tr>
                      <td>Площадь по контуру:</td>
                      <td>{Number(area(hoveredField) / 10000).toFixed(2)} га</td>
                    </tr>
                    <tr>
                      <td>Фактическая площадь:</td>
                      <td>{hoveredField.properties.field_details.area} га</td>
                    </tr>
                    <tr>
                      <td>Культуры:</td>
                      <td>{getFieldDetails(hoveredField, 'crop').join(', ')}</td>
                    </tr>
                    <tr>
                      <td>Сорта:</td>
                      <td>{getFieldDetails(hoveredField, 'sort').join(', ')}</td>
                    </tr>
                    <tr>
                      <td>Предшесвенники:</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Дата сева:</td>
                      <td>
                        {getFieldDetails(hoveredField, 'startdate')
                          .map(el => new Date(el).toLocaleDateString())
                          .join(', ')}
                      </td>
                    </tr>
                    <tr>
                      <td>Дата уборки:</td>
                      <td>
                        {getFieldDetails(hoveredField, 'enddate')
                          .map(el => new Date(el).toLocaleDateString())
                          .join(', ')}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </motion.div>
            )}
          </AnimatePresence>
        </Col>

        <Col className="border border-primary-subtle">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic dolore quis, voluptate a ab sunt asperiores cupiditate saepe nisi adipisci
            obcaecati quae? Libero, adipisci non ab eveniet ratione voluptatibus autem?
          </p>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic dolore quis, voluptate a ab sunt asperiores cupiditate saepe nisi adipisci
            obcaecati quae? Libero, adipisci non ab eveniet ratione voluptatibus autem?
          </p>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic dolore quis, voluptate a ab sunt asperiores cupiditate saepe nisi adipisci
            obcaecati quae? Libero, adipisci non ab eveniet ratione voluptatibus autem?
          </p>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic dolore quis, voluptate a ab sunt asperiores cupiditate saepe nisi adipisci
            obcaecati quae? Libero, adipisci non ab eveniet ratione voluptatibus autem?
          </p>
        </Col>
      </Row>
    );
  }
};
