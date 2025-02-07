import React, { useState, useEffect } from 'react';
import { Form, Button, Card, CloseButton, Col, Row, Dropdown } from 'react-bootstrap';
import { motion, AnimatePresence } from 'motion/react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Modal } from '../Modal/Modal.jsx';
import { SelectComponent } from '../Select/Select';
import { fetchUsers } from '../../api/fetchUsers';
import { links, url } from '../../routes/routes.js';
import { CheckboxSelection } from '../Select/CheckboxSelection.jsx';
import { showSuccess, showError } from '../../store/slices/toast.js';
import { useAxiosInterceptor } from '../hoc/useAxiosInterceptor';
import { isSignableDocument } from '../../utils/signableFormats.js';

import styles from './Create.module.scss';

const actionsList = {
  AddSigner: 'Добавить подписанта',
  AddViewer: 'Добавить просмотрщика',
  RemoveSigner: 'Убрать подписанта',
  RemoveViewer: 'Убрать просмотрщика',
};

export const Create = () => {
  const [users, setUsers] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [actionsModal, setActionsModal] = useState(false);
  const [chosen, setChosen] = useState([]);
  const [actionType, setActionType] = useState({
    id: null,
    action: null,
    roll: null,
  });
  const [state, setState] = useState({
    title: '',
    description: '',
    members: [],
    documents: [],
  });
  const axiosInstance = useAxiosInterceptor();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const docInstance = () => {
    return { id: Date.now(), file: null, members: state.members, signers: [], viewers: [] };
  };

  const textHandler = (key, e) => {
    setState(prev => ({ ...prev, [key]: e.target.value }));
  };

  const addData = (key, data = docInstance()) => {
    key === 'members'
      ? setState(prev => ({ ...prev, [key]: [...prev[key], { ...data }] }))
      : setState(prev => ({ ...prev, [key]: [...prev[key], data] }));
  };

  const removeData = (key, data) => {
    key === 'members'
      ? setState(prev => ({ ...prev, [key]: prev[key].filter(item => item.value !== data.value) }))
      : setState(prev => ({ ...prev, [key]: prev[key].filter(item => item.id !== data.id) }));
  };

  const pageToggle = () => {
    pageNumber === 1 ? setPageNumber(2) : setPageNumber(1);
  };

  const actionsModalToggle = () => {
    setActionsModal(prev => !prev);
  };

  const documentActions = (id = null, action = null, roll = null) => {
    actionsModalToggle();
    setActionType(prev => ({ ...prev, id, action, roll }));
  };

  const handleChosen = el => {
    chosen.some(user => user.value === el.value) ? setChosen(prev => prev.filter(user => user.value !== el.value)) : setChosen(prev => [...prev, el]);
  };

  const addRoll = (docID, roll) => {
    const idToRemove = chosen.map(user => user.value);
    setState(prev => ({
      ...prev,
      documents: prev.documents.map(doc => {
        if (doc.id === docID) {
          return {
            ...doc,
            [roll]: [...doc[roll], ...chosen],
            members: doc.members.filter(user => !idToRemove.includes(user.value)),
          };
        }
        return doc;
      }),
    }));
    setChosen([]);
  };

  const removeRoll = (docID, roll) => {
    const idToRemove = chosen.map(user => user.value);
    setState(prev => ({
      ...prev,
      documents: prev.documents.map(doc => {
        if (doc.id === docID) {
          return { ...doc, members: [...doc.members, ...chosen], [roll]: doc[roll].filter(user => !idToRemove.includes(user.value)) };
        }

        return doc;
      }),
    }));
    setChosen([]);
  };

  const addFile = (e, id) => {
    setState(prev => ({
      ...prev,
      documents: prev.documents.map(doc => {
        if (doc.id === id) {
          return { ...doc, file: e.target.files[0] };
        }
        return doc;
      }),
    }));
  };

  const sendToServer = async () => {
    const formData = new FormData();
    formData.append('title', state.title);
    formData.append('description', state.description);
    const membersForUpdate = state.members.map(user => ({ id: user.value, fullName: user.label, companyName: user.companyName, post: user.post }));
    formData.append('members', JSON.stringify(membersForUpdate));
    const documentsData = state.documents
      .filter(doc => doc.file)
      .map(doc => ({
        id: doc.id,
        name: doc.file?.name || null,
        signer: doc.signers.map(signer => ({
          id: signer.value,
          fullName: signer.label,
          companyName: signer.companyName,
          post: signer.post,
        })),
        viewers: doc.viewers.map(viewer => ({
          id: viewer.value,
          fullName: viewer.label,
          companyName: viewer.companyName,
          post: viewer.post,
        })),
      }));

    formData.append('documents', JSON.stringify(documentsData));

    state.documents.forEach(doc => {
      if (doc.file) {
        formData.append(`file[${doc.id}]`, doc.file);
      }
    });

    try {
      const token = localStorage.getItem('token');

      await axiosInstance.post(links.createRoom(), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${token}`,
        },
      });

      dispatch(showSuccess('Комната создана'));
      navigate(url.edoCreated());
      window.location.reload();
    } catch (error) {
      dispatch(showError('Не удалось создать комнату'));
      console.log(error);
    }
  };

  useEffect(() => {
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

    getUsers();
  }, []);
  return (
    <>
      <AnimatePresence>
        {!actionsModal && (
          <motion.span initial={{ opacity: 0, visibility: 'hidden' }} animate={{ opacity: 1, visibility: 'visible' }}>
            <Form>
              {pageNumber === 1 ? (
                <>
                  <Form.Group className="mb-4">
                    <Form.Label>Название</Form.Label>
                    <Form.Control type="text" required value={state.title} onChange={e => textHandler('title', e)} />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Описание</Form.Label>
                    <Form.Control
                      type="text"
                      as="textarea"
                      value={state.description}
                      onChange={e => textHandler('description', e)}
                      style={{ resize: 'none' }}
                    />
                  </Form.Group>

                  <SelectComponent data={users} selected={state.members} selectHandler={addData} deleteHandler={removeData} />

                  <Button className="mt-5" onClick={pageToggle} disabled={state.title.length === 0}>
                    Далее
                  </Button>
                </>
              ) : (
                <div>
                  <Row className="mb-4 p-3" style={{ maxHeight: '438px', overflow: 'auto' }}>
                    <Col>
                      {state.documents.length > 0 &&
                        state.documents.map(doc => (
                          <Card key={doc.id} className="mb-3 ">
                            <CloseButton
                              style={{ position: 'absolute', top: '0.2rem', right: '0.5rem' }}
                              onClick={() => removeData('documents', doc)}
                            />
                            <Card.Body>
                              <Row>
                                <Col className={`${styles.fileUpload}`}>
                                  <label className={styles.label}>
                                    <input type="file" className={styles.customFileInput} onChange={e => addFile(e, doc.id)} />
                                    <span className={styles.customFileButton}>Выберите файл</span>
                                  </label>
                                  <span className={styles.fileName} title={doc.file ? doc.file.name : ''}>
                                    {doc.file ? doc.file.name : 'Файл не выбран'}
                                  </span>
                                </Col>
                                <Col>
                                  {doc.file && (doc.members?.length > 0 || doc?.signers.length > 0 || doc?.viewers.length) && (
                                    <Dropdown>
                                      <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                        Действия
                                      </Dropdown.Toggle>
                                      <Dropdown.Menu>
                                        {isSignableDocument(doc.file.name) && doc.members.length > 0 && doc.file !== null && (
                                          <Dropdown.Item onClick={() => documentActions(doc.id, actionsList.AddSigner, 'signers')}>
                                            Добавить подписанта
                                          </Dropdown.Item>
                                        )}
                                        {doc.members.length > 0 && doc.file !== null && (
                                          <Dropdown.Item onClick={() => documentActions(doc.id, actionsList.AddViewer, 'viewers')}>
                                            Добавить просмотрщика
                                          </Dropdown.Item>
                                        )}
                                        {doc.signers && doc.signers.length > 0 && (
                                          <Dropdown.Item onClick={() => documentActions(doc.id, actionsList.RemoveSigner, 'signers')}>
                                            Убрать подписанта
                                          </Dropdown.Item>
                                        )}
                                        {doc.signers && doc.viewers.length > 0 && (
                                          <Dropdown.Item onClick={() => documentActions(doc.id, actionsList.RemoveViewer, 'viewers')}>
                                            Убрать просмотрщика
                                          </Dropdown.Item>
                                        )}
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  )}
                                </Col>
                              </Row>
                              <Row>
                                <Col className="d-flex flex-column mt-2">
                                  <span style={{ fontSize: '14px' }}>Добавлено подписантов: {doc.signers.length}</span>
                                  <span style={{ fontSize: '14px' }}>Добавлено просмотрщиков: {doc.viewers.length}</span>
                                </Col>
                              </Row>
                            </Card.Body>
                          </Card>
                        ))}
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Button variant="success" onClick={() => addData('documents')}>
                        Добавить документ
                      </Button>
                    </Col>
                  </Row>

                  <Row className="mt-5 ">
                    <Col className="d-flex justify-content-between px-5">
                      <Button onClick={pageToggle} variant="secondary">
                        Назад
                      </Button>

                      <Button variant="success" onClick={sendToServer}>
                        Создать
                      </Button>
                    </Col>
                  </Row>
                </div>
              )}
            </Form>
          </motion.span>
        )}
      </AnimatePresence>
      <Modal show={actionsModal && actionType.action[0] === 'Д'} close={documentActions} title={actionType.action}>
        <CheckboxSelection
          data={state?.documents.filter(doc => doc.id === actionType.id)[0]?.members}
          actionType={actionType}
          func={handleChosen}
          chosen={chosen}
          actionFunc={addRoll}
          onClose={documentActions}
        />
      </Modal>

      <Modal show={actionsModal && actionType.action[0] === 'У'} close={documentActions} title={actionType.action}>
        <CheckboxSelection
          data={
            actionType.roll === 'signers'
              ? state?.documents.filter(doc => doc.id === actionType.id)[0]?.signers
              : state?.documents.filter(doc => doc.id === actionType.id)[0]?.viewers
          }
          actionType={actionType}
          func={handleChosen}
          chosen={chosen}
          actionFunc={removeRoll}
          onClose={documentActions}
        />
      </Modal>
    </>
  );
};
