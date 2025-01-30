import React, { useState } from 'react';
import { Button, Container, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { Create } from '../Edo/Create';
import { Modal } from '../Modal/Modal';
import styles from './Dashboard.module.scss';

export const Dashboard = ({ isDropdown = false, onCreatedClick, createNew, data }) => {
  const [isCreating, setIsCreating] = useState(false);

  const creatingToggle = () => {
    setIsCreating(prev => !prev);
  };

  const { created, incoming } = data;

  return (
    <>
      <Container>
        <Row>
          <Col className="d-flex justify-content-center column-gap-3">
            {isDropdown ? (
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  <span>Входящие </span>
                  {incoming?.total_open_rooms > 0 && (
                    <span
                      title={`${incoming.total_open_rooms > 0 && `Открытых комнат c Вашим участием: ${incoming.total_open_rooms}`}\n${
                        incoming.total_actions > 0 && `Кол-во документов, ожидающих Вашего взаимодействия: ${incoming.total_actions}`
                      }`}
                    >
                      {incoming.total_open_rooms}
                      {incoming.total_actions > 0 && `/${incoming.total_actions}`}
                    </span>
                  )}
                </Dropdown.Toggle>

                {incoming?.companies.length > 0 && (
                  <Dropdown.Menu className="border-0">
                    {incoming.companies.map(company => (
                      <DropdownButton
                        className={`mb-1 border-0 ${styles.dropdownButton}`}
                        key={company.id}
                        id={`dropdown-company-${company.id}`}
                        title={
                          <>
                            <span>{company.name}</span>
                          </>
                        }
                        variant="primary"
                        drop="end"
                      >
                        {company.departaments.map(dept => (
                          <Dropdown.Item key={dept.id} as="div" className={`btn btn-link d-flex align-items-center p-0 px-3 ${styles.custom}`}>
                            <Link className="btn btn-link p-0 me-1" to="loren15">
                              <span>{dept.name} </span>
                            </Link>
                            <span
                              title={`${dept.open_rooms > 0 && `Открытых комнат c Вашим участием: ${dept.open_rooms}`}\n${
                                dept.total_actions > 0 ? `Кол-во документов, ожидающих Вашего взаимодействия: ${dept.total_actions}` : ''
                              }`}
                            >
                              {dept.open_rooms > 0 && dept.open_rooms}
                              {dept.total_actions > 0 && `/${dept.total_actions}`}
                            </span>
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

            <Button variant="primary">
              <span>Созданные </span>
              {created?.total_rooms > 0 && (
                <span title={`Созданные комнаты со статусом "Открыта": ${created?.total_rooms}`}>{created?.total_rooms}</span>
              )}
            </Button>
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
};
