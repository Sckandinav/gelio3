import React from 'react';
import { ListGroup, Form, Button } from 'react-bootstrap';

export const CheckboxSelection = ({ data, actionType, func, actionFunc, chosen, onClose }) => {
  const title = actionType?.action?.split(' ')[0];
  const roll = actionType?.action?.split(' ')[1] === 'подписанта' ? 'signers' : 'viewers';

  return (
    <>
      <ListGroup className="mb-4">
        {data?.map(user => (
          <ListGroup.Item key={user.value} className="p-2">
            <Form>
              <Form.Check.Label className="d-block" style={{ cursor: 'pointer' }} onChange={() => func(user)}>
                <Form.Check.Input></Form.Check.Input>
                <span className="ms-2">{user.label}</span>
              </Form.Check.Label>
            </Form>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Button
        disabled={chosen.length === 0}
        variant={title === 'Добавить' ? 'success' : 'danger'}
        onClick={() => {
          actionFunc(actionType.id, roll);
          onClose();
        }}
      >
        {title}
      </Button>
    </>
  );
};
