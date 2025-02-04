import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';

export const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Row className="text-center">
        <Col>
          <Alert variant="danger">
            <Alert.Heading>Ой, что-то пошло не так!</Alert.Heading>
            <p>Сервер временно недоступен. </p>
          </Alert>
          <Button variant="primary" onClick={() => navigate('/')}>
            Попробовать снова
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
