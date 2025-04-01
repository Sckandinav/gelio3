import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Container, Row, Col, Alert, Button, Modal, CloseButton, ListGroup, Form, Spinner } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import Select from 'react-select';
import html2pdf from 'html2pdf.js';
import { rubles } from 'rubles';
import _ from 'lodash';

import { payment, links } from '../../routes/routes.js';
import { useAxiosInterceptor } from '../../Components/hoc/useAxiosInterceptor.jsx';
import { useUserToken } from '../../Components/hoc/useUserToken.js';
import { getData } from '../../api/getData.js';
import { Spinner as LoadingSpinner } from '../Spinner/Spinner.jsx';
import { userSelectors } from '../../store/selectors/userSelectors.js';
import { showError, showSuccess } from '../../store/slices/toast.js';
import styles from './styles.module.scss';

const ndsType = [
  { id: 0, name: 'Без НДС' },
  { id: 5, name: '5%' },
  { id: 10, name: '10%' },
  { id: 20, name: '20%' },
];

export const PaymentItem = () => {
  const [data, setData] = useState({});
  const [editState, setEditState] = useState({});
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendData, setIsSendData] = useState(false);
  const [ceo, setCeo] = useState([]);
  const [selectedCeo, setSelectedCeo] = useState('');
  const [print, setPrint] = useState(false);
  const [modalOpen, setModalOpen] = useState({
    signer: false,
    seo: false,
    rowSignConfirm: false,
    ceoSignConfirm: false,
    paymentInformation: false,
  });
  const [banks, setBanks] = useState([]);
  const [printerLoader, setPrinterLoader] = useState(false);
  const [selected, setSelected] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosInstance = useAxiosInterceptor();
  const token = useUserToken();
  const dispatch = useDispatch();

  console.log('data', data);

  const usersIDInPayment = data.signatories?.map(el => el.user.id);

  const modalToggle = key => {
    setModalOpen(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const selectHandler = option => {
    setSelected(prev => [...prev, option]);
    setUsers(prev => prev.filter(user => user.value !== option.value));
  };

  const removeUserFromList = option => {
    setUsers(prev => [...prev, option]);
    setSelected(prev => prev.filter(user => user.value !== option.value));
  };

  const currentUserID = useSelector(userSelectors).data.user.id;
  const isCreator = +currentUserID === +data?.creator?.id;
  const isEconomist = useSelector(userSelectors)?.data?.user?.groups_names.includes('Экономисты');

  const isSignRow = data?.signatories?.some(user => user.is_signed === true);
  const isAllRowsSign = data?.signatories?.every(user => user.is_signed === true);

  //PDF
  const contentRef = useRef(null);

  const handleGeneratePDF = async () => {
    const element = contentRef.current;
    setPrinterLoader(true);

    await new Promise(resolve => setTimeout(resolve, 300));
    setPrint(true);
    await new Promise(resolve => setTimeout(resolve, 200));

    const options = {
      margin: 1,
      filename: `Заявка на перечисление д/с №${data.id} от ${new Date(data?.created_at).toLocaleDateString()}.pdf`, // Имя файла
      image: { type: 'jpeg', quality: 2 },
      html2canvas: { scale: 3 },
      jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' },
    };

    await html2pdf()
      .set(options)
      .from(element)
      .output('dataurlnewwindow')
      .then(() => {
        setPrinterLoader(false);
        setPrint(false);
      });
  };
  //end pdf

  const ceoNameFormatter = str => {
    if (str) {
      const [surname, name, patronymic] = str?.split(' ');
      return `${surname} ${name[0]}.${patronymic[0]}.`;
    }
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

  const getPayment = async () => {
    setIsLoading(true);
    try {
      const response = await getData(payment.paymentID(id), axiosInstance);
      setData(response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const needCeoToggle = async value => {
    try {
      await axiosInstance.patch(
        payment.paymentID(id),
        { need_ceo_approve: value },
        { headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` } },
      );
      dispatch(showSuccess(value ? 'Согласование ген. дир-а не требуется' : 'Требуется согласование ген. дир-а'));
      getPayment();
    } catch (error) {
      console.log('error');
      dispatch(showError('Не удалось выполнить действие'));
    }
  };

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
      const res = await getData(payment.getBanks(), axiosInstance);
      setBanks(res);
    } catch (error) {
      console.log(error);
    }
  };

  const getCeo = async () => {
    try {
      const response = await getData(links.ceoList(), axiosInstance);
      setCeo(response);
    } catch (error) {
      console.log(error);
    }
  };

  const addSigners = async () => {
    try {
      const prepareData = {
        payment_request: id,
        users: selected.map(user => user.value),
      };

      await axiosInstance.post(payment.addSigners(), prepareData, {
        headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` },
      });
      modalToggle('signer');
      dispatch(showSuccess('Пользователи добавлены'));
      getPayment();
      setSelected([]);
    } catch (error) {
      console.log(error);
      dispatch(showError('Не удалось добавить пользователей'));
    }
  };

  const removeSigner = async id => {
    try {
      await axiosInstance.delete(payment.removeSigners(id), { headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` } });
      dispatch(showSuccess('Согласующий убран'));
      getPayment();
    } catch (error) {
      dispatch(showError('Не удалось убрать согласующего'));
      console.log(error);
    }
  };

  const reassignCeo = async () => {
    try {
      await axiosInstance.patch(
        payment.paymentID(id),
        { ceo: selectedCeo },
        { headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` } },
      );
      dispatch(showSuccess('ген. дир. добавлен'));
      modalToggle('seo');
      getPayment();
    } catch (error) {
      dispatch(showError('Не удалось изменить согласующего'));
      console.log(error);
    }
  };

  const signRow = async id => {
    try {
      await axiosInstance.patch(
        payment.signetRow(id),
        { is_signed: true, signed_at: new Date().toISOString() },
        { headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` } },
      );
      dispatch(showSuccess('Заявка согласована'));
      modalToggle('rowSignConfirm');
      getPayment();
    } catch (error) {
      dispatch(showError('Не удалось согласовать заявку'));
      console.log(error);
    }
  };

  const signCeo = async () => {
    try {
      await axiosInstance.post(
        payment.signetCeo(),
        { payment_request: id, users: [data.ceo.id], is_signed: true, signed_at: new Date().toISOString() },
        { headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` } },
      );
      dispatch(showSuccess('Заявка согласована'));
      modalToggle('ceoSignConfirm');
      getPayment();
    } catch (error) {
      console.log(error);
    }
  };

  const actionsShow = row => {
    if (row.is_signed) {
      return <span className="text-success fst-italic">{`Согласована\n${new Date(row.signed_at).toLocaleDateString()}`}</span>;
    }

    if (currentUserID === row.user.id || isCreator) {
      return (
        <div>
          {+currentUserID === +row.user.id && (
            <Button size="sm" variant="outline-success" onClick={() => modalToggle('rowSignConfirm')}>
              Согласовать
            </Button>
          )}
          {isCreator && (
            <Button className={`ms-3 ${print ? styles.hide : ''}`} variant="outline-danger" size="sm" onClick={() => removeSigner(row.id)}>
              Убрать
            </Button>
          )}

          <Modal show={modalOpen.rowSignConfirm} onHide={() => modalToggle('rowSignConfirm')}>
            <Modal.Header closeButton>
              <Modal.Title>Подтверждение действие</Modal.Title>
            </Modal.Header>
            <Modal.Body>Вы действительно подтверждаете расходы?</Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={() => signRow(row.id)}>
                Подтверждаю
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    }

    return 'Ожидается согласования';
  };

  const ceoActionStatus = () => {
    if (data.is_ceo_signed) {
      return 'Заявка согласована';
    }
    if (+currentUserID === +data?.ceo?.id) {
      return (
        <Button size="sm" variant="outline-success" onClick={() => modalToggle('ceoSignConfirm')}>
          Согласовать
        </Button>
      );
    }
    return 'Ожидаем согласования';
  };

  const editModeToggle = () => {
    if (!isEdit) {
      setEditState({ ...data });
      setIsEdit(true);
    } else {
      setEditState({});
      setIsEdit(false);
    }
  };

  const editInputHandler = (key, e) => {
    setEditState(prev => ({ ...prev, [key]: e.target.value }));
  };

  const setSumInWords = e => {
    setEditState(prev => ({ ...prev, amount_str: rubles(e.target.value) }));
  };

  console.log('editState', editState);

  const isDoneInfo = () => {
    if (data.is_done) {
      return data.comment_is_done;
    }
    if ((isEconomist && data?.need_ceo_approve && data.is_ceo_signed) || !data?.need_ceo_approve) {
      return (
        <Button size="sm" variant="outline-primary" onClick={() => modalToggle('paymentInformation')}>
          Указать
        </Button>
      );
    }

    return 'Информация не указана';
  };

  const editPayment = async () => {
    setIsSendData(true);
    try {
      const formData = new FormData();

      formData.append('payer_name', editState.payer_name);
      formData.append('payer_to', editState.payer_to);
      formData.append('account_number', editState.account_number);
      formData.append('product', editState.product);
      formData.append('beneficiary', editState.beneficiary);
      formData.append('amount', editState.amount);
      formData.append('date', editState.date);
      formData.append('amount_str', editState.amount_str);
      formData.append('reference', editState.reference);
      formData.append('details', editState.details);
      formData.append('need_ceo_approve', true);
      formData.append('nds', editState.nds);

      if (editState.bank_from !== null && editState.bank_from !== '') {
        formData.append('bank_from', editState.bank_from.id ? editState.bank_from.id : editState.bank_from);
      }
      if (editState.bank_to !== null && editState.bank_to !== '') {
        formData.append('bank_to', editState.bank_to.id ? editState.bank_to.id : editState.bank_to);
      }

      await axiosInstance.put(payment.paymentID(id), formData, {
        headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` },
      });
      dispatch(showSuccess('Заявка отредактирована'));
      editModeToggle();
      getPayment();
    } catch (error) {
      dispatch(showError('Не удалось отредактировать заявку'));
      console.log(error);
    } finally {
      setIsSendData(false);
    }
  };

  const paymentInformation = async () => {
    try {
      await axiosInstance.patch(
        payment.paymentID(id),
        { is_done: true, comment_is_done: data.comment_is_done },
        { headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` } },
      );
      dispatch(showSuccess('Информация внесена'));
      modalToggle('paymentInformation');
      getPayment();
    } catch (error) {
      console.log(error);
      dispatch(showError('Не удалось внести изменение'));
    }
  };

  useEffect(() => {
    getUser();
    getCeo();
    getBanks();
    getPayment();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isLoading && data) {
    return (
      <>
        {printerLoader && <LoadingSpinner />}
        <Container className={`bg-white rounded ${print ? 'pt-0' : 'pt-3'}`} ref={contentRef}>
          <Row className=" mb-3">
            <Col className={`d-flex justify-content-between ${print ? styles.hide : ''}`}>
              <Button variant="outline-secondary" onClick={() => navigate(-1)} size="sm">
                Назад
              </Button>
              <Button size="sm" variant="outline-danger" onClick={handleGeneratePDF}>
                Открыть PDF
              </Button>
            </Col>
          </Row>
          <Row className="justify-content-end align-items-center">
            {isCreator && !data.is_done && (
              <Col className={`${print ? styles.hide : ''}`}>
                <Button className="me-2" size="sm" onClick={() => modalToggle('signer')} disabled={data.is_ceo_signed}>
                  Добавить согласующего
                </Button>
                {data.ceo && (
                  <Button size="sm" onClick={() => modalToggle('seo')} disabled={data.is_ceo_signed}>
                    Изменить согласующего ген. дир-а
                  </Button>
                )}

                {!data.ceo && data.need_ceo_approve && isAllRowsSign && (
                  <Button className="me-2" size="sm" onClick={() => modalToggle('seo')} disabled={data.is_ceo_signed}>
                    Добавить ген. дир-а
                  </Button>
                )}
                {data.need_ceo_approve && !data.is_ceo_signed && isAllRowsSign && (
                  <Button className="me-2" size="sm" onClick={() => needCeoToggle(false)}>
                    Без согласования ген. дир-а
                  </Button>
                )}
                {!data.need_ceo_approve && (
                  <Button className="me-2" size="sm" onClick={() => needCeoToggle(true)}>
                    C согласованием ген. дир-а
                  </Button>
                )}
              </Col>
            )}

            <Col lg={print ? 5 : 3} md={4} sm={6}>
              {!data.need_ceo_approve ? (
                <Alert variant="light" style={{ fontSize: `${print ? '12px' : '16px'}` }}>
                  <p className="m-0 p-0">Не требуется согласование с ген. дир-ом</p>
                </Alert>
              ) : data.ceo ? (
                <Alert variant="light" style={{ fontSize: `${print ? '12px' : '16px'}` }} className={`${print ? 'p-1 mb-1' : ''}`}>
                  <p className="m-0 p-0">Статус: {ceoActionStatus()} </p>
                  <p className="m-0 p-0">{data?.ceo?.user_post_departament[0]?.post_name}</p>
                  <p className="m-0 p-0">ООО "{data?.ceo?.user_post_departament[0]?.company_name}"</p>
                  <p className="m-0 p-0">{ceoNameFormatter(data?.ceo?.full_name)}</p>
                </Alert>
              ) : (
                <Alert variant="light" style={{ fontSize: `${print ? '12px' : '16px'}` }}>
                  <p className="m-0 p-0">Согласующий не добавлен</p>
                </Alert>
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <Table className={styles.table} style={{ fontSize: `${print ? '12px' : '14px'}` }}>
                <thead>
                  <tr>
                    <th colSpan={3}>
                      Заявка на оплату №{data.id} от {new Date(data.created_at).toLocaleDateString()}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="fw-semibold">Наименование предприятия-плательщика</td>
                    <td colSpan={2}>
                      <Row className="align-items-center">
                        <Col>
                          {isEdit && !isSignRow ? (
                            <Form.Control type="text" value={editState.payer_name} onChange={e => editInputHandler('payer_name', e)} />
                          ) : (
                            data.payer_name
                          )}
                        </Col>
                        <Col xl={3}>
                          {isEdit ? (
                            <Form.Select
                              value={editState.bank_from?.id}
                              onChange={e => editInputHandler('bank_from', e)}
                              style={{ maxWidth: '200px' }}
                            >
                              <option value="">Выберите банк</option>
                              {banks.map(el => (
                                <option value={el.id} key={el.id}>
                                  {el.name}
                                </option>
                              ))}
                            </Form.Select>
                          ) : data.bank_from ? (
                            data.bank_from.name
                          ) : (
                            'Банк не выбран'
                          )}
                        </Col>
                      </Row>
                    </td>
                  </tr>

                  <tr>
                    <td className="fw-semibold">Кому</td>
                    <td colSpan={2}>
                      <Row className="align-items-center">
                        <Col>
                          {isEdit && !isSignRow ? (
                            <Form.Control type="text" value={editState.payer_to} onChange={e => editInputHandler('payer_to', e)} />
                          ) : (
                            data.payer_to
                          )}
                        </Col>
                        <Col xl={3}>
                          {isEdit ? (
                            <Form.Select value={editState.bank_to?.id} onChange={e => editInputHandler('bank_to', e)} style={{ maxWidth: '200px' }}>
                              <option value="">Выберите банк</option>
                              {banks.map(el => (
                                <option value={el.id} key={el.id}>
                                  {el.name}
                                </option>
                              ))}
                            </Form.Select>
                          ) : data.bank_to ? (
                            data.bank_to.name
                          ) : (
                            'Банк не выбран'
                          )}
                        </Col>
                      </Row>
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-semibold">№ счета(договора)</td>
                    <td colSpan={2}>
                      {isEdit && !isSignRow ? (
                        <Form.Control type="text" value={editState.account_number} onChange={e => editInputHandler('account_number', e)} />
                      ) : (
                        data.account_number
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-semibold">Товар (назначение платежа)</td>
                    <td colSpan={2}>
                      {isEdit && !isSignRow ? (
                        <Form.Control type="text" value={editState.product} onChange={e => editInputHandler('product', e)} />
                      ) : (
                        data.product
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-semibold">За кого</td>
                    <td colSpan={2}>
                      {isEdit && !isSignRow ? (
                        <Form.Control type="text" value={editState.beneficiary} onChange={e => editInputHandler('beneficiary', e)} />
                      ) : (
                        data.beneficiary
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-semibold">Сумма</td>
                    <td>
                      {isEdit && !isSignRow ? (
                        <div>
                          <span>
                            <Form.Control
                              type="number"
                              value={editState.amount}
                              onChange={e => {
                                editInputHandler('amount', e);
                                setSumInWords(e);
                              }}
                            />
                          </span>
                          <span>
                            <Form.Select value={editState.nds} onChange={e => editInputHandler('nds', e)} style={{ maxWidth: '150px' }}>
                              {ndsType.map(el => (
                                <option value={el.id} key={el.id}>
                                  {el.name}
                                </option>
                              ))}
                            </Form.Select>
                          </span>
                        </div>
                      ) : (
                        <div className="d-flex justify-content-start align-items-center column-gap-1">
                          <span>
                            {Number(data.amount).toLocaleString('ru-RU', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                          <span>в т.ч. НДС {data.nds}%</span>
                        </div>
                      )}
                    </td>
                    <td>{isEdit && !isSignRow ? editState.amount_str : data.amount_str}</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold">Справочно</td>
                    <td colSpan={2}>
                      {isEdit && !isSignRow ? (
                        <Form.Control type="text" value={editState.reference} onChange={e => editInputHandler('reference', e)} />
                      ) : (
                        data.reference
                      )}
                    </td>
                  </tr>

                  {data.signatories?.map(user => (
                    <tr key={user.id}>
                      <td className="fw-semibold">Ф.И.О., подпись ответственного лица</td>
                      <td>{user.user.full_name}</td>
                      <td>{actionsShow(user)}</td>
                    </tr>
                  ))}

                  <tr>
                    <td className="fw-semibold">Дата исполнения платежа</td>
                    <td colSpan={2}>
                      {isEdit && !isSignRow ? (
                        <Form.Control type="date" value={editState.date} onChange={e => editInputHandler('date', e)} style={{ maxWidth: '200px' }} />
                      ) : (
                        new Date(data.date).toLocaleDateString()
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-semibold">Информация о платеже</td>
                    <td colSpan={2}>{isDoneInfo()}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>

          <Row>
            {!isEdit && !data?.is_done && (
              <Col>
                <Button size="sm" onClick={editModeToggle} className={`${print ? styles.hide : ''}`}>
                  Редактировать
                </Button>
              </Col>
            )}
            {isEdit && (
              <Col className="d-flex justify-content-between">
                <Button size="sm" onClick={editModeToggle} variant="outline-danger">
                  Отменить
                </Button>
                <Button size="sm" onClick={editPayment} variant="outline-success" disabled={_.isEqual(data, editState)}>
                  Сохранить
                </Button>
              </Col>
            )}
          </Row>

          {data.files?.length > 0 && (
            <Row className={`${print ? styles.hide : ''} mt-3`}>
              <Col sm={12} md={6} xl={4}>
                <h5>Приложенные файлы</h5>
                <ListGroup>
                  {data.files.map(file => (
                    <ListGroup.Item key={file.id} style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <a href={file.file} target="_blank" rel="noopener noreferrer" title={file.file.slice(file.file.lastIndexOf('/') + 1)}>
                        {file.file.slice(file.file.lastIndexOf('/') + 1)}
                      </a>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Col>
            </Row>
          )}

          <Modal
            show={modalOpen.signer}
            onHide={() => {
              setSelected([]);
              modalToggle('signer');
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Добавить согласующего</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Select
                options={users.filter(user => !usersIDInPayment?.includes(user.value))}
                formatOptionLabel={formatOptionLabel}
                value={null}
                placeholder="Выбор пользователя"
                onChange={selectHandler}
                className="mb-3"
              />
              {selected.length > 0 && (
                <ListGroup>
                  {selected.map(user => (
                    <ListGroup.Item key={user.value} className="d-flex justify-content-between">
                      <span>{user.label}</span>
                      <CloseButton onClick={() => removeUserFromList(user)} />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={addSigners}>
                Добавить
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={modalOpen.seo}
            onHide={() => {
              modalToggle('seo');
              setSelectedCeo('');
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Добавление ген. дир-а</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Select value={selectedCeo} onChange={e => setSelectedCeo(e.target.value)}>
                <option value="">Выбор ген. дир-а</option>
                {ceo.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.full_name}
                  </option>
                ))}
              </Form.Select>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={() => {
                  reassignCeo();
                }}
                disabled={selectedCeo.length === 0 || +selectedCeo === +data.ceo?.id}
              >
                Добавить
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={modalOpen.ceoSignConfirm} onHide={() => modalToggle('ceoSignConfirm')}>
            <Modal.Header closeButton>
              <Modal.Title>Подтверждение действие</Modal.Title>
            </Modal.Header>
            <Modal.Body>Вы действительно подтверждаете расходы?</Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={() => signCeo()}>
                Подтверждаю
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={modalOpen.paymentInformation} onHide={() => modalToggle('paymentInformation')}>
            <Modal.Header closeButton>
              <Modal.Title>Подтверждение действие</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Label>Информация о платеже</Form.Label>
              <Form.Control
                type="text"
                value={data.comment_is_done === null ? '' : data.comment_is_done}
                onChange={e => setData(prev => ({ ...prev, comment_is_done: e.target.value }))}
              ></Form.Control>
            </Modal.Body>
            <Modal.Footer>
              <Button size="sm" variant="outline-danger" onClick={() => modalToggle('paymentInformation')}>
                Назад
              </Button>
              <Button size="sm" variant="outline-success" onClick={paymentInformation} disabled={data.comment_is_done === null}>
                Подтверждаю
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </>
    );
  }
};
