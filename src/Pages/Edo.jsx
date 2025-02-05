import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

import { Dashboard } from '../Components/Dashboard/Dashboard';
import { Spinner } from '../Components/Spinner/Spinner';

import styles from './styles/Edo.module.scss';

export const Edo = () => {
  const [state, setState] = useState({
    isLoading: false,
    error: null,
    data: [],
  });

  if (state.isLoading) {
    return <Spinner />;
  }

  return (
    <Container fluid className={`bg-light-subtle rounded pt-3  ${styles.edoInner}`}>
      <Row className="mb-5">
        <Col>
          <Dashboard isDropdown={true} />
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
