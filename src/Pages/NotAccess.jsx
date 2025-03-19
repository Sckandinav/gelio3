import React from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { url } from '../routes/routes.js';

export const AccessDenied = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(url.main());
  };

  return (
    <Container className="d-flex justify-content-center align-items-center">
      <Row>
        <Col className="text-center">
          <Alert className="p-5">
            <h1 className="display-1">403</h1>
            <p className="lead">Доступ запрещен</p>
            <p>У вас нет прав для просмотра этой страницы.</p>
            <Button variant="primary" onClick={handleGoBack}>
              На главную
            </Button>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};
