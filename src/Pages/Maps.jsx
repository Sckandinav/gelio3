import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Container, Row, Col, Modal, Button, Form } from 'react-bootstrap';

import { useAxiosInterceptor } from '../Components/hoc/useAxiosInterceptor';
import { getData } from '../api/getData';
import { mapsUrls, links } from '../routes/routes.js';
import { MapsComponent } from '../Components/Maps/MapsComponent.jsx';

const yearsList = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010];

export const Maps = () => {
  const [params, setParams] = useState({ year: yearsList[0], agroid: '' });
  const [agro, setAgro] = useState([]);
  const [agroFields, setAgroFields] = useState({});
  const [loading, setLoading] = useState(false);

  const axiosInstance = useAxiosInterceptor();

  const getAgroList = async () => {
    try {
      const response = await getData(links.getAgro(), axiosInstance);
      setAgro(response);
    } catch (error) {
      console.log(error);
    }
  };

  const getFields = async () => {
    try {
      setLoading(true);
      const response = await getData(mapsUrls.getPolygonCoordinates(), axiosInstance, params);
      setAgroFields(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const setDataParams = e => {
    const currentKey = e.target.name;
    setParams(prev => ({ ...prev, [currentKey]: e.target.value }));
  };

  useEffect(() => {
    getAgroList();
    getFields();
  }, [params]);

  return (
    <Container>
      <Row>
        <Col>
          <Form.Select name="agroid" onChange={setDataParams} value={params.agroid}>
            <option value="">Выберите предприятие</option>
            {agro.map(el => (
              <option value={el.id} key={el.id}>
                {el.name}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col>
          <Form.Select name="year" onChange={setDataParams} value={params.year}>
            {yearsList.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <Row>
          <Col>Загрузка...</Col>
        </Row>
      ) : (
        <Row>
          <Col style={{ height: '600px' }}>
            <MapsComponent data={agroFields.features} />
          </Col>
        </Row>
      )}

      <MapsComponent />
    </Container>
  );
};
