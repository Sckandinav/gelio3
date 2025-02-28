import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Spinner } from 'react-bootstrap';

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
    <Container fluid className="bg-light-subtle rounded p-2">
      <Row className="mb-3 justify-content-start">
        <Col>
          <Form.Group className="d-flex column-gap-3 align-items-center">
            <Form.Label className="m-0">
              <span class="fw-semibold">Укажите предприятие</span>
            </Form.Label>
            <Col>
              <Form.Select name="agroid" onChange={setDataParams} value={params.agroid} style={{ maxWidth: '200px' }}>
                <option value="">Все</option>
                {agro.map(el => (
                  <option value={el.id} key={el.id}>
                    {el.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="d-flex column-gap-3 align-items-center">
            <Form.Label>
              <span class="fw-semibold">Укажите год</span>
            </Form.Label>
            <Col>
              <Form.Select name="year" onChange={setDataParams} value={params.year} style={{ maxWidth: '200px' }}>
                {yearsList.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Form.Group>
        </Col>
      </Row>

      {loading ? (
        <Row>
          <Col className="d-flex justify-content-center align-items-center" style={{ height: 'calc(100vh - 250px)' }}>
            <Spinner animation="border" variant="primary" />
          </Col>
        </Row>
      ) : (
        <MapsComponent data={agroFields.features?.filter(el => el.id !== 21060)} />
      )}

      <MapsComponent />
    </Container>
  );
};
