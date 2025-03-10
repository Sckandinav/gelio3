import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

import { useAxiosInterceptor } from '../../hoc/useAxiosInterceptor';
import { applicationUrl } from '../../../routes/routes.js';
import { getData } from '../../../api/getData.js';
import { SelectComponent } from '../../Select/Select.jsx';

import styles from './styles.module.scss';

export const InputElem = ({ close, addRow }) => {
  const axiosInstance = useAxiosInterceptor();
  const [expenses, setExpenses] = useState([]);
  const [data, setData] = useState({
    title: {},
    priceWithVAT: '',
    priceWithoutVAT: '',
    date: '',
    comment: '',
    files: [],
  });

  const onSelect = (...selectedOption) => {
    const selectedObj = expenses.find(item => item.id === selectedOption[1].value);
    setData(prev => ({ ...prev, title: selectedObj }));
  };

  const handleChange = e => {
    const { id, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [id]: value,
    }));
  };

  const updateFile = e => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setData(prev => ({ ...prev, files: files }));
    }
  };

  const hasEmptyKeys = obj => {
    const excludedKeys = ['comment', 'files']; // Ключи, которые нужно игнорировать
    return Object.keys(data).some(
      key =>
        !excludedKeys?.includes(key) && (data[key] === '' || data[key] === null || data[key] === undefined || Object.keys(data[key]).length === 0),
    );
  };

  useEffect(() => {
    const getExpenses = async () => {
      try {
        const res = await getData(applicationUrl.expensesUrl(), axiosInstance);

        setExpenses(res);
      } catch (error) {
        console.log(error);
      }
    };
    getExpenses();
  }, []);

  return (
    <Container className="bg-info-subtle p-3 rounded-4">
      <Row>
        <Col>
          <div className="col-6 mx-auto mb-3">
            <SelectComponent
              data={expenses.map(el => ({
                value: el.id,
                label: el.name,
              }))}
              multiSelection={false}
              selectHandler={onSelect}
            />
          </div>
          <div className="d-flex justify-content-between align-items-center column-gap-3 flex-wrap">
            <Form.Label>
              <Form.Control
                className={`shadow ${styles.input}`}
                id="priceWithVAT"
                min="0"
                type="number"
                placeholder="Цена с НДС"
                value={data.priceWithVAT}
                onChange={handleChange}
              />
            </Form.Label>
            <Form.Label>
              <Form.Control
                className={`shadow ${styles.input}`}
                id="priceWithoutVAT"
                type="number"
                min="0"
                placeholder="Цена без НДС"
                value={data.priceWithoutVAT}
                onChange={handleChange}
                style={{ maxWidth: '130px' }}
              />
            </Form.Label>
            <Form.Label>
              <Form.Control className="shadow" type="date" id="date" value={data.date} onChange={handleChange} />
            </Form.Label>
            <Form.Label>
              <Form.Control
                className={`shadow ${styles.textarea}`}
                as="textarea"
                placeholder="Введите комментарий"
                style={{ resize: 'none' }}
                id="comment"
                value={data.comment}
                onChange={handleChange}
              />
            </Form.Label>
            <Form.Label>
              <Form.Control className="shadow" type="file" multiple onChange={updateFile} />
            </Form.Label>
          </div>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex  justify-content-end align-items-center column-gap-3">
          <Button size="sm" variant="danger" onClick={close}>
            Отмена
          </Button>
          <Button
            size="sm"
            variant="success"
            disabled={hasEmptyKeys(data)}
            onClick={() => {
              addRow(data);
              close();
            }}
          >
            Добавить
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
