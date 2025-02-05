import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { useAxiosInterceptor } from '../Components/hoc/useAxiosInterceptor';
import { links, url } from '../routes/routes.js';

export const ErrorPage = () => {
  const navigate = useNavigate();
  const axiosInstance = useAxiosInterceptor();

  const checkServerStatus = async () => {
    try {
      await axiosInstance.get(links.checkStatus());
      navigate(url.main());
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  useEffect(() => {
    checkServerStatus();
    const interval = setInterval(checkServerStatus, 60000);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center bg-light rounded p-5" style={{ maxWidth: '600px' }}>
      <Row className="text-center">
        <Col>
          <img className="img-fluid mb-2" src="./logo-light.png" alt="logo" />
          <Alert variant="danger">
            <Alert.Heading>Ой, что-то пошло не так!</Alert.Heading>
            <p>Сервер временно недоступен. </p>
            <p>Мы уже занимаемся решением этой проблемы</p>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};
