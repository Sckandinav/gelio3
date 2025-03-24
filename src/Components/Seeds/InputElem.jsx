import React from 'react';
import Select from 'react-select';
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from 'react-icons/io';
import { FaRegEdit } from 'react-icons/fa';
import { Form, Button, Row, Col, Modal } from 'react-bootstrap';

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

      <Col sm={2}>
        <Button title="Редактировать" className="actionBtn">
          <FaRegEdit size={20} color="#0d6efd" />
        </Button>

        <Button title="Добавить новый элемент" className="actionBtn mx-2">
          <IoMdAddCircleOutline size={20} color="#198754" />
        </Button>

        <Button title="Удалить выбранный элемент" className="actionBtn" disabled={!value}>
          <IoMdRemoveCircleOutline size={20} color="#dc3545" />
        </Button>
      </Col>
    </Row>
  );
};
