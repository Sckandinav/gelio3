import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { Table, Container, Row, Col, Button, Modal, Dropdown, DropdownButton, Form, Alert, Accordion, ListGroup } from 'react-bootstrap';
import html2pdf from 'html2pdf.js';

import { userSelectors } from '../../../store/selectors/userSelectors';
import { showSuccess, showError } from '../../../store/slices/toast';
import { getData } from '../../../api/getData';
import { useAxiosInterceptor } from '../../hoc/useAxiosInterceptor';
import { fetchApprove } from '../../../api/Applications/approve.js';
import { SelectComponent } from '../../Select/Select.jsx';
import { fetchUsers } from '../../../api/fetchUsers.js';
import { links, applicationActionsUrl, applicationUrl } from '../../../routes/routes.js';
import { Spinner } from '../../Spinner/Spinner.jsx';
import { useUserToken } from '../../hoc/useUserToken.js';

import styles from './Application.module.scss';

export const Application = () => {
  const { id } = useParams();

  const [isConfirm, setIsConfirm] = useState(false);
  const [data, setData] = useState([]);
  const [actionsOpen, setActionsOpen] = useState('');
  const [action, setAction] = useState('');
  const [rowData, setRowData] = useState({});

  const [ceoList, setCeoList] = useState([]);
  const [selectedCeo, setSelectedCeo] = useState('');
  const [ceoConfirm, SetCeoConfirm] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [print, setPrint] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = useUserToken();

  const dispatch = useDispatch();
  const axiosInstance = useAxiosInterceptor();

  const inputRefs = useRef({});

  const [editCell, setEditCell] = useState(null);
  const [editedValue, setEditedValue] = useState({
    amountWithNds: '',
    amountWithoutNds: '',
  });
  const navigate = useNavigate();

  const selectedHandler = (...props) => {
    setSelectedUser(props[1]);
  };

  const multiSelectedHandler = (...props) => {
    setSelectedUser(prev => [...prev, props[1]]);
  };

  const managerSelectHandler = data => {
    selectedUser.some(user => user.id === data.id)
      ? setSelectedUser(prev => prev.filter(user => user.id !== data.id))
      : setSelectedUser(prev => [...prev, data]);
  };

  const contentRef = useRef(null);
  //pdf
  const handleGeneratePDF = async () => {
    const element = contentRef.current;
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 300));
    setPrint(true);
    await new Promise(resolve => setTimeout(resolve, 200));

    const options = {
      margin: 1,
      filename: `Заявка на перечисление д/с ${data?.agro} №${data.id} от ${new Date(data?.created_at).toLocaleDateString()}.pdf`, // Имя файла
      image: { type: 'jpeg', quality: 2 },
      html2canvas: { scale: 3 },
      jsPDF: { unit: 'cm', format: 'a4', orientation: 'landscape' },
    };

    await html2pdf()
      .set(options)
      .from(element)
      .output('dataurlnewwindow')
      .then(() => {
        setLoading(false);
        setPrint(false);
      });
  };

  const fetchData = async () => {
    try {
      const response = await getData(applicationUrl.getTask(id), axiosInstance);
      setData(response);
    } catch (error) {
      console.log(error);
    }
  };

  const getUsers = async () => {
    try {
      const res = await fetchUsers(links.getUsers(), axiosInstance);

      const options = res.reduce((acc, user) => {
        acc.push({
          value: user.id,
          label: user.full_name,
          companyName: user.user_post_departament.length > 0 ? user.user_post_departament[0].company_name : null,
          post: user.user_post_departament.length > 0 ? user.user_post_departament[0].post_name : null,
        });
        return acc;
      }, []);

      setUsers(options);
    } catch (error) {
      console.log(error);
    }
  };

  const addRowApprover = async () => {
    try {
      await axiosInstance.post(
        applicationActionsUrl.addApprover(rowData.id),
        { selectedApprover: selectedUser.value },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        },
      );
      dispatch(showSuccess('Сотрудник назначен'));
      setSelectedUser([]);
      fetchData();
    } catch (error) {
      dispatch(showError('Не удалось назначить сотрудника'));
      console.log(error);
    }
  };

  const canInviteManagers = () => {
    const managersInApp = data.managers_approvals?.map(user => user.manager_id);
    return users.filter(user => !managersInApp?.includes(`${user.value}`));
  };

  const addManagers = async () => {
    try {
      await axiosInstance.post(
        applicationActionsUrl.addManagers(id),
        { selectedManagers: selectedUser },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        },
      );

      dispatch(showSuccess('Руководители назначены'));
      setSelectedUser([]);
      fetchData();
    } catch (error) {
      dispatch(showError('Не удалось назначить руководителя'));
      console.log(error);
    }
  };

  const removeManagers = async () => {
    try {
      await axiosInstance.post(
        applicationActionsUrl.removeManagers(id),
        { selectedManagers: selectedUser },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        },
      );

      dispatch(showSuccess('Руководитель убран'));
      setSelectedUser([]);
      fetchData();
    } catch (error) {
      dispatch(showError('Не удалось убрать руководителя'));
      console.log(error);
    }
  };

  const approveManagers = async () => {
    try {
      await axiosInstance.post(
        applicationActionsUrl.approveManagers(id),
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        },
      );
      dispatch(showSuccess('Расходы согласованы'));
      fetchData();
    } catch (error) {
      dispatch(showError('Не удалось согласовать расходы'));
      console.log(error);
    }
  };

  let rowCount = 0;

  const currentUserID = useSelector(userSelectors)?.data?.user?.id;
  const currentUserGroup = useSelector(userSelectors)?.data?.user?.groups_names;
  const isSecretary = currentUserGroup.includes('Заявки');

  const isDisableBtn = row => {
    if (row.item_approvals[0]?.approved === true) {
      return true;
    } else if (!isRowApproved(row) && isSecretary) {
      return false;
    } else {
      return !isApprover(row);
    }
  };

  const handleDoubleClick = (rowId, field) => {
    setEditCell({ rowId, field });
  };

  const setAmountWithNds = e => {
    setEditedValue(prev => ({ ...prev, amountWithNds: e.target.value }));
  };

  const handleSave = e => {
    e.preventDefault();
    setEditCell(null);
    setEditedValue(prev => ({ ...prev, amountWithNds: '', amountWithoutNds: '' }));
  };

  const cancelEdit = e => {
    e.preventDefault();
    setEditCell(null);
    setEditedValue(prev => ({ ...prev, amountWithNds: '', amountWithoutNds: '' }));
  };

  const setActionsData = str => {
    if (action === str) {
      setAction('');
    }
    setAction(str);
  };

  const actionPopupToggle = id => {
    if (actionsOpen === id) {
      setActionsOpen('');
    } else {
      setActionsOpen(id);
    }
  };

  const confirmToggleBtn = () => {
    setIsConfirm(prev => !prev);
  };

  const setCeo = data => {
    setSelectedCeo(data.target.value);
  };

  const dataSorting = data?.items?.reduce((acc, curr) => {
    const { cost_item_group_name } = curr;
    if (!acc[cost_item_group_name]) {
      acc[cost_item_group_name] = [];
    }
    acc[cost_item_group_name].push(curr);
    return acc;
  }, {});

  const totalInGroupWithNds = groupItems => {
    const sum = groupItems.reduce((acc, curr) => {
      const amount = curr.item_approvals[0]?.amount_with_nds || curr?.amount_with_nds;
      return acc + Number(amount);
    }, 0);

    return Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(sum);
  };

  const totalInGroupWithoutNds = groupItems => {
    const sum = groupItems.reduce((acc, curr) => {
      const amount = curr.item_approvals[0]?.amount_without_nds || curr?.amount_without_nds;
      return acc + Number(amount);
    }, 0);

    return Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(sum);
  };

  const totalWithNds = () => {
    const { items } = data;

    const sum = items?.reduce((acc, curr) => {
      return acc + Number(curr.item_approvals[0]?.amount_with_nds || curr?.amount_with_nds);
    }, 0);

    return Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(sum);
  };

  const totalWithoutNds = () => {
    const { items } = data;

    const sum = items?.reduce((acc, curr) => {
      return acc + Number(curr.item_approvals[0]?.amount_without_nds || curr?.amount_without_nds);
    }, 0);

    return Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(sum);
  };

  const ceoConfirmToggle = () => {
    SetCeoConfirm(prev => !prev);
  };

  const isApprover = row => {
    return Number(row?.item_approvals[0]?.approver) === Number(currentUserID);
  };
  const isRowApproved = row => row?.item_approvals[0]?.approved;

  const approveRowFunc = async data => {
    try {
      await axiosInstance.patch(applicationActionsUrl.approveRow(data.id), data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });
      dispatch(showSuccess('Заявка согласована'));
      fetchData();
      setAction('');
    } catch (error) {
      dispatch(showError('Не удалось согласовать заявку'));
      console.log(error);
    }
  };

  const approveFunc = async () => {
    try {
      const response = await fetchApprove(id, axiosInstance);
      if (response === 'ok') {
        dispatch(showSuccess('Заявка согласована'));
        confirmToggleBtn();
        fetchData();
      }
    } catch (error) {
      console.log(error);
      dispatch(showError('Не удалось согласовать заявку'));
    }
  };

  const setAmountWithoutNds = e => {
    setEditedValue(prev => ({ ...prev, amountWithoutNds: e.target.value }));
  };

  const verificationOfApproval = user => {
    if (+currentUserID === +user.approver_id) {
      if (user.approved) {
        return (
          <div className="p-0 m-0">
            <p className="p-0 m-0 text-success fst-italic">Согласована</p>
            <span className="p-0 m-0 text-success fst-italic">{new Date(user.updated_at).toLocaleDateString()}</span>
          </div>
        );
      } else {
        return (
          <Button size="sm" variant="outline-success" onClick={confirmToggleBtn}>
            Утвердить
          </Button>
        );
      }
    } else {
      if (user.approved) {
        return (
          <div className="p-0 m-0">
            <p className=" p-0 m-0 text-success fst-italic">Согласована</p>
            <span className=" p-0 m-0 text-success fst-italic">{new Date(user.updated_at).toLocaleDateString()}</span>
          </div>
        );
      } else {
        return (
          <div>
            <p>На согласовании</p>
          </div>
        );
      }
    }
  };

  const verificationOfManager = user => {
    if (user.approved) {
      return (
        <div className="p-0 m-0">
          <p className="p-0 m-0 text-success fst-italic">Согласована</p>
          <span className="p-0 m-0 text-success fst-italic">{new Date(user.updated_at).toLocaleDateString()}</span>
        </div>
      );
    }

    if (+currentUserID === +user.manager_id) {
      return (
        <Button size="sm" variant="outline-success" onClick={() => approveManagers('approveManagers')}>
          Утвердить
        </Button>
      );
    } else {
      return (
        <div>
          <p>На согласовании</p>
        </div>
      );
    }
  };

  const costChangeChek = row => {
    return row.item_approvals.length > 0 && +row.item_approvals[0].approver === +currentUserID;
  };

  const removeApprove = async (rowID, userID) => {
    try {
      await axiosInstance.delete(applicationActionsUrl.removeUser(rowID), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        data: {
          selectedApprover: userID,
        },
      });
      dispatch(showSuccess('Согласующий сотрудник убран'));
      setAction('');
      fetchData();
    } catch (error) {
      dispatch(showError('Не удалось убрать согласующего сотрудника'));
      console.log(error);
    }
  };

  const ceoApprove = async () => {
    try {
      await axiosInstance.post(
        applicationUrl.approveByCeo(id),
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        },
      );
      dispatch(showSuccess('Заявка утверждена'));
      ceoConfirmToggle();
      fetchData();
    } catch (error) {
      dispatch(showError('Не удалось выполнить действие'));
      console.log(error);
    }
  };

  const getCeoList = async () => {
    if (ceoList.length > 0) {
      return;
    }
    try {
      const response = await axiosInstance.get(links.ceoList(), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });

      setCeoList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSelectedCeo = async () => {
    try {
      await axiosInstance.post(
        applicationActionsUrl.approveCeo(id),
        {
          ceo_id: selectedCeo,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        },
      );
      dispatch(showSuccess('Согласующий добавлен'));
      setSelectedCeo('');
      fetchData();
    } catch (error) {
      dispatch(showError('Не удалось выполнить действие'));
      console.log(error);
    }
  };

  const fetchRemoveCeo = async () => {
    try {
      await axiosInstance.delete(applicationActionsUrl.removeCeo(id), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });
      setSelectedCeo('');
      dispatch(showSuccess('Согласующий убран'));
      fetchData();
    } catch (error) {
      dispatch(showError('Не удалось выполнить действие'));
      console.log(error);
    }
  };

  const AbbreviationOfName = str => {
    if (!str || typeof str !== 'string') {
      return '';
    }
    const [surname, name, patronymic] = str.split(' ');
    return `${surname} ${name[0]}. ${patronymic[0]}.`;
  };

  const withoutApprovalToggle = async (value, id) => {
    try {
      await axiosInstance.patch(
        applicationActionsUrl.withoutApprovalToggle(id),
        { need_approve: value },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        },
      );
      dispatch(showSuccess(`${value ? 'Строке вернули возможность назначения' : 'Строка без согласующего'}`));
      fetchData();
    } catch (error) {
      dispatch(showError('Не удалось выполнить действие'));
      console.log(error);
    }
  };

  const showApprovalsInfo = row => {
    if (!row.need_approve) {
      return '-';
    }

    return row.item_approvals.length === 0 ? 'Не назначен' : row.item_approvals[0]?.approver_name;
  };

  const showApprovalsStatus = row => {
    if (!row.need_approve) {
      return '-';
    }

    return row.item_approvals.length > 0 && row.item_approvals[0].approved ? (
      <span className="p-0 m-0 text-success fst-italic">Согласована {new Date(row.item_approvals[0].updated_at).toLocaleDateString()}</span>
    ) : (
      <span>На согласовании</span>
    );
  };

  const allItemsApproved =
    data.items?.length > 0 &&
    data.items?.every(item => item.item_approvals.every(user => user.approved === true)) &&
    data.managers_approvals?.length > 0 &&
    data.managers_approvals?.every(manager => manager.approved === true);

  const costWithNdsChange = (rowID, newConst) => {
    const currentRow = data.items.find(row => row.id === rowID);
    if (currentRow) {
      currentRow.item_approvals = currentRow.item_approvals.map(approval => ({
        ...approval,
        amount_with_nds: newConst,
      }));
    }
  };

  const costWithoutNdsChange = (rowID, newConst) => {
    const currentRow = data.items.find(row => row.id === rowID);
    if (currentRow) {
      currentRow.item_approvals = currentRow.item_approvals.map(approval => ({
        ...approval,
        amount_without_nds: newConst,
      }));
    }
  };

  const deleteHandler = (...props) => {
    const selectedUser = props[1];
    setSelectedUser(prev => prev.filter(user => user.value !== selectedUser.value));
    console.log(selectedUser);
  };

  useEffect(() => {
    fetchData();
    getUsers();
    getCeoList();
  }, [id]);

  return (
    <>
      {loading && <Spinner />}
      <Container fluid className="bg-light-subtle rounded pt-3">
        <Row>
          <Col className="d-flex justify-content-between align-items-center">
            <Button variant="outline-primary" onClick={() => navigate(-1)}>
              Назад
            </Button>
            <Button variant="outline-danger" onClick={handleGeneratePDF}>
              Скачать PDF
            </Button>
          </Col>
        </Row>

        <div ref={contentRef}>
          <Row>
            <Col>
              <p className="m-0">
                исх. № {data.id} от {new Date(data.created_at).toLocaleDateString()} г.
              </p>
            </Col>
          </Row>

          <Row>
            <Col>
              <h2 className="fs-6 text fst-italic">
                <span>Заявка на перечисление денежных средств на р/с дочернего предприятия </span>
                <span className="d-block">"{data.agro}"</span>
              </h2>
            </Col>
            <Col className="col-6 col-md-4 col-lg-3">
              {allItemsApproved ? (
                !data?.ceo_data && currentUserGroup.includes('Заявки') ? (
                  <div>
                    <Form.Select name="ceo" id="ceo" onFocus={getCeoList} onChange={setCeo}>
                      <option value="">Выбрать согласующего</option>
                      {ceoList.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.full_name}
                        </option>
                      ))}
                    </Form.Select>
                    <div className="mt-2 d-flex justify-content-end column-gap-3">
                      <Button variant="outline-primary" onClick={fetchSelectedCeo} disabled={selectedCeo === ''}>
                        Назначить
                      </Button>
                      <Button variant="outline-danger" disabled={data?.ceo_data === null} onClick={fetchRemoveCeo}>
                        Убрать
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Alert variant="light">
                    <span>
                      Статус утверждения:{' '}
                      {data.approved_by_ceo ? (
                        <strong>Согласована {new Date(data.ceo_data.approved_at).toLocaleDateString()}</strong>
                      ) : +currentUserID === +data?.ceo_data?.ceo.id ? (
                        <Button size="sm" variant="outline-success" onClick={ceoConfirmToggle}>
                          Согласовать
                        </Button>
                      ) : (
                        <span>Ожидает согласования</span>
                      )}
                    </span>
                    {data.ceo_data && <p className="m-0 p-0">ООО "{data?.ceo_data?.ceo.user_post_departament[0].company_name}"</p>}
                    <p className="m-0 p-0">{data.ceo_data?.ceo.user_post_departament[0].post_name}</p>
                    <p className="m-0 p-0">{AbbreviationOfName(data?.ceo_data?.ceo?.full_name)}</p>
                    {!data.approved_by_ceo && currentUserGroup.includes('Заявки') && data.ceo_data && (
                      <Button variant="outline-danger" disabled={data?.ceo_data === null} onClick={fetchRemoveCeo}>
                        Убрать
                      </Button>
                    )}
                  </Alert>
                )
              ) : (
                <span>Ожидаем согласования</span>
              )}
            </Col>
          </Row>

          <Row>
            <Col>
              <Table responsive className={styles.table} style={{ fontSize: `${print ? '10px' : '14px'}` }}>
                <thead>
                  <tr>
                    <th rowSpan="2">№ п/п</th>
                    <th rowSpan="2">Наименование статьи расходов</th>
                    <th colSpan="2">Сумма, требующая к перечислению, (руб)</th>
                    <th rowSpan="2">Сроки исполнения</th>
                    <th rowSpan="2">Комментарии</th>
                    <th rowSpan="2" className={print ? styles.hide : ''}>
                      Файлы
                    </th>
                    <th rowSpan="2" className={print ? styles.hide : ''}>
                      Действия
                    </th>
                    <th rowSpan="2">Согласующий в УК</th>
                    <th rowSpan="2">Статус согласования</th>
                  </tr>
                  <tr>
                    <th>с НДС</th>
                    <th>без НДС</th>
                  </tr>
                  <tr>
                    <th></th>
                    <th className="fw-normal fst-italic">1</th>
                    <th className="fw-normal fst-italic">2</th>
                    <th className="fw-normal fst-italic">3</th>
                    <th className="fw-normal fst-italic">4</th>
                    <th className="fw-normal fst-italic">5</th>
                    <th className={`${print ? styles.hide : ''} fw-normal fst-italic`}>{print ? '' : 6}</th>
                    <th className={`${print ? styles.hide : ''} fw-normal fst-italic`}>{print ? '' : 7}</th>
                    <th className="fw-normal fst-italic">{print ? 6 : 8}</th>
                    <th className="fw-normal fst-italic">{print ? 7 : 9}</th>
                  </tr>
                </thead>
                <tbody>
                  {dataSorting &&
                    Object.entries(dataSorting).map(([groupName, groupItems]) => (
                      <React.Fragment key={groupName}>
                        <tr>
                          <td style={{ width: '50px' }} className="text-center">
                            {(rowCount += 1)}
                          </td>
                          <td>
                            <span className="fw-semibold">{groupName}, в т.ч.</span>
                          </td>
                          <td className="fw-semibold text-end">{totalInGroupWithNds(groupItems)}</td>
                          <td className="fw-semibold text-end">{totalInGroupWithoutNds(groupItems)}</td>
                          <td colSpan="6"></td>
                        </tr>
                        {groupItems.map(row => (
                          <tr key={groupName + row.id}>
                            <td className="text-center">{(rowCount += 1)}</td>
                            <td>
                              <span className="fst-italic ms-2">{row.cost_item_name}</span>
                            </td>
                            <td
                              style={{ width: '130px' }}
                              className={`${costChangeChek(row) && !row?.item_approvals[0]?.approved ? styles.edit : ''} text-end`}
                              onDoubleClick={() => handleDoubleClick(row.id, 'withNds')}
                            >
                              {editCell?.rowId === row.id &&
                              editCell?.field === 'withNds' &&
                              costChangeChek(row) &&
                              !row?.item_approvals[0]?.approved ? (
                                <AnimatePresence>
                                  <motion.form
                                    className={styles.cellsForm}
                                    initial={{ opacity: 0, visibility: 'hidden' }}
                                    animate={{ opacity: 1, visibility: 'visible' }}
                                    exit={{ opacity: 0, visibility: 'hidden' }}
                                  >
                                    <label htmlFor={row.id + 'withNds'}>
                                      <input
                                        id={row.id + 'withNds'}
                                        type="number"
                                        value={editedValue?.amountWithNds || ''}
                                        onChange={setAmountWithNds}
                                        ref={el => (inputRefs.current[`${row.id}-withNds`] = el)}
                                        min="0"
                                      />
                                      <div className={styles.btnsGroup}>
                                        <button
                                          disabled={editedValue.amountWithNds.length === 0}
                                          onClick={e => {
                                            handleSave(e);
                                            costWithNdsChange(row.id, editedValue.amountWithNds);
                                          }}
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#28ac61">
                                            <path d="M389-267 195-460l51-52 143 143 325-324 51 51-376 375Z" />
                                          </svg>
                                        </button>
                                        <button onClick={cancelEdit}>
                                          <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#b82b27">
                                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                                          </svg>
                                        </button>
                                      </div>
                                    </label>
                                  </motion.form>
                                </AnimatePresence>
                              ) : (
                                <AnimatePresence>
                                  <motion.span
                                    initial={{ opacity: 0, visibility: 'hidden' }}
                                    animate={{ opacity: 1, visibility: 'visible' }}
                                    exit={{ opacity: 0, visibility: 'hidden' }}
                                  >
                                    {row.item_approvals[0]?.amount_with_nds
                                      ? Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(row.item_approvals[0]?.amount_with_nds)
                                      : Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(row?.amount_with_nds)}
                                  </motion.span>
                                </AnimatePresence>
                              )}
                            </td>

                            <td
                              style={{ width: '130px' }}
                              className={`${costChangeChek(row) && !row?.item_approvals[0]?.approved ? styles.edit : ''} text-end`}
                              onDoubleClick={() => handleDoubleClick(row.id, 'withoutNds')}
                            >
                              {editCell?.rowId === row.id &&
                              editCell?.field === 'withoutNds' &&
                              costChangeChek(row) &&
                              !row?.item_approvals[0]?.approved ? (
                                <AnimatePresence>
                                  <motion.form
                                    className={styles.cellsForm}
                                    initial={{ opacity: 0, visibility: 'hidden' }}
                                    animate={{ opacity: 1, visibility: 'visible' }}
                                    exit={{ opacity: 0, visibility: 'hidden' }}
                                  >
                                    <label htmlFor={row.id + 'withoutNds'}>
                                      <input
                                        id={row.id + 'withoutNds'}
                                        type="number"
                                        value={editedValue?.amountWithoutNds || ''}
                                        onChange={setAmountWithoutNds}
                                        ref={el => (inputRefs.current[`${row.id}-withoutNds`] = el)}
                                        min="0"
                                      />

                                      <div className={styles.btnsGroup}>
                                        <button
                                          disabled={editedValue.amountWithoutNds.length === 0}
                                          onClick={e => {
                                            handleSave(e);

                                            costWithoutNdsChange(row.id, editedValue.amountWithoutNds);
                                          }}
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#28ac61">
                                            <path d="M389-267 195-460l51-52 143 143 325-324 51 51-376 375Z" />
                                          </svg>
                                        </button>
                                        <button onClick={cancelEdit}>
                                          <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#b82b27">
                                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                                          </svg>
                                        </button>
                                      </div>
                                    </label>
                                  </motion.form>
                                </AnimatePresence>
                              ) : row.item_approvals[0]?.amount_without_nds ? (
                                Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(row.item_approvals[0]?.amount_without_nds)
                              ) : (
                                Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(row.amount_without_nds)
                              )}
                            </td>
                            <td style={{ width: '100px' }}>{new Date(row.date_end).toLocaleDateString()}</td>
                            <td>{row.comment}</td>
                            <td className={print ? styles.hide : ''}>
                              <ul className=" m-0 p-0" style={{ width: '100px', listStyle: 'none' }}>
                                {row.files.map(file => (
                                  <li key={file.id} className="overflow-hidden" style={{ wordWrap: 'normal', textOverflow: 'ellipsis' }}>
                                    <a className="overflow-hidden" title={file.file_name} target="_blank" rel="noopener noreferrer" href={file.file}>
                                      {file.file_name}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </td>
                            <td className={print ? styles.hide : ''}>
                              <DropdownButton
                                size="sm"
                                title={'Действия'}
                                onClick={() => {
                                  actionPopupToggle(groupName + row.id);
                                  setRowData(row);
                                }}
                                disabled={isDisableBtn(row)}
                              >
                                {isSecretary && row.item_approvals.length === 0 && row.need_approve && (
                                  <Dropdown.Item as={'button'} onClick={() => setActionsData('Добавить согласующего')}>
                                    Добавить согласующего
                                  </Dropdown.Item>
                                )}
                                {isSecretary && row.item_approvals.length > 0 && !row.item_approvals[0]?.approved && (
                                  <Dropdown.Item as={'button'} onClick={() => setActionsData('Убрать согласующего')}>
                                    Убрать согласующего
                                  </Dropdown.Item>
                                )}

                                {isSecretary && row.item_approvals.length === 0 && row.need_approve && (
                                  <Dropdown.Item as={'button'} onClick={() => withoutApprovalToggle(false, row.id)}>
                                    Без согласования
                                  </Dropdown.Item>
                                )}

                                {isSecretary && !isRowApproved(row) && !row.need_approve && (
                                  <Dropdown.Item as={'button'} onClick={() => withoutApprovalToggle(true, row.id)}>
                                    Вернуть согласование
                                  </Dropdown.Item>
                                )}

                                {isApprover(row) && !isRowApproved(row) && (
                                  <Dropdown.Item as={'button'} onClick={() => setActionsData('Согласовать')}>
                                    Согласовать
                                  </Dropdown.Item>
                                )}
                              </DropdownButton>
                            </td>
                            <td>{showApprovalsInfo(row)}</td>
                            <td>{showApprovalsStatus(row)}</td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  <tr>
                    <td className="text-center">{(rowCount += 1)} </td>
                    <td>
                      <span className="fw-bold">Итого:</span>
                    </td>
                    <td className="text-end fw-bold">{totalWithNds(data)}</td>
                    <td className="text-end fw-bold">{totalWithoutNds(data)}</td>
                    <td colSpan="6"></td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>

          <Row>
            <Col className="col-4">
              <Table className={styles.agroTable} style={{ fontSize: `${print ? '10px' : '14px'}` }}>
                <thead>
                  <tr>
                    <th>Список согласующих</th>
                    <th>Информация</th>
                  </tr>
                </thead>
                <tbody>
                  {data.user_approvals &&
                    data.user_approvals.map(user => (
                      <tr key={user.id}>
                        <td>
                          <span> {user?.approver_name}</span>
                          <span className="d-block">{user.approver_post}</span>
                        </td>
                        <td>{verificationOfApproval(user)}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Col>

            <Col sm={4}>
              {data.managers_approvals ? (
                <Table className={styles.agroTable} style={{ fontSize: `${print ? '10px' : '14px'}` }}>
                  <thead>
                    <tr>
                      <th>Руководители отделов</th>
                      <th>Информация</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.managers_approvals.map(user => (
                      <tr key={user.id}>
                        <td>
                          <span> {user?.manager_name}</span>
                          <span className="d-block">{user.manager_post}</span>
                        </td>
                        <td>{verificationOfManager(user)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : null}
            </Col>
            {isSecretary && (
              <Col sm={2} className={print ? styles.hide : ''}>
                <Button
                  className="mb-2"
                  variant="outline-success"
                  onClick={() => setAction('addManagers')}
                  size="sm"
                  style={{ width: '175px', textAlign: 'left' }}
                  disabled={data.approved_by_ceo}
                >
                  Добавить руководителя
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={() => setAction('removeManagers')}
                  size="sm"
                  style={{ width: '175px', textAlign: 'left' }}
                  disabled={data.managers_approvals?.every(managers => managers.approved)}
                >
                  Убрать руководителя
                </Button>
              </Col>
            )}
          </Row>
        </div>
        {data?.items?.some(item => {
          const approvals = item.item_approvals[0];
          return (
            (approvals?.amount_with_nds !== null && approvals?.amount_with_nds !== undefined && approvals?.approved === true) ||
            (approvals?.amount_without_nds !== null && approvals?.amount_without_nds !== undefined && approvals?.approved === true)
          );
        }) && (
          <Accordion flush className="mb-3">
            <Accordion.Item></Accordion.Item>
            <Accordion.Header>Протокол изменений</Accordion.Header>
            <Accordion.Body>
              <ListGroup>
                {data.items.map(item => {
                  const approvals = item.item_approvals[0];
                  if (approvals?.amount_with_nds !== null && approvals?.amount_without_nds !== null) {
                    return (
                      <ListGroup.Item key={item.id}>
                        {approvals?.amount_with_nds !== null && (
                          <span>
                            Стоимость с НДС на "{item.cost_item_name}" была изменена сотрудником {approvals?.approver_name} с{' '}
                            {Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(item.amount_with_nds)} руб на{' '}
                            {Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(approvals?.amount_with_nds)} руб.
                          </span>
                        )}

                        {approvals?.amount_without_nds !== null && (
                          <span>
                            Стоимость без НДС на "{item.cost_item_name}" была изменена сотрудником {approvals?.approver_name} с{' '}
                            {Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(item.amount_without_nds)} руб на{' '}
                            {Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(approvals?.amount_without_nds)} руб.
                          </span>
                        )}
                      </ListGroup.Item>
                    );
                  }
                  return null;
                })}
              </ListGroup>
            </Accordion.Body>
          </Accordion>
        )}
      </Container>

      <Modal show={isConfirm} onHide={confirmToggleBtn}>
        <Modal.Header>
          <Modal.Title>Подтверждение действия</Modal.Title>
        </Modal.Header>

        <Modal.Body>Вы действительно хотите согласовать расходы?</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={confirmToggleBtn}>
            Отменить
          </Button>
          <Button variant="outline-success" onClick={() => approveFunc(id)}>
            Согласовать
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={action === 'Добавить согласующего'}
        onHide={() => {
          setAction('');
          setSelectedUser([]);
        }}
      >
        <Modal.Header>
          <Modal.Title>Добавить согласующего</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SelectComponent data={users} multiSelection={false} selectHandler={selectedHandler} />
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={selectedUser.length === 0}
            onClick={() => {
              addRowApprover();
              setAction('');
              setSelectedUser([]);
            }}
          >
            Добавить
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={action === 'addManagers'}
        onHide={() => {
          setAction('');
          setSelectedUser([]);
        }}
      >
        <Modal.Header>
          <Modal.Title>Добавить руководителей отделов</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SelectComponent
            data={canInviteManagers()}
            multiSelection={true}
            selectHandler={multiSelectedHandler}
            selected={selectedUser}
            deleteHandler={deleteHandler}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={selectedUser.length === 0}
            onClick={() => {
              addManagers();
              setAction('');
              setSelectedUser([]);
            }}
          >
            Добавить
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={action === 'removeManagers'}
        onHide={() => {
          setAction('');
          setSelectedUser([]);
        }}
      >
        <Modal.Header>
          <Modal.Title>Убрать руководителя отдела</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {data?.managers_approvals
              ?.filter(user => !user.approved)
              ?.map(user => (
                <ListGroup.Item key={user.id} className="p-0">
                  <Form>
                    <Form.Label
                      className="d-flex align-items-center m-0 p-2 column-gap-2"
                      style={{ cursor: 'pointer' }}
                      onChange={() => managerSelectHandler(user)}
                    >
                      <Form.Check />
                      <span>{user.manager_name}</span>
                    </Form.Label>
                  </Form>
                </ListGroup.Item>
              ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-danger"
            disabled={selectedUser.length === 0}
            onClick={() => {
              removeManagers();
              setAction('');
              setSelectedUser([]);
            }}
          >
            Убрать
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={action === 'Убрать согласующего'}
        onHide={() => {
          setAction('');
          setSelectedUser([]);
        }}
      >
        <Modal.Header>
          <Modal.Title>{action}</Modal.Title>
        </Modal.Header>
        <Modal.Body>Вы действительно хотите убрать согласующего?</Modal.Body>
        <Modal.Footer>
          <Button onClick={() => removeApprove(rowData.id, rowData.item_approvals[0]?.approver)}>Убрать</Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={action === 'Согласовать'}
        onHide={() => {
          setAction('');
          setSelectedUser([]);
        }}
      >
        <Modal.Header>
          <Modal.Title>Подтверждение согласования</Modal.Title>
        </Modal.Header>
        <Modal.Body>Вы действительно хотите согласовать расходы?</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={() => setAction('')}>
            Отменить
          </Button>
          <Button variant="outline-success" onClick={() => approveRowFunc(rowData)}>
            Согласовать
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={ceoConfirm} onHide={ceoConfirmToggle}>
        <Modal.Header>
          <Modal.Title>Подтверждение согласования</Modal.Title>
        </Modal.Header>
        <Modal.Body>Вы действительно хотите согласовать расходы?</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={ceoConfirmToggle}>
            Отменить
          </Button>
          <Button variant="outline-success" onClick={() => ceoApprove()}>
            Согласовать
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={action === 'Согласовать'}
        onHide={() => {
          setAction('');
          setSelectedUser([]);
        }}
      >
        <Modal.Header>
          <Modal.Title>Подтверждение согласования</Modal.Title>
        </Modal.Header>
        <Modal.Body>Вы действительно хотите согласовать расходы?</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={() => setAction('')}>
            Отменить
          </Button>
          <Button variant="outline-success" onClick={() => approveRowFunc(rowData)}>
            Согласовать
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={action === 'approveManagers'}>
        <Modal.Header>
          <Modal.Title>Подтверждение согласования</Modal.Title>
        </Modal.Header>
        <Modal.Body>Вы действительно хотите согласовать расходы?</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={() => setAction('')}>
            Отменить
          </Button>
          <Button variant="outline-success" onClick={() => approveManagers()}>
            Согласовать
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
