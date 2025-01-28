import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { IoIosLogOut } from 'react-icons/io';
import { Row, Container, Col } from 'react-bootstrap';

import { logOut } from '../../store/slices/userAuth';
import { Menu } from '../Menu/Menu';

export const Header = () => {
  const dispatch = useDispatch();
  return (
    <Container className="border-bottom" fluid>
      <Row>
        <Col className="d-flex justify-content-between align-items-center mb-2">
          <Menu />

          <Button
            variant="light"
            onClick={() => {
              dispatch(logOut());
            }}
          >
            <IoIosLogOut /> Выход
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
