import React, { useState } from 'react';
import { Row, Container, Col, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { userSelectors } from '../store/selectors/userSelectors';

import { fetchAuth } from '../store/api/fetchAuth';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
  });
  const { error } = useSelector(userSelectors);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const inputHandler = (e, id) => {
    e.preventDefault();
    setUserData(prev => ({ ...prev, [id]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const result = await dispatch(fetchAuth(userData));

    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
  };

  return (
    <Container fluid className="bg-secondary  vh-100">
      <Row className="d-flex justify-content-center align-items-center h-100">
        <Col sm={3} className="bg-body p-3 rounded-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Логин</Form.Label>
              <Form.Control
                value={userData.username}
                type="text"
                placeholder="Введите логин"
                required
                onChange={e => {
                  inputHandler(e, 'username');
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                value={userData.password}
                type="password"
                placeholder="Введите пароль"
                required
                onChange={e => {
                  inputHandler(e, 'password');
                }}
              />
            </Form.Group>

            <Row className="mb-3">
              {error === 'Request failed with status code 401' && <Form.Text className="text-danger ">Неверный логин или пароль</Form.Text>}
            </Row>
            <Button variant="success" type="submit">
              Войти
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
