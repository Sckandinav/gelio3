import React from 'react';
import { Outlet } from 'react-router-dom';
import { Row, Container, Col } from 'react-bootstrap';

import { Header } from '../Header/Header';
import { WebSocketListener } from '../hoc/WebSocket/WebSocketListener.js';
import { WebSocketApplicationListener } from '../hoc/WebSocket/WebSocketApplicationListener.js';
import { NotificationManager } from '../NotificationManager/NotificationManager.jsx';
import styles from './Layout.module.scss';

export const Layout = () => {
  return (
    <>
      <Container fluid className={`${styles.mainInner} bg-body-secondary`}>
        <Row className="mb-2">
          <WebSocketApplicationListener />
          <WebSocketListener />
          <NotificationManager />
          <Col>
            <Header />
          </Col>
        </Row>

        <Row className={`${styles.mainContent}`}>
          <Col className={`pt-2 h-100 ${styles.mainContent}`}>
            <Outlet />
          </Col>
        </Row>

        <Row>
          <footer></footer>
        </Row>
      </Container>
    </>
  );
};
