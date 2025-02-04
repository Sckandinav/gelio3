import React from 'react';
import { Table, Container, Row, Col } from 'react-bootstrap';

export const Support = () => {
  return (
    <Container style={{ maxWidth: '500px' }} className="p-2 bg-light rounded">
      <Row>
        <Col>
          <p>Выявили ошибки, нужна техническая консультация или есть предложение по улучшению?</p>
          <p>Обращайтесь к сотрудникам ниже:</p>
          <Table bordered hover size="sm" responsive>
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
        </Col>
      </Row>
    </Container>
  );
};
