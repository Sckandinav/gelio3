import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Form, Button } from 'react-bootstrap';

import { useAxiosInterceptor } from '../Components/hoc/useAxiosInterceptor';
import { getData } from '../api/getData';
import { links, sowing } from '../routes/routes.js';
import { useUserToken } from '../Components/hoc/useUserToken.js';

import styles from './styles/Сommon.module.scss';

export const Sowing = () => {
  const [agloList, setAgroList] = useState([]);
  const [state, setState] = useState({
    agro: '',
    dateStart: '',
    dateEnd: '',
  });

  const token = useUserToken();
  const axiosInstance = useAxiosInterceptor();

  const stateToggle = (key, value) => {
    setState(prev => ({ ...prev, [key]: value.target.value }));
  };

  const getAgroList = async () => {
    try {
      const res = await getData(links.getAgro(), axiosInstance);
      setAgroList(res);
    } catch (error) {
      console.log(error);
    }
  };

  const getSowing = async e => {
    e.preventDefault();
    const response = await getData(sowing.seeds(), axiosInstance);
    console.log(response);
  };

  useEffect(() => {
    getAgroList();
  }, []);

  return (
    <Container fluid className={`bg-light-subtle rounded pt-3 ${styles.inner}`}>
      <Row>
        <Form className="d-flex column-gap-3 align-items-center" onSubmit={getSowing}>
          <Col xl={3}>
            <Form.Group>
              <Form.Label htmlFor="agro">Выбор предприятия</Form.Label>
              <Form.Select id="agro" value={state.agro} onChange={e => stateToggle('agro', e)}>
                <option value="">Выбор предприятия</option>
                {agloList.map(el => (
                  <option key={el.id} value={el.id}>
                    {el.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Text>Обязательное поле</Form.Text>
            </Form.Group>
          </Col>

          <Col xl={1}>
            <Form.Group>
              <Form.Label htmlFor="dateStart">Дата с:</Form.Label>
              <Form.Control id="dateStart" value={state.dateStart} onChange={e => stateToggle('dateStart', e)} />
              <Form.Text>Опциональное поле</Form.Text>
            </Form.Group>
          </Col>
          <Col xl={1}>
            <Form.Group>
              <Form.Label htmlFor="dateEnd">Дата до:</Form.Label>
              <Form.Control id="dateEnd" value={state.dateStart} onChange={e => stateToggle('dateEnd', e)} />
              <Form.Text>Опциональное поле</Form.Text>
            </Form.Group>
          </Col>
          <Button size="sm" style={{}} type="submit">
            Сформировать
          </Button>
        </Form>
      </Row>
    </Container>
  );
};
