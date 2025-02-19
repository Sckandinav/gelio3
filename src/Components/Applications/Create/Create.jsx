import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Table, Form, Modal, ListGroup, CloseButton } from 'react-bootstrap';
import { FaEdit, FaRegSave } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { MdOutlineCancel } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux';

import { InputElem } from './InputElem';
import { fetchUsers } from '../../../api/fetchUsers.js';
import { getData } from '../../../api/getData.js';
import { useAxiosInterceptor } from '../../hoc/useAxiosInterceptor';
import { links, applicationUrl } from '../../../routes/routes.js';
import { SelectComponent } from '../../Select/Select.jsx';
import { userSelectors } from '../../../store/selectors/userSelectors.js';
import { showSuccess, showError } from '../../../store/slices/toast.js';

export const Create = ({ close, update }) => {
  const [appData, setAppData] = useState([]);
  const [agloList, setAgloList] = useState([]);
  const [users, setUsers] = useState([]);
  const [company, setCompany] = useState('');
  const [members, setMembers] = useState([]);
  const [chosen, setChosen] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [btnState, setBtnState] = useState({
    addPosition: false,
    addApproving: false,
    showMembers: false,
  });

  const { data } = useSelector(userSelectors);
  const dispatch = useDispatch();

  const axiosInstance = useAxiosInterceptor();

  const btnToggle = key => {
    setBtnState(prev => ({ ...prev, [key]: !prev[key] }));
  };
  const updateTable = data => {
    const newRow = {
      id: Date.now(),
      title: data.title,
      priceWithVAT: data.priceWithVAT,
      priceWithoutVAT: data.priceWithoutVAT,
      date: data.date,
      comment: data.comment,
      files: data.files,
    };

    setAppData(prev => [...prev, newRow]);
  };

  const formatPrice = price => {
    return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(price);
  };

  const saveRow = id => {
    setAppData(prev => prev.map(row => (row.id === id ? { ...row, ...editedRow } : row)));
    setEditingRowId(null);
  };

  const cancelEdit = () => {
    setEditingRowId(null);
    setEditedRow({});
  };

  const removeRow = id => {
    setAppData(prev => prev.filter(el => el.id !== id));
  };

  const editRow = id => {
    const rowToEdit = appData.find(row => row.id === id);
    setEditingRowId(id);
    setEditedRow(rowToEdit);
  };

  const addChosen = (...prop) => {
    const user = prop[1];
    setChosen(prev => [...prev, user]);
    setUsers(prev => prev.filter(el => el.value !== user.value));
  };

  const addUsers = () => {
    setMembers(prev => [...prev, ...chosen]);
    setChosen([]);
  };

  const removeUser = (...prop) => {
    const user = prop[1];
    setChosen(prev => prev.filter(el => el.value !== user.value));
    setUsers(prev => [...prev, user]);
  };

  const removeMember = selected => {
    setMembers(prev => prev.filter(user => user.value !== selected.value));
    setUsers(prev => [...prev, selected]);
  };

  const setCompanyData = chosen => {
    setCompany(chosen.target.value);
  };

  const prepareServerData = () => ({
    users: members,
    items: appData.map(({ files, ...rest }) => rest),
    created: {
      id: data.user.id,
      companyName: data.user.user_post_departament[0].company_name,
    },
    forCompany: company,
  });

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

  const getAgroList = async () => {
    try {
      const res = await getData(links.getAgro(), axiosInstance);
      setAgloList(res);
    } catch (error) {
      console.log(error);
    }
  };

  const CreateTask = async () => {
    const token = localStorage.getItem('token');
    const preparedData = prepareServerData();

    const formData = new FormData();
    formData.append('data', JSON.stringify(preparedData));

    appData.forEach(item => {
      item.files.forEach(file => {
        formData.append(`files[${item.id}]`, file);
      });
    });

    try {
      await axiosInstance.post(applicationUrl.createApplication(), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${token}`,
        },
      });
      dispatch(showSuccess('Заявка создана'));
      close();
      update();
    } catch (error) {
      dispatch(showError('Не удалось создать заявку'));
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
    getAgroList();
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col className="w100">
          <Table variant="outline-dark" bordered responsive style={{ tableLayout: 'fixed' }} className="align-middle" size="lg">
            <thead>
              <tr>
                <th title="Наименование статьи расходов" rowSpan="2" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Наименование статьи расходов
                </th>
                <th style={{ overflow: 'hidden', textOverflow: 'ellipsis' }} colSpan="2">
                  Сумма, требующая к перечислению
                </th>
                <th style={{ overflow: 'hidden', textOverflow: 'ellipsis' }} rowSpan="2">
                  Сроки исполнения
                </th>
                <th style={{ overflow: 'hidden', textOverflow: 'ellipsis' }} rowSpan="2">
                  Комментарий
                </th>
                <th style={{ overflow: 'hidden', textOverflow: 'ellipsis' }} rowSpan="2">
                  Файлы
                </th>
                <th style={{ overflow: 'hidden', textOverflow: 'ellipsis' }} rowSpan="2">
                  Действия
                </th>
              </tr>
              <tr>
                <th>с НДС</th>
                <th>без НДС</th>
              </tr>
            </thead>
            <tbody>
              {appData.length > 0 ? (
                appData.map(row => (
                  <tr key={row.id}>
                    {editingRowId === row.id ? (
                      <>
                        <td>{row.title.name}</td>
                        <td>
                          <Form.Label htmlFor="priceWithVAT">
                            <Form.Control
                              id="priceWithVAT"
                              type="number"
                              value={editedRow.priceWithVAT}
                              onChange={e => setEditedRow({ ...editedRow, priceWithVAT: e.target.value })}
                            />
                          </Form.Label>
                        </td>
                        <td>
                          <Form.Label htmlFor="priceWithoutVAT">
                            <Form.Control
                              id="priceWithoutVAT"
                              type="number"
                              value={editedRow.priceWithoutVAT}
                              onChange={e => setEditedRow({ ...editedRow, priceWithoutVAT: e.target.value })}
                            />
                          </Form.Label>
                        </td>
                        <td>
                          <Form.Label htmlFor="dateInput">
                            <Form.Control
                              id="dateInput"
                              type="date"
                              value={editedRow.date}
                              onChange={e => setEditedRow({ ...editedRow, date: e.target.value })}
                            />
                          </Form.Label>
                        </td>
                        <td>
                          <Form.Label htmlFor="comment">
                            <Form.Control
                              id="comment"
                              type="text"
                              value={editedRow.comment}
                              onChange={e => setEditedRow({ ...editedRow, comment: e.target.value })}
                            />
                          </Form.Label>
                        </td>
                        <td>
                          {row.files.map(el => (
                            <span title={el.name} key={el.lastModified + el.size}>
                              {el.name}
                            </span>
                          ))}
                        </td>
                        <td>
                          <div className="d-flex justify-content-around">
                            <Button title="Сохранить изменения" variant="outline-success" className="p-1 border-0" onClick={() => saveRow(row.id)}>
                              <FaRegSave size={25} />
                            </Button>
                            <Button title="Отменить действия" variant="outline-danger" className="p-1 border-0" onClick={cancelEdit}>
                              <MdOutlineCancel size={25} />
                            </Button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.title.name}</td>
                        <td>{formatPrice(row.priceWithVAT)}</td>
                        <td>{formatPrice(row.priceWithoutVAT)}</td>
                        <td>{new Date(row.date).toLocaleDateString()}</td>
                        <td style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.comment}</td>
                        <td>
                          {row.files.map(el => (
                            <div
                              title={el.name}
                              key={el.lastModified + el.size}
                              className="mb-1"
                              style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                            >
                              {el.name}
                            </div>
                          ))}
                        </td>
                        <td>
                          <div className="d-flex justify-content-around">
                            <Button title="Внести правки" variant="outline-success" className="p-1 border-0" onClick={() => editRow(row.id)}>
                              <FaEdit size={25} />
                            </Button>

                            <Button title="Удалить строку" variant="outline-danger" className="p-1 border-0" onClick={() => removeRow(row.id)}>
                              <MdDeleteForever size={25} />
                            </Button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">Нет данных</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col className="mb-3 d-flex column-gap-3 flex-wrap">
          <Button
            size="sm"
            className="rounded"
            variant="outline-success"
            onClick={() => btnToggle('addPosition')}
            aria-expanded={btnState.addPosition}
          >
            Добавить позицию
          </Button>
          <Button size="sm" className="rounded" variant="outline-success" onClick={() => btnToggle('addApproving')}>
            Добавить согласующего
          </Button>
          <Button size="sm" className="rounded" variant="outline-success" onClick={() => btnToggle('showMembers')}>
            Список согласующих
          </Button>

          <div>
            <Form.Select value={company} onChange={setCompanyData}>
              <option value="">Выберите предприятие</option>
              {agloList.map(el => (
                <option key={el.id} value={el.id}>
                  {el.name}
                </option>
              ))}
            </Form.Select>
          </div>
          <Button
            size="sm"
            className="rounded"
            variant="outline-success"
            disabled={members.length === 0 || appData.length === 0 || company === ''}
            onClick={CreateTask}
          >
            Отправить
          </Button>
        </Col>
      </Row>
      {btnState.addPosition && (
        <Row>
          <Col>
            <InputElem close={() => btnToggle('addPosition')} addRow={updateTable} />
          </Col>
        </Row>
      )}

      {btnState.addApproving && (
        <Modal show={btnState.addApproving} onHide={() => btnToggle('addApproving')}>
          <Modal.Header closeButton>
            <Modal.Title>Добавить согласующего</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <SelectComponent data={users} selected={chosen} selectHandler={addChosen} deleteHandler={removeUser} />
          </Modal.Body>

          <Modal.Footer>
            <Button
              disabled={chosen.length === 0}
              variant="primary"
              onClick={() => {
                addUsers();
                btnToggle('addApproving');
              }}
            >
              Добавить
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <Modal show={btnState.showMembers} onHide={() => btnToggle('showMembers')}>
        <Modal.Header closeButton>
          <Modal.Title>Список согласующих</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {members.length > 0 ? (
            <ListGroup>
              {members.map(member => (
                <ListGroup.Item key={member.value} className="d-flex justify-content-between align-items-center">
                  {member.label} <CloseButton onClick={() => removeMember(member)} />
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <span>Нет пользователей для согласования</span>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              btnToggle('showMembers');
            }}
          >
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
