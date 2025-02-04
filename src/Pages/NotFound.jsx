import React from 'react';
import { Row, Container, Col, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

export const NotFound = () => {
  return (
    <Container fluid className="d-flex flex-column justify-content-center align-items-center">
      <Row>
        <Col className="bg-body p-3 rounded-4">
          <h2>Страница не найдена</h2>
          <p>Запрашиваемая страница не найдена.</p>
          <NavLink to="/">
            <Button variant="link">На Главную</Button>
          </NavLink>
        </Col>
      </Row>
      <Row>
        <Col>
          <img className="img-fluid" src={'/404.png'} alt="404 страница" />
        </Col>
      </Row>
    </Container>
  );
};
