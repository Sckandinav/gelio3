import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Container, Row, Col, Modal, Button, Form } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { useAxiosInterceptor } from '../Components/hoc/useAxiosInterceptor';
import { getData } from '../api/getData';
import { Spinner } from '../Components/Spinner/Spinner.jsx';
import { url, warehousingApi } from '../routes/routes.js';
import { useUserToken } from '../Components/hoc/useUserToken.js';
import { showSuccess, showError } from '../store/slices/toast.js';

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

  const [newElement, setNewElement] = useState('');

  const popupToggle = (key = null) => {
    setPopupState(prev => ({ ...prev, [key]: !prev[key] }));
  };
  const resetPopup = () => {
    setNewElement('');
    setPopupState({
      pesticide: false,
      title: false,
      group: false,
      substances: false,
    });
  };

  const navigate = useNavigate();
  const token = useUserToken();
  const dispatch = useDispatch();

  const [selectedRows, setSelectedRows] = useState([]);
  const handleSelectedRowsChange = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
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
      cell: row => <Link to={`${url.chemistryPesticideItem()}/${row.id}`}>{row.name}</Link>,
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

  const columns = [
    {
      name: '',
      selector: row => row.id,
      omit: true,
    },
    {
      name: 'Наименование',
      selector: row => row.name,
      sortable: true,
    },
  ];

  const dataTable = data.map(row => ({
    id: row.id,
    name: row.name,
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

  const addRow = async e => {
    e.preventDefault();
    try {
      const apiMethod = apiMethods[activeTab];
      await axiosInstance.post(
        apiMethod(),
        { name: newElement },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        },
      );
      dispatch(showSuccess('Элемент добавлен'));
      fetchData();
      resetPopup();
    } catch (error) {
      dispatch(showError('Не удалось добавить элемент'));
      console.log(error);
    }
  };

  const deleteRow = async url => {
    try {
      const selected = selectedRows.map(row => row.id);

      await axiosInstance.delete(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        data: { ids: selected },
      });

      dispatch(showSuccess('Запись удалена'));
      setSelectedRows([]);
      fetchData();
    } catch (error) {
      dispatch(showError('Не удалось выполнить действие'));
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Container fluid className="bg-light rounded-3">
      <Row>
        <Col>
          <Tabs defaultActiveKey={activeTab} transition={true} id="noanim-tab-example" justify className="mb-3" onSelect={handleTabSelect}>
            <Tab eventKey="pesticideNames" title="Применение препаратов">
              <PesticideTable
                data={tableData}
                columns={pesticideNamesColumns}
                addBtnClick={() => navigate(url.chemistryAdd())}
                deleteBtnClick={() => deleteRow(warehousingApi.deletePesticides())}
                handleSelectedRowsChange={handleSelectedRowsChange}
                selectedRows={selectedRows}
              />
            </Tab>
            <Tab eventKey="title" title="Названия пестицидов">
              <PesticideTable
                data={dataTable}
                columns={columns}
                addBtnClick={() => popupToggle('title')}
                deleteBtnClick={() => deleteRow(warehousingApi.pesticideNamesDelete())}
                handleSelectedRowsChange={handleSelectedRowsChange}
                selectedRows={selectedRows}
              />
            </Tab>
            <Tab eventKey="group" title="Группы пестицидов">
              <PesticideTable
                data={dataTable}
                columns={columns}
                addBtnClick={() => popupToggle('group')}
                deleteBtnClick={() => deleteRow(warehousingApi.pesticideGroupDelete())}
                handleSelectedRowsChange={handleSelectedRowsChange}
                selectedRows={selectedRows}
              />
            </Tab>
            <Tab eventKey="substances" title="Действующие вещества">
              <PesticideTable
                data={dataTable}
                columns={columns}
                addBtnClick={() => popupToggle('substances')}
                deleteBtnClick={() => deleteRow(warehousingApi.substanceDelete())}
                handleSelectedRowsChange={handleSelectedRowsChange}
                selectedRows={selectedRows}
              />
            </Tab>
          </Tabs>
        </Col>
      </Row>

      <Modal show={Object.values(popupState).some(value => value === true)} onHide={resetPopup}>
        <Modal.Header closeButton>
          <Modal.Title>Добавить элемент</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label></Form.Label>
            <Form.Control type="text" value={newElement} onChange={e => setNewElement(e.target.value)} required></Form.Control>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={resetPopup}>
            Отменить
          </Button>
          <Button variant="outline-success" disabled={newElement.length === 0} onClick={addRow}>
            Добавить
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
