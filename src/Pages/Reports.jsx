import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Table, Spinner } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

import { reports } from '../routes/routes.js';
import { useAxiosInterceptor } from '../Components/hoc/useAxiosInterceptor.jsx';
import styles from './styles/Сommon.module.scss';
import reportsStyles from './styles/Reports.module.scss';
import { getData } from '../api/getData.js';

const reportsTypes = [
  {
    id: 1,
    name: 'Заявки на ДС от дочерних компаний',
  },
  {
    id: 2,
    name: 'Заявки на оплату',
  },
];

export const Reports = () => {
  const [data, setData] = useState([]);
  const [state, setState] = useState({
    dateStart: '',
    dateEnd: '',
  });
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const addParam = () => {
    const newSearchParams = new URLSearchParams(searchParams);

    Object.entries(state).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });

    setSearchParams(newSearchParams);
  };

  const axiosInstance = useAxiosInterceptor();

  const groupedData = () => {
    const result = data.reduce((acc, item) => {
      const bankFrom = `${item.bank_from || 'Не указан'}-${new Date(item.created_at).toLocaleDateString()}`;
      const key = `${item.bank_to}-${item.payer_to}`;

      if (!acc[bankFrom]) {
        acc[bankFrom] = {};
      }

      if (!acc[bankFrom][key]) {
        acc[bankFrom][key] = { ...item, amount: Number(item.amount) };
      } else {
        acc[bankFrom][key].amount += Number(item.amount);
      }

      return acc;
    }, {});

    return Object.entries(result).reduce((acc, [bankFrom, groupedItems]) => {
      acc[bankFrom] = Object.values(groupedItems);
      return acc;
    }, {});
  };

  const formHandler = (key, e) => {
    setState(prev => ({ ...prev, [key]: e.target.value }));
  };

  const calculateSum = groupItems => {
    const sum = groupItems.reduce((acc, curr) => {
      acc += Number(curr.amount);
      return acc;
    }, 0);

    return sum.toLocaleString('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getReport = async e => {
    setLoading(true);
    addParam();
    e.preventDefault();
    try {
      const response = await getData(reports.reports(), axiosInstance, state);
      setData(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className={`bg-light-subtle rounded pt-3 ${styles.inner}`}>
      <Form onSubmit={getReport}>
        {/* <Row>
          <Col>
            <Form.Group as={Row} className="mb-2">
              <Form.Label column xl={1} htmlFor="state.type">
                Тип отчета
              </Form.Label>
              <Col xl={3}>
                <Form.Select id="state.type" value={state.type} onChange={e => formHandler('type', e)}>
                  <option value="">Выберите тип отчета</option>
                  {reportsTypes.map(el => (
                    <option value={el.id} key={el.id}>
                      {el.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>
          </Col>
        </Row> */}
        <Row>
          <Col>
            <Form.Group as={Row} className="mb-2">
              <Form.Label column xl={1} htmlFor="state.dateStart">
                Дата c:
              </Form.Label>
              <Col xl={1}>
                <Form.Control id="state.dateStart" type="date" value={state.dateStart} onChange={e => formHandler('dateStart', e)} required />
              </Col>
              <Form.Label column xl={1}>
                Дата до:
              </Form.Label>
              <Col xl={1}>
                <Form.Control type="date" value={state.dateEnd} onChange={e => formHandler('dateEnd', e)} required />
              </Col>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Button size="sm" type="submit">
              Сформировать
            </Button>
          </Col>
        </Row>
      </Form>

      {loading ? (
        <Spinner />
      ) : (
        <Row>
          <Col xl={8}>
            {data.length > 0
              ? Object.entries(groupedData()).map(([groupName, groupItems]) => {
                  const [title, date] = groupName.split('-');
                  return (
                    <Table key={groupName} responsive="sm" className={reportsStyles.table}>
                      <thead>
                        <tr>
                          <th>Дата</th>
                          <th>Банк плательщика</th>
                          <th>Предприятие - получатель</th>
                          <th>Банк получателя</th>
                          <th>Сумма</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td rowSpan={groupItems.length + 1}>{date}</td>
                          <td rowSpan={groupItems.length + 1}>{title}</td>
                        </tr>
                        {groupItems.map(row => (
                          <tr key={groupName + row.id}>
                            <td>{row.payer_to}</td>
                            <td>{row.bank_to}</td>
                            <td>
                              {Number(row.amount).toLocaleString('ru-RU', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                          </tr>
                        ))}

                        <tr className="fw-semibold">
                          <td colSpan={4}>Итого по банку плательщика:</td>
                          <td>{calculateSum(groupItems)}</td>
                        </tr>
                      </tbody>
                    </Table>
                  );
                })
              : 'Нет данных'}
          </Col>
        </Row>
      )}

      {data.length > 0 && (
        <Row>
          <Col className="fw-semibold fs-5">Итого: {calculateSum(data)} руб</Col>
        </Row>
      )}
    </Container>
  );
};
