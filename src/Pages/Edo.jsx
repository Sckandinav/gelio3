import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { Dashboard } from '../Components/Dashboard/Dashboard';
import { Spinner } from '../Components/Spinner/Spinner';
import { WebSocketMenuListener } from '../Components/hoc/WebSocket/WebSocketMenuListener';
import { notificationsSelector } from '../store/selectors/notificationsSelector';
import { Create } from '../Components/Edo/Create';

import styles from './styles/Edo.module.scss';

export const Edo = () => {
  const [state, setState] = useState({
    isLoading: false,
    error: null,
    data: [],
  });

  const { data } = useSelector(notificationsSelector)?.sideBar || {};

  return (
    <Container fluid className={`bg-light-subtle rounded pt-3  ${styles.edoInner}`}>
      <Row className="mb-5">
        <Col>
          <WebSocketMenuListener />
          <Dashboard isDropdown={true} data={data} create={<Create />} />
        </Col>
      </Row>
      <Row>
        <Col className="px-4">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};
