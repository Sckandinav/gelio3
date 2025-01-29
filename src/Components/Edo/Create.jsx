import React, { useState, useEffect } from 'react';
import { Form, Button, Card, CloseButton, Col, Row, Dropdown } from 'react-bootstrap';
import { motion, AnimatePresence } from 'motion/react';

import { Modal } from '../Modal/Modal.jsx';
import { SelectComponent } from '../Select/Select';
import { fetchUsers } from '../../api/fetchUsers';
import { links } from '../../routes/routes.js';
import { CheckboxSelection } from '../Select/CheckboxSelection.jsx';

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

  console.log(state.documents[0]);

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

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetchUsers(links.getUsers());

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
            <Form style={{ opacity: actionsModal ? 0 : 1 }}>
              {pageNumber === 1 ? (
                <>
                  <Form.Group className="mb-4">
                    <Form.Label>Название</Form.Label>
                    <Form.Control type="text" required value={state.title} onChange={e => textHandler('title', e)} />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Описание</Form.Label>
                    <Form.Control type="text" value={state.description} onChange={e => textHandler('description', e)} />
                  </Form.Group>

                  <SelectComponent data={users} selected={state.members} selectHandler={addData} deleteHandler={removeData} />

                  <Button className="mt-5" onClick={pageToggle}>
                    Далее
                  </Button>
                </>
              ) : (
                <div>
                  {state.documents.length > 0 &&
                    state.documents.map(doc => (
                      <Card key={doc.id}>
                        <CloseButton style={{ position: 'absolute', top: '0.2rem', right: '0.5rem' }} onClick={() => removeData('documents', doc)} />
                        <Card.Body>
                          <Row>
                            <Col>
                              <Form.Group>
                                <Form.Label>
                                  <Form.Control type="file"></Form.Control>
                                </Form.Label>
                              </Form.Group>
                            </Col>
                            <Col>
                              {(doc.members?.length > 0 || doc?.signers.length > 0 || doc?.viewers.length) > 0 && (
                                <Dropdown>
                                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    Действия
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    {doc.members && doc.members.length > 0 && (
                                      <Dropdown.Item onClick={() => documentActions(doc.id, actionsList.AddSigner, 'signers')}>
                                        Добавить подписанта
                                      </Dropdown.Item>
                                    )}
                                    {doc.members && doc.members.length > 0 && (
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
                        </Card.Body>
                      </Card>
                    ))}

                  <Button variant="success" onClick={() => addData('documents')}>
                    Добавить документ
                  </Button>

                  <Button className="mt-5" onClick={pageToggle}>
                    Назад
                  </Button>
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
