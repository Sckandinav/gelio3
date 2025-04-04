import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useSearchParams, useLocation } from 'react-router-dom';

import { Dashboard } from '../Components/Dashboard/Dashboard';
import { fetchApplicationMenu } from '../api/fetchApplicationMenu';
import { getData } from '../api/getData.js';
import { useAxiosInterceptor } from '../Components/hoc/useAxiosInterceptor';
import { applicationUrl, links } from '../routes/routes.js';
import { ApplicationsList } from '../Components/Applications/ApplicationsList/ApplicationsList.jsx';
import { Create } from '../Components/Applications/Create/Create.jsx';
import { notificationsSelector } from '../store/selectors/notificationsSelector.js';
import { url } from '../routes/routes.js';

export const Applications = () => {
  const [data, setData] = useState([]);
  const [company, setCompany] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const axiosInstance = useAxiosInterceptor();
  const { search } = useLocation();

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

  const searchProps = {
    incoming: {
      key: 'application_type',
      value: 'incoming',
    },
    created: {
      key: 'application_type',
      value: 'created',
    },
  };

  const getApplicationsList = async () => {
    try {
      const response = await fetchApplicationMenu(
        `${search ? applicationUrl.sideBar() : `${applicationUrl.sideBar()}?application_type=incoming`}`,
        axiosInstance,
        searchParams,
      );
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
    addParam(searchProps.incoming.key, searchProps.incoming.value);
  }, []);

  useEffect(() => {
    getApplicationsList();
  }, [searchParams]);

  return (
    <Container fluid className={`bg-light-subtle rounded pt-3`}>
      <Row className="mb-3">
        <Col>
          <Dashboard
            data={notificationsCounter.data}
            create={<Create />}
            modalTitle="Создать заявку"
            fullScreen={true}
            updateList={getApplicationsList}
            setParamsFunc={addParam}
            removeParam={removeParam}
            linkUrl={url.applicationsAdd}
            searchProps={searchProps}
          />
        </Col>
      </Row>
      <Row>
        <Col className="px-4">
          <ApplicationsList
            data={data.sort(
              (a, b) =>
                Number(a.approved_by_ceo) - Number(b.approved_by_ceo) ||
                Number(a.fully_approved_by_items) - Number(b.fully_approved_by_items) ||
                Number(a.fully_approved_by_users) - Number(b.fully_approved_by_users) ||
                new Date(b.created_at) - new Date(a.created_at),
            )}
            title={type === 'created' ? 'Заявки на ДС от дочерних компаний, исходящие' : 'Заявки на ДС от дочерних компаний, входящие'}
            company={company}
          />
        </Col>
      </Row>
    </Container>
  );
};
