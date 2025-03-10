import React, { useState } from 'react';
import { Button, Container, Row, Col, Dropdown, Badge, ButtonGroup } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Modal } from '../Modal/Modal';
import { setDepartment } from '../../store/slices/utils';

import styles from './Dashboard.module.scss';

export const Dashboard = ({
  isDropdown = false,
  data,
  create,
  modalTitle = 'Создать комнату',
  fullScreen = false,
  setParamsFunc,
  removeParam,
  updateList,
  linkUrl,
  searchProps,
  setTitle,
}) => {
  const [isCreating, setIsCreating] = useState(false);

  const creatingToggle = () => {
    setIsCreating(prev => !prev);
  };

  const created = data?.data?.created || {};
  const incoming = data?.data?.incoming || {};

  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const createWithProps = React.cloneElement(create, {
    close: creatingToggle,
    update: updateList,
  });

  return (
    <>
      <Container>
        <Row>
          <Col className="d-flex justify-content-start column-gap-3">
            {isDropdown ? (
              <Dropdown as={ButtonGroup}>
                <Button
                  variant="primary"
                  onClick={() => {
                    removeParam('agro_id');
                    removeParam('departament_id');
                    setParamsFunc('mode', 'incoming');
                    setTitle('входящие');
                  }}
                >
                  Входящие
                </Button>
                <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
                  {incoming?.total_open_rooms > 0 && (
                    <Badge
                      pill
                      bg="light"
                      text="primary"
                      className="mx-1"
                      title={`${incoming.total_open_rooms > 0 && `Открытых комнат c Вашим участием: ${incoming.total_open_rooms}`}\n${
                        incoming.total_actions > 0 ? `Кол-во документов, ожидающих Вашего взаимодействия: ${incoming.total_actions}` : ''
                      }`}
                    >
                      {incoming.total_open_rooms}
                      {incoming.total_actions > 0 && `/${incoming.total_actions}`}
                    </Badge>
                  )}
                </Dropdown.Toggle>

                {incoming?.companies?.length > 0 && (
                  <Dropdown.Menu className="border-0">
                    {incoming.companies.map(company => (
                      <Dropdown
                        as={ButtonGroup}
                        key={company.id}
                        id={`dropdown-company-${company.id}`}
                        variant="primary"
                        drop="end"
                        className={`mb-1 border-0 ${styles.dropdownButton}`}
                      >
                        <Button
                          variant="primary"
                          className={styles.titleButton}
                          onClick={() => {
                            removeParam('mode');
                            removeParam('departament_id');
                            setParamsFunc('agro_id', company.id);
                            setTitle(`входящие, ${company.name}`);
                          }}
                        >
                          {company.name}
                        </Button>
                        <Dropdown.Toggle variant="outline-primary" className={styles.count}>
                          {company.open_rooms > 0 && (
                            <Badge
                              pill
                              bg="light"
                              text="primary"
                              className="mx-1"
                              title={`${company.open_rooms > 0 && `Открытых комнат c Вашим участием: ${company.open_rooms}`}\n${
                                company.total_actions > 0 ? `Кол-во документов, ожидающих Вашего взаимодействия: ${company.total_actions}` : ''
                              }`}
                            >
                              {company.open_rooms}
                              {company.total_actions > 0 ? `/${company.total_actions}` : ''}
                            </Badge>
                          )}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="border-0">
                          {company.departaments.map(dept => (
                            <Dropdown.Item key={dept.id} as="div" className={`border rounded d-flex align-items-center p-1 px-3 ${styles.custom}`}>
                              <Button
                                variant="link"
                                className="p-0 me-1"
                                onClick={() => {
                                  dispatch(setDepartment(`${company.name}, ${dept.name}`));
                                  removeParam('mode');
                                  setParamsFunc('agro_id', company.id);
                                  setParamsFunc('departament_id', dept.id);
                                  setTitle(`входящие, ${company.name}, ${dept.name}`);
                                }}
                              >
                                <span>{dept.name} </span>
                              </Button>
                              {dept.open_rooms > 0 && (
                                <Badge
                                  pill
                                  bg="primary"
                                  text="light"
                                  className="mx-1"
                                  title={`${dept.open_rooms > 0 && `Открытых комнат c Вашим участием: ${dept.open_rooms}`}\n${
                                    dept.total_actions > 0 ? `Кол-во документов, ожидающих Вашего взаимодействия: ${dept.total_actions}` : ''
                                  }`}
                                >
                                  {dept.open_rooms}
                                  {dept.total_actions > 0 ? `/${dept.total_actions}` : ''}
                                </Badge>
                              )}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    ))}
                  </Dropdown.Menu>
                )}
              </Dropdown>
            ) : (
              <Button
                variant="primary"
                onClick={() => {
                  removeParam(searchProps.created.key);
                  setParamsFunc(searchProps.incoming.key, searchProps.incoming.value);
                }}
                id="incoming"
                className="d-flex justify-content-between align-items-center column-gap-1"
              >
                Входящие
                {incoming > 0 && (
                  <Badge pill bg="light" text="primary" style={{ top: 0 }}>
                    {incoming}
                  </Badge>
                )}
              </Button>
            )}

            {pathname?.includes('edo') ? (
              <Button
                className="btn-primary"
                onClick={() => {
                  removeParam('agro_id');
                  removeParam('departament_id');
                  setParamsFunc('mode', 'created');
                  setTitle('исходящие');
                }}
              >
                <span>Исходящие </span>

                {created?.total_rooms > 0 && (
                  <Badge pill bg="light" text="primary" className="mx-1" title={`Исходящие комнаты со статусом "Открыта": ${created?.total_rooms}`}>
                    {created?.total_rooms}
                  </Badge>
                )}
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => {
                  removeParam(searchProps.incoming.key);
                  setParamsFunc(searchProps.created.key, searchProps.created.value);
                }}
                id="created"
              >
                <span>Исходящие</span>
                {created > 0 && (
                  <Badge pill bg="light" text="primary" className="mx-1" title={`Исходящие комнаты со статусом "Открыта": ${created?.total_rooms}`}>
                    {created}
                  </Badge>
                )}
              </Button>
            )}

            {pathname?.includes('applications') || pathname?.includes('payment') ? (
              <Link to={linkUrl()}>
                <Button variant="success">Создать</Button>
              </Link>
            ) : (
              <Button variant="success" onClick={creatingToggle}>
                Создать
              </Button>
            )}
          </Col>
        </Row>
      </Container>

      <Modal show={isCreating} close={creatingToggle} title={modalTitle} fullscreen={fullScreen}>
        {createWithProps}
      </Modal>
    </>
  );
};
