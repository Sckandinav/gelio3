import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Container, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { useAxiosInterceptor } from '../Components/hoc/useAxiosInterceptor';
import { warehousingApi } from '../routes/routes.js';
import { getData } from '../api/getData';
import { Spinner } from '../Components/Spinner/Spinner.jsx';
import { url } from '../routes/routes.js';
// import { CreationPesticide } from '../Components/Pesticide/CreationPesticide.jsx';

import { PesticideTable } from '../Components/Pesticide/PesticideTable.jsx';

export const Chemistry = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pesticideNames');
  const [popupState, setPopupState] = useState({
    pesticide: false,
    title: false,
    group: false,
    substances: false,
  });

  const navigate = useNavigate();

  const modalToggle = (key = null) => {
    setPopupState(prevState => {
      if (key === null) {
        return Object.fromEntries(Object.keys(prevState).map(k => [k, false]));
      }
      return {
        ...prevState,
        [key]: !prevState[key],
      };
    });
  };

  const axiosInstance = useAxiosInterceptor();

  const apiMethods = {
    pesticideNames: warehousingApi.pesticides,
    title: warehousingApi.pesticideNames,
    group: warehousingApi.pesticideGroup,
    substances: warehousingApi.substance,
  };

  const handleTabSelect = tabKey => {
    setActiveTab(tabKey);
  };

  const pesticideNamesColumns = [
    {
      name: '',
      selector: row => row.id,
      omit: true,
    },
    {
      name: 'Название препарата',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Группа пестицидов',
      selector: row => row.group,
      sortable: true,
    },
    {
      name: 'Действующее вещество',
      selector: row => row.substance,
    },
    {
      name: 'Культура списания',
      selector: row => row.crop,
      sortable: true,
      width: '100px',
    },
    {
      name: 'Норма применения',
      selector: row => row.norm,
      width: '100px',
    },
    {
      name: 'Единицы применения',
      selector: row => row.units,
      width: '100px',
    },
    {
      name: 'Кратность применения',
      selector: row => row.frequency,
      width: '100px',
    },
    {
      name: 'Срок до уборки урожая, дней',
      selector: row => row.term,
      width: '100px',
    },
    {
      name: 'Условия применения',
      selector: row => row.conditions,
    },
    {
      name: 'ПРИМЕРНЫЕ сроки списания',
      selector: row => row.approximate,
      width: '100px',
    },
  ];

  const tableData = data.map(row => ({
    id: row.id,
    name: row.pestecide_name?.name,
    group: row.pestecide_group?.name || null,
    substance: row.substance?.name || null,
    crop: row.cropid?.name || null,
    norm: row?.norm || null,
    units: row.units_display || null,
    frequency: row.frequency || null,
    term: row.term || null,
    conditions: row.conditions || null,
    approximate: row.approximate_terms || null,
  }));

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const apiMethod = apiMethods[activeTab];
      const response = await getData(apiMethod(), axiosInstance);
      setData(response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Container fluid>
      <Row>
        <Col>
          <Tabs defaultActiveKey={activeTab} transition={true} id="noanim-tab-example" justify className="mb-3" onSelect={handleTabSelect}>
            <Tab eventKey="pesticideNames" title="Применение препаратов">
              <PesticideTable data={tableData} columns={pesticideNamesColumns} addBtnClick={() => navigate(url.chemistryAdd())} />
            </Tab>
            <Tab eventKey="title" title="Названия пестицидов">
              Названия пестицидов
            </Tab>
            <Tab eventKey="group" title="Группы пестицидов">
              Группы пестицидов
            </Tab>
            <Tab eventKey="substances" title="Действующие вещества">
              Действующие вещества
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};
