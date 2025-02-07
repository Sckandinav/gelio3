import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { Dashboard } from '../Components/Dashboard/Dashboard';
import { fetchApplicationMenu } from '../api/fetchApplicationMenu';
import { useAxiosInterceptor } from '../Components/hoc/useAxiosInterceptor';
import { applicationUrl } from '../routes/routes.js';
import { ApplicationsList } from '../Components/Applications/ApplicationsList/ApplicationsList.jsx';
import { Create } from '../Components/Applications/Create/Create.jsx';

export const Applications = () => {
  const [data, setData] = useState([]);
  const [type, setType] = useState('incoming');
  const axiosInstance = useAxiosInterceptor();

  const typeToggle = e => {
    if (type !== e.target.id) {
      setType(e.target.id);
    }
  };

  const currentUrl = type === 'incoming' ? applicationUrl.sideBar() : applicationUrl.sideBarCreated();

  useEffect(() => {
    const getMeuData = async () => {
      try {
        const response = await fetchApplicationMenu(currentUrl, axiosInstance);
        setData(response);
      } catch (error) {
        console.log(error);
      }
    };
    getMeuData();
  }, [currentUrl]);

  return (
    <Container fluid className={`bg-light-subtle rounded pt-3 `}>
      <Row className="mb-5">
        <Col>
          <Dashboard handlerFunc={typeToggle} create={<Create />} modalTitle="Создать заявку" fullScreen={true} />
        </Col>
      </Row>
      <Row>
        <Col className="px-4">
          <ApplicationsList data={data} title={type === 'incoming' ? 'Заявки, входящие' : 'Заявки, созданные'} />
        </Col>
      </Row>
    </Container>
  );
};
