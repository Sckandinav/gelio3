import React from 'react';
import Select from 'react-select';
import { Form, Row, Col } from 'react-bootstrap';

export const InputElem = ({ labelTitle, options, placeholder, selectHandler, value }) => {
  return (
    <Row className="mb-3 align-items-center">
      <Col xl={2}>
        <Form.Group>
          <Form.Label className="m-0">{labelTitle}</Form.Label>
        </Form.Group>
      </Col>
      <Col xl={4}>
        <Select options={options} placeholder={placeholder} onChange={selectHandler} value={value} />
      </Col>
    </Row>
  );
};
