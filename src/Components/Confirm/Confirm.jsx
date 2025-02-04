import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export const Confirm = ({ onConfirm, onCancel, show, text = 'Подтверждаете действие?' }) => {
  return (
    <>
      <Modal show={show} onHide={onCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Подтверждение</Modal.Title>
        </Modal.Header>
        <Modal.Body>{text}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={() => {
              onConfirm();
              onCancel();
            }}
          >
            Подтверждаю
          </Button>
          <Button variant="danger" onClick={onCancel}>
            Отмена
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
