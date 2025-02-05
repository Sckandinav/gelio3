import React, { useState } from 'react';
import { Button, Container, Row, Col, Dropdown, DropdownButton, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Create } from '../Edo/Create';
import { Modal } from '../Modal/Modal';
import { setDepartment } from '../../store/slices/utils';
import { WebSocketMenuListener } from '../hoc/WebSocket/WebSocketMenuListener';
import { notificationsSelector } from '../../store/selectors/notificationsSelector';
import styles from './Dashboard.module.scss';

export const Dashboard = ({ isDropdown = false }) => {
  const [isCreating, setIsCreating] = useState(false);

  const { loading, data } = useSelector(notificationsSelector)?.sideBar || {};

  const creatingToggle = () => {
    setIsCreating(prev => !prev);
  };

  console.log(data);

  const created = data?.data?.created || {};
  const incoming = data?.data?.incoming || {};
  const dispatch = useDispatch();

  if (!loading) {
    return (
      <>
        <Container>
          <Row>
            <Col className="d-flex justify-content-center column-gap-3">
              <WebSocketMenuListener />
              {isDropdown ? (
                <Dropdown>
                  <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    <span>Входящие</span>
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
                        <DropdownButton
                          className={`mb-1 border-0 ${styles.dropdownButton}`}
                          key={company.id}
                          id={`dropdown-company-${company.id}`}
                          title={
                            <>
                              <span>
                                {company.name}
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
                              </span>
                            </>
                          }
                          variant="primary"
                          drop="end"
                        >
                          {company.departaments.map(dept => (
                            <Dropdown.Item key={dept.id} as="div" className={`btn btn-link d-flex align-items-center p-0 px-3 ${styles.custom}`}>
                              <Link
                                className="btn btn-link p-0 me-1"
                                to={`department/${dept.id}`}
                                onClick={() => dispatch(setDepartment(`${company.name}, ${dept.name}`))}
                              >
                                <span>{dept.name} </span>
                              </Link>

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
                        </DropdownButton>
                      ))}
                    </Dropdown.Menu>
                  )}
                </Dropdown>
              ) : (
                <Button variant="primary">Входящие</Button>
              )}

              <Link className="btn btn-primary" to="created">
                <span>Созданные </span>

                {created?.total_rooms > 0 && (
                  <Badge pill bg="light" text="primary" className="mx-1" title={`Созданные комнаты со статусом "Открыта": ${created?.total_rooms}`}>
                    {created?.total_rooms}
                  </Badge>
                )}
              </Link>
              <Button variant="success" onClick={creatingToggle}>
                Создать
              </Button>
            </Col>
          </Row>
        </Container>

        <Modal show={isCreating} close={creatingToggle} title={'Создать комнату'}>
          <Create closeForm={creatingToggle} />
        </Modal>
      </>
    );
  }
};
