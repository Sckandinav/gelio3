import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form, Modal } from 'react-bootstrap';

import { roomLinks } from '../../../../routes/routes.js';
import { showSuccess, showError } from '../../../../store/slices/toast.js';
import { axiosInstance } from '../../../hoc/AxiosInstance.js';

export const RejectSign = ({ show, close, updateRoom, document, actionsIDHandler }) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState('');

  const commentHandler = e => {
    setComment(e.target.value);
  };

  const rejectSignDocument = async e => {
    e.preventDefault();
    console.log(e); // Посмотреть, что за событие
    const token = localStorage.getItem('token');
    const axInst = axiosInstance;

    try {
      //   await axInst.post(roomLinks.rejectSign(document.id), comment, {

      //   });
      await axInst.post(
        roomLinks.rejectSign(document.id),
        { comment },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        },
      );
      dispatch(showSuccess('Документ отклонен'));
      close();
      updateRoom();
      actionsIDHandler();
    } catch (error) {
      dispatch(showError('Не удалось отклонить документ'));
      console.log(error);
    }
  };

  return (
    <div>
      <Modal show={show} onHide={close}>
        <Modal.Header closeButton>
          <Modal.Title>Комментарий отклонения</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label style={{ height: '100px', width: '100%' }}>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Введите комментарий"
                  style={{ resize: 'none' }}
                  value={comment}
                  onChange={commentHandler}
                />
              </Form.Label>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close}>
            Отмена
          </Button>
          <Button disabled={comment.length === 0} variant="primary" onClick={rejectSignDocument}>
            Отклонить
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
