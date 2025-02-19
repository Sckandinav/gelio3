import React from 'react';
import { Row, Col, OverlayTrigger, Popover, Button, Badge, Dropdown, Modal, ListGroup, Container } from 'react-bootstrap';
import { PaymentList } from '../Components/Payment/PaymentList';
import { Dashboard } from '../Components/Dashboard/Dashboard';
import { CreatePayment } from '../Components/Payment/CreatePayment';

export const Payment = () => {
  return (
    <Container>
      <Row>
        <Col>
          <Dashboard
            isDropdown={false}
            data={[]}
            create={<CreatePayment />}
            modalTitle={'Создать заявку на оплату'}
            fullScreen={true}
            // updateList={() => console.log('updateList')}
          />
        </Col>
      </Row>
    </Container>
  );
};
