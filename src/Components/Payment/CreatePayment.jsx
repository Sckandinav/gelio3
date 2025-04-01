import React, { useEffect, useState } from 'react';
import { Form, Container, Row, Col, Button, Modal, ListGroup, CloseButton, Table, Spinner } from 'react-bootstrap';
import Select from 'react-select';
import { rubles } from 'rubles';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { showError, showSuccess } from '../../store/slices/toast.js';
import { useAxiosInterceptor } from '../hoc/useAxiosInterceptor';
import { useUserToken } from '../hoc/useUserToken.js';
import { getData } from '../../api/getData';
import { links, payment } from '../../routes/routes.js';
import { userSelectors } from '../../store/selectors/userSelectors.js';

const groupType = [
  { id: 1, name: 'Экономисты' },
  { id: 2, name: 'Бухгалтерия' },
];

const ndsType = [
  { id: 0, name: 'Без НДС' },
  { id: 5, name: '5%' },
  { id: 10, name: '10%' },
  { id: 20, name: '20%' },
];

export const CreatePayment = () => {
  const currentUserID = useSelector(userSelectors).data.user.id;
  const [state, setState] = useState({
    payer_name: '',
    payer_to: '',
    account_number: '',
    product: '',
    beneficiary: '',
    amount: '',
    signatories: [],
    date: '',
    ceo: '',
    bank: '',
    bankFrom: '',
    amount_str: '',
    creator: currentUserID,
    type: '',
    reference: '',
    details: '',
    nds: 0,

    files: [],
  });

  const [banksList, setBanksList] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingSendingData, setLoadingSendingData] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [chosen, setChosen] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const axiosInstance = useAxiosInterceptor();
  const token = useUserToken();

  const inputHandler = (key, event) => {
    setState(prev => ({ ...prev, [key]: event.target.value }));
  };

  const modalToggle = () => {
    setModalOpen(prev => !prev);
  };

  const updateFile = e => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setState(prev => ({ ...prev, files: files }));
    }
  };

  const selectHandler = selected => {
    setChosen(prev => [...prev, selected]);
    setUsers(prev => prev.filter(user => user.value !== selected.value));
  };

  const removeSelectedFromList = selected => {
    setChosen(prev => prev.filter(user => user.value !== selected.value));
    setUsers(prev => [...prev, selected]);
  };

  const removeUserFormTable = selected => {
    setState(prevState => ({
      ...prevState,
      signatories: prevState.signatories.filter(user => user.value !== selected.value),
    }));
    setUsers(prev => [...prev, selected]);
  };

  const addApprovers = () => {
    setState(prev => ({ ...prev, signatories: [...prev.signatories, ...chosen] }));
    setChosen([]);
    modalToggle();
  };

  const formatOptionLabel = option => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        width: '100%',
        opacity: '1',
        visibility: 'visibility',
        fontSize: '16px',
        color: 'var(--dark)',
        gap: '10px',
        alignItems: 'center',
      }}
    >
      <span>{option.label}</span>
      {option.post && (
        <span style={{ fontStyle: 'italic', color: 'var(--text)', fontSize: '12px' }}>
          {option.companyName}, {option.post}
        </span>
      )}
    </div>
  );

  const getUser = async () => {
    try {
      const res = await getData(links.getUsers(), axiosInstance);
      const option = res.map(el => ({
        value: el.id,
        label: el.full_name,
        companyName: el.user_post_departament.length > 0 ? el.user_post_departament[0].company_name : null,
        post: el.user_post_departament.length > 0 ? el.user_post_departament[0].post_name : null,
      }));
      setUsers(option);
    } catch (error) {
      console.log(error);
    }
  };

  const getBanks = async () => {
    try {
      const response = await getData(payment.getBanks(), axiosInstance);
      setBanksList(response);
    } catch (error) {
      console.log(error);
    }
  };

  const selectChange = (key, e) => {
    setState(prev => ({ ...prev, [key]: e.target.value }));
  };

  const setSumInWords = e => {
    setState(prev => ({ ...prev, amount_str: rubles(e.target.value) }));
  };

  const addPayment = async e => {
    e.preventDefault();
    setLoadingSendingData(true);
    try {
      const formData = new FormData();

      formData.append('payer_name', state.payer_name);
      formData.append('payer_to', state.payer_to);
      formData.append('account_number', state.account_number);
      formData.append('product', state.product);
      formData.append('beneficiary', state.beneficiary);
      formData.append('amount', state.amount);
      formData.append('date', state.date);
      formData.append('ceo', state.ceo);
      formData.append('bank_to', state.bank);
      formData.append('bank_from', state.bankFrom);
      formData.append('amount_str', state.amount_str);
      formData.append('creator', state.creator);
      formData.append('reference', state.reference);
      formData.append('type', state.type);
      formData.append('details', state.details);
      formData.append('need_ceo_approve', true);
      formData.append('nds', state.nds);
      state.signatories.forEach(user => {
        formData.append('signatories', user.value);
      });

      state.files.forEach((file, index) => {
        if (file) {
          formData.append(`file_${index}`, file);
        }
      });

      await axiosInstance.post(payment.payment(), formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Token ${token}` },
      });
      dispatch(showSuccess('Заявка создана'));
      navigate(-1);
    } catch (error) {
      dispatch(showError('Не удалось создать заявку'));
      console.log(error);
    } finally {
      setLoadingSendingData(false);
    }
  };

  useEffect(() => {
    getBanks();
    getUser();
  }, []);

  return (
    <Container className="bg-light border border-2 border-light-subtle p-4 rounded-4">
      <Row>
        <Col md={12}>
          <Form onSubmit={addPayment}>
            <Form.Group as={Row} className="mb-3 align-items-center">
              <Form.Label className="fw-bold" column sm={5} xl={4} md={4} htmlFor="payer_name">
                Наименование предприятия-плательщика
              </Form.Label>
              <Col sm={4} xl={6}>
                <Form.Control id="payer_name" value={state.payer} type="text" onChange={e => inputHandler('payer_name', e)} required />
              </Col>
              <Col xl={2} md={4} sm={2}>
                <Form.Select onChange={e => selectChange('bankFrom', e)} value={state.bankFrom}>
                  <option value="">Выберите банк</option>
                  {banksList.map(el => (
                    <option value={el.id} key={el.id}>
                      {el.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label className="fw-bold" column sm={1} htmlFor="payer_to">
                Кому
              </Form.Label>
              <Col sm={7}>
                <Form.Control
                  id="payer_to"
                  value={state.payer_to}
                  type="text"
                  required
                  placeholder="Укажите предприятие"
                  onChange={e => inputHandler('payer_to', e)}
                />
                <Form.Label className="fst-italic" style={{ fontSize: '13px' }} htmlFor="some">
                  Наименование предприятия-получателя денежных средств
                </Form.Label>
              </Col>
              <Col xl={2} md={4} sm={2}>
                <Form.Select onChange={e => selectChange('bank', e)} value={state.bank}>
                  <option value="">Выберите банк</option>
                  {banksList.map(el => (
                    <option value={el.id} key={el.id}>
                      {el.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label className="fw-bold" column md={4} lg={3} xl={2} htmlFor="account_number">
                № счета(договора)
              </Form.Label>
              <Col md={7} lg={6}>
                <Form.Control
                  id="account_number"
                  type="text"
                  value={state.account_number}
                  onChange={e => inputHandler('account_number', e)}
                  required
                />
              </Col>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold" htmlFor="product">
                Товар (назначение платежа)
              </Form.Label>
              <Form.Control id="product" type="text" value={state.product} onChange={e => inputHandler('product', e)} required />
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label className="fw-bold" column xl={1} sm={2} htmlFor="beneficiary">
                За кого
              </Form.Label>
              <Col sm={10}>
                <Form.Control id="beneficiary" type="text" value={state.beneficiary} onChange={e => inputHandler('beneficiary', e)} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3 align-items-center">
              <Form.Label className="fw-bold" column xl={2} lg={3} md={3} htmlFor="details">
                № и дата договора взаиморасчетов
              </Form.Label>
              <Col>
                <Form.Control id="details" type="text" value={state.details} onChange={e => inputHandler('details', e)} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label className="fw-bold" column sm={2} lg={1} htmlFor="amount">
                Сумма
              </Form.Label>
              <Col sm={4} lg={2}>
                <Form.Control
                  id="amount"
                  type="number"
                  value={state.amount}
                  onChange={e => {
                    inputHandler('amount', e);
                    setSumInWords(e);
                  }}
                  required
                />
              </Col>
              <Col sm={9}>
                <Form.Text className="text-muted" style={{ lineHeight: '38px' }}>
                  {state.amount_str}
                </Form.Text>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label
                className="fw-bold"
                column
                sm={2}
                lg={1}
                htmlFor="nds"
                value={state.nds}
                onChange={e => {
                  inputHandler('nds', e);
                  setSumInWords(e);
                }}
              >
                в т.ч. НДС
              </Form.Label>
              <Col sm={4} lg={2}>
                <Form.Select id="nds">
                  {ndsType.map(el => (
                    <option value={el.id} key={el.id}>
                      {el.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2} lg={2} htmlFor="reference" className="fw-bold">
                Справочно:
              </Form.Label>
              <Col>
                <Form.Control id="reference" type="text" value={state.reference} onChange={e => inputHandler('reference', e)} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2} lg={1} htmlFor="type" className="fw-bold">
                Группа:
              </Form.Label>
              <Col lg={3} md={4} sm={5}>
                <Form.Select id="type" value={state.type} onChange={e => inputHandler('type', e)} required>
                  <option value="">Выбор группы</option>
                  {groupType.map(el => (
                    <option value={el.id} key={el.id}>
                      {el.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>

            {state.signatories.length > 0 && (
              <Col xl={5} lg={8} md={12}>
                <Table bordered hover responsive="md" className="align-middle">
                  <thead>
                    <tr>
                      <th>ФИО</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.signatories.map(user => (
                      <tr key={user.value}>
                        <td>{user.label}</td>
                        <td>
                          <Button size="sm" variant="outline-danger" onClick={() => removeUserFormTable(user)}>
                            Убрать
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            )}

            <Form.Group as={Row} className="mb-3 d-flex justify-content-between align-items-center">
              <Col sm={8} xl={5}>
                <Button onClick={modalToggle} size="sm" variant="outline-secondary">
                  Добавить согласующего
                </Button>
              </Col>
              <Col sm={4} xl={2}>
                <Form.Label className="fw-bold" htmlFor="date">
                  Дата исполнения платежа
                </Form.Label>
                <Form.Control id="date" type="date" value={state.date} onChange={e => inputHandler('date', e)} required />
              </Col>
            </Form.Group>

            <Form.Group className="mb-3" as={Row}>
              <Col md={3} sm={4}>
                <Form.Control type="file" multiple onChange={updateFile} />
              </Col>
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="outline-danger" onClick={() => navigate(-1)}>
                Назад
              </Button>

              {loadingSendingData ? (
                <Spinner animation="border" variant="success" />
              ) : (
                <Button variant="primary" type="submit" disabled={state.signatories.length === 0}>
                  Отправить
                </Button>
              )}
            </div>
          </Form>
        </Col>
      </Row>

      <Modal
        show={modalOpen}
        onHide={() => {
          modalToggle();
          setChosen([]);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Ф.И.О., подпись ответственного лица</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Select
            className="mb-2"
            options={users}
            formatOptionLabel={formatOptionLabel}
            placeholder="Выбор пользователя"
            onChange={selectHandler}
            value={null}
          />
          {chosen && (
            <ListGroup>
              {chosen.map(user => (
                <ListGroup.Item key={user.value} value={user.value} className="d-flex justify-content-between align-items-center">
                  {user.label}
                  <CloseButton onClick={() => removeSelectedFromList(user)} />
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-danger"
            onClick={() => {
              modalToggle();
              setChosen([]);
            }}
          >
            Отмена
          </Button>

          <Button variant="outline-success" onClick={addApprovers}>
            Добавить
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
