import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from 'react-icons/io';
import { FaRegEdit } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import Select from 'react-select';

import { useAxiosInterceptor } from '../hoc/useAxiosInterceptor';
import { useUserToken } from '../hoc/useUserToken.js';
import { showSuccess, showError } from '../../store/slices/toast.js';

import './styles/CreationPesticideElement.scss';

export const CreationPesticideElement = ({ data, selected, selectHandler, labelText, addUrl, editUrl, removeUrl, updateFunc }) => {
  const [btnState, setBtnState] = useState({
    add: false,
    edit: false,
    remove: false,
  });

  const [newValue, setNewValue] = useState(selected || '');
  const [inputValue, setInputValue] = useState('');

  const token = useUserToken();
  const axiosInstance = useAxiosInterceptor();
  const dispatch = useDispatch();

  const changeHandler = e => {
    setNewValue(prev => ({ ...prev, label: e.target.value }));
  };

  const btnToggle = (key = null) => {
    setBtnState(prev => {
      if (key === null) {
        return {
          add: false,
          edit: false,
          remove: false,
        };
      } else {
        return { ...prev, [key]: !prev[key] };
      }
    });
  };

  const editValue = async e => {
    e.preventDefault();
    try {
      await axiosInstance.put(
        editUrl(newValue.value),
        { name: newValue.label },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        },
      );
      dispatch(showSuccess('Изменение внесено'));
      setInputValue('');
      updateFunc();
      btnToggle();
      selectHandler(newValue);
    } catch (error) {
      dispatch(showError('Не удалось внести изменение'));
      console.log(error);
    }
  };

  const addNewValue = async e => {
    e.preventDefault();
    try {
      await axiosInstance.post(
        addUrl(),
        { name: inputValue },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        },
      );

      dispatch(showSuccess('Значение добавлено'));
      updateFunc();
      btnToggle();
    } catch (error) {
      dispatch(showError('Не удалось добавить значение'));
      console.log(error);
    }
  };

  const removeValue = async e => {
    e.preventDefault();
    try {
      await axiosInstance.delete(removeUrl(newValue.value), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });
      dispatch(showSuccess('Значение удалено'));
      updateFunc();
      btnToggle();
      selectHandler(null);
    } catch (error) {
      dispatch(showError('Не удалось удалить значение'));
      console.log(error);
    }
  };

  useEffect(() => {
    if (selected) {
      setNewValue(selected);
    }
  }, [selected]);

  return (
    <Row className="mb-2">
      <Col>
        <Form.Group as={Row} className="d-flex">
          <Form.Label column sm={4} className="fw-semibold">
            {labelText}
          </Form.Label>
          <Col sm={6}>
            <Select options={data} placeholder="Поиск" value={selected} onChange={selectHandler} />
          </Col>
          <Col sm={2}>
            <Button title="Редактировать" className="actionBtn" onClick={() => btnToggle('edit')} disabled={!selected}>
              <FaRegEdit size={20} color="#0d6efd" />
            </Button>

            <Button title="Добавить новый элемент" className="actionBtn mx-2" onClick={() => btnToggle('add')}>
              <IoMdAddCircleOutline size={20} color="#198754" />
            </Button>

            <Button title="Удалить выбранный элемент" className="actionBtn" disabled={!selected} onClick={() => btnToggle('remove')}>
              <IoMdRemoveCircleOutline size={20} color="#dc3545" />
            </Button>
          </Col>
        </Form.Group>
      </Col>

      <Modal show={btnState.edit} onHide={() => btnToggle('edit')}>
        <Modal.Header closeButton>
          <Modal.Title>Изменить</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Label className="w-100">
              <Form.Control type="text" value={newValue?.label || ''} onChange={changeHandler} />
            </Form.Label>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-danger" onClick={() => btnToggle('edit')}>
            Отмена
          </Button>
          <Button variant="outline-success" onClick={editValue} disabled={newValue.label === selected?.label}>
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={btnState.add} onHide={() => btnToggle('add')}>
        <Modal.Header closeButton>
          <Modal.Title>Добавить</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Label className="w-100">
              <Form.Control type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} />
            </Form.Label>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="outline-danger"
            onClick={() => {
              setInputValue('');
              btnToggle('add');
            }}
          >
            Отмена
          </Button>
          <Button variant="outline-success" onClick={addNewValue} disabled={inputValue.length === 0}>
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={btnState.remove} onHide={() => btnToggle('remove')}>
        <Modal.Header closeButton>
          <Modal.Title>Подтверждение действия</Modal.Title>
        </Modal.Header>

        <Modal.Body>Вы действительно хотите удалить значение?</Modal.Body>

        <Modal.Footer>
          <Button
            variant="outline-danger"
            onClick={() => {
              btnToggle('remove');
            }}
          >
            Отмена
          </Button>
          <Button variant="outline-success" onClick={removeValue}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
};
