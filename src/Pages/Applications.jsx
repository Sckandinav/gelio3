import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { Dashboard } from '../Components/Dashboard/Dashboard';
import { fetchApplicationMenu } from '../api/fetchApplicationMenu';
import { getData } from '../api/getData.js';
import { useAxiosInterceptor } from '../Components/hoc/useAxiosInterceptor';
import { applicationUrl, links } from '../routes/routes.js';
import { ApplicationsList } from '../Components/Applications/ApplicationsList/ApplicationsList.jsx';
import { Create } from '../Components/Applications/Create/Create.jsx';
import { notificationsSelector } from '../store/selectors/notificationsSelector.js';

export const Applications = () => {
  const [data, setData] = useState([]);
  const [company, setCompany] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const axiosInstance = useAxiosInterceptor();

  const notificationsCounter = useSelector(notificationsSelector).applicationMenu || {};
  const type = searchParams.get('application_type');
  const addParam = (key, value) => {
    searchParams.set(key, value);
    setSearchParams(searchParams);
  };

  const removeParam = key => {
    searchParams.delete(key);
    setSearchParams(searchParams);
  };

  const getApplicationsList = async () => {
    try {
      const response = await fetchApplicationMenu(applicationUrl.sideBar(), axiosInstance, searchParams);
      const companyResponse = await getData(links.getAgro(), axiosInstance);
      const option = companyResponse.map(el => ({
        value: el.id,
        label: el.name,
      }));

      setData(response);
      setCompany(option);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getApplicationsList();
  }, [searchParams]);

  return (
    <Container fluid className={`bg-light-subtle rounded pt-3`}>
      <Row className="mb-5">
        <Col>
          <Dashboard
            data={notificationsCounter.data}
            create={<Create />}
            modalTitle="Создать заявку"
            fullScreen={true}
            updateList={getApplicationsList}
            setParamsFunc={addParam}
            removeParam={removeParam}
          />
        </Col>
      </Row>
      <Row>
        <Col className="px-4">
          <ApplicationsList data={data} title={type === 'created' ? 'Заявки, созданные' : 'Заявки, входящие'} company={company} />
        </Col>
      </Row>
    </Container>
  );
};
