import React, { useEffect, useState } from 'react';
import { Form, Container, Row, Col, Button } from 'react-bootstrap';

import { rubles } from 'rubles';

import { useAxiosInterceptor } from '../hoc/useAxiosInterceptor';
import { getData } from '../../api/getData';
import { links } from '../../routes/routes.js';

export const CreatePayment = () => {
  const [state, setState] = useState({ payer: '', to: '', contractNumber: '', item: '', forWhom: '', sum: '', signer: '', date: '' });
  const [agroList, setAgroList] = useState([]);
  const axiosInstance = useAxiosInterceptor();

  const inputHandler = (key, event) => {
    setState(prev => ({ ...prev, [key]: event.target.value }));
  };

  useEffect(() => {
    const getAgro = async () => {
      try {
        const response = await getData(links.getAgro(), axiosInstance);
        const options = response.map(el => ({ value: el.id, label: el.name }));
        setAgroList(options);
      } catch (error) {
        console.log(error);
      }
    };
    getAgro();
  }, []);

  return (
    <Container>
      <Row>
        <Col md={10}>
          <Form className="border border-2 border-light-subtle p-4 rounded-4">
            <Form.Group as={Row} className="mb-3">
              <Form.Label className="fw-bold" column sm={5} htmlFor="payer">
                Наименование предприятия-плательщика
              </Form.Label>
              <Col sm={6}>
                <Form.Control id="payer" value={state.payer} type="text" onChange={e => inputHandler('payer', e)} required />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label className="fw-bold" column sm={1} htmlFor="to">
                Кому
              </Form.Label>
              <Col sm={7}>
                <Form.Select id="to" value={state.to} onChange={e => inputHandler('to', e)} required>
                  <option value="">Выберите предприятие</option>
                  {agroList.map(el => (
                    <option key={el.value} value={el.value}>
                      {el.label}
                    </option>
                  ))}
                </Form.Select>
                <Form.Label className="fst-italic" style={{ fontSize: '13px' }} htmlFor="some">
                  Наименование предприятия-получателя денежных средств
                </Form.Label>
              </Col>
              <Col sm={4}>
                <Form.Control id="some" type="text" placeholder="Ввод вручную" required />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label className="fw-bold" column sm={2} htmlFor="contractNumber">
                № счета(договора)
              </Form.Label>
              <Col sm={5}>
                <Form.Control
                  id="contractNumber"
                  type="text"
                  value={state.contractNumber}
                  onChange={e => inputHandler('contractNumber', e)}
                  required
                />
              </Col>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold" htmlFor="item">
                Товар (назначение платежа)
              </Form.Label>
              <Form.Control id="item" type="text" value={state.item} onChange={e => inputHandler('item', e)} required />
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label className="fw-bold" column sm={1} htmlFor="forWhom">
                За кого
              </Form.Label>
              <Col sm={7}>
                <Form.Control id="forWhom" type="text" value={state.forWhom} onChange={e => inputHandler('forWhom', e)} required />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label className="fw-bold" column sm={1} htmlFor="sum">
                Сумма
              </Form.Label>
              <Col sm={2}>
                <Form.Control id="sum" type="number" value={state.sum} onChange={e => inputHandler('sum', e)} required />
              </Col>
              <Col sm={9}>
                <Form.Text className="text-muted" style={{ lineHeight: '38px' }}>
                  {rubles(state.sum)}
                </Form.Text>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3 d-flex justify-content-between">
              <Col sm={5}>
                <Form.Label className="fw-bold" htmlFor="signer">
                  Ф.И.О., подпись ответственного лица
                </Form.Label>
                <Form.Control id="signer" type="text" value={state.signer} onChange={e => inputHandler('signer', e)} required />
              </Col>
              <Col sm={2}>
                <Form.Label className="fw-bold" htmlFor="date">
                  Дата
                </Form.Label>
                <Form.Control id="date" type="date" value={state.date} onChange={e => inputHandler('date', e)} required />
              </Col>
            </Form.Group>

            <Button variant="primary" type="submit">
              Отправить
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
