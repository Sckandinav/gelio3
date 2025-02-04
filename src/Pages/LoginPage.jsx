import React, { useState } from 'react';
import { Row, Container, Col, Button, Form, Modal, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { userSelectors } from '../store/selectors/userSelectors';

import { fetchAuth } from '../store/api/fetchAuth';
import { useNavigate } from 'react-router-dom';
import styles from './styles/LoginPage.module.scss';

export const Login = () => {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
  });
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const modalToggle = () => {
    setIsOpenModal(prev => !prev);
  };

  const passwordVisibleHandler = () => {
    setIsVisible(prev => !prev);
  };
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
    <Container fluid className={`bg-secondary ${styles.LogInner}`}>
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
                type={isVisible ? 'text' : 'password'}
                placeholder="Введите пароль"
                required
                onChange={e => {
                  inputHandler(e, 'password');
                }}
              />
            </Form.Group>

            <Row className="d-flex justify-content-between">
              <Col>
                <Button variant="light" size="sm" onClick={passwordVisibleHandler}>
                  {isVisible ? 'Скрыть пароль' : 'Показать пароль'}
                </Button>
              </Col>
              <Col className="d-flex justify-content-end">
                <Button variant="light" size="sm" onClick={modalToggle}>
                  Не можете войти?
                </Button>
              </Col>
            </Row>

            <Row className="mb-3">
              <div style={{ minHeight: '1.5em' }}>
                {error === 'Request failed with status code 401' ? (
                  <Form.Text className="text-danger">Неверный логин или пароль</Form.Text>
                ) : (
                  <Form.Text>&nbsp;</Form.Text>
                )}
              </div>
            </Row>
            <Button variant="success" type="submit">
              Войти
            </Button>
          </Form>
        </Col>
      </Row>

      <Modal show={isOpenModal} onHide={modalToggle}>
        <Modal.Header closeButton>
          <Modal.Title>Контактная информация</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table>
            <thead>
              <tr>
                <th>ФИО</th>
                <th>Телефон</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ильменский Максим Сергеевич</td>
                <td>+7 (904) 433-44-20</td>
              </tr>
              <tr>
                <td>Погорелов Егор Андреевич</td>
                <td>+7 (937) 563-64-28</td>
              </tr>
              <tr>
                <td>Балов Василий Георгиевич</td>
                <td>+7 (937) 735-89-87</td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </Container>
  );
};
