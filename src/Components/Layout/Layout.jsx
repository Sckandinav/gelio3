import React from 'react';
import { Outlet } from 'react-router-dom';
import { Row, Container, Col } from 'react-bootstrap';

import { Header } from '../Header/Header';
import { Menu } from '../Menu/Menu';

export const Layout = () => {
  return (
    <Container fluid className="p-3">
      <Row>
        <Col className="d-flex justify-content-between align-items-center mb-2">
          {/* <Menu /> */}
          <Header />
        </Col>
      </Row>
      <Row>
        <Col>
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};
