import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Tab, Container, Row, Col, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { url, seeds } from '../routes/routes.js';
import { getData } from '../api/getData.js';
import { useAxiosInterceptor } from '../Components/hoc/useAxiosInterceptor.jsx';
import { SeedsTable } from '../Components/Seeds/SeedsTable.jsx';
import { useUserToken } from '../Components/hoc/useUserToken.js';
import { showSuccess, showError } from '../store/slices/toast.js';

export const SeedsPages = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeTab, setActiveTab] = useState('seeds');
  const [loading, setLoading] = useState(false);
  const axiosInstance = useAxiosInterceptor();
  const navigate = useNavigate();
  const token = useUserToken();
  const dispatch = useDispatch();

  const handleSelectedRowsChange = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };

  const apiMethods = {
    seeds: seeds.seeds,
    certificates: seeds.certificates,
  };

  const handleTabSelect = tabKey => {
    setActiveTab(tabKey);
  };

  const getSeeds = async () => {
    setLoading(true);
    try {
      const apiMethod = apiMethods[activeTab];
      const response = await getData(apiMethod(), axiosInstance);
      setData(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Функция для преобразования даты в миллисекунды
  const getMilliseconds = dateString => {
    return new Date(dateString).getTime();
  };

  // Функция для форматирования даты в dd.mm.yy
  const formatDate = dateString => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}.${month}.${year}`;
  };

  console.log('data', data);
  const getSuitability = row => (Number(row.germination) * Number(row.purity)) / 100;

  const seedsColumns = [
    {
      name: '',
      selector: row => row.id,
      omit: true,
    },
    {
      name: 'Номер партии',
      selector: row => row.batch_number,
      sortable: true,
      cell: row => <Link to={`${url.seeds()}/${row.id}`}>{row.batch_number}</Link>,
    },

    {
      name: 'Сорт',
      selector: row => row.sort,
      sortable: true,
    },
    {
      name: 'Поколение',
      selector: row => row.generation,
      sortable: true,
    },
    {
      name: 'Организация',
      selector: row => row.organization,
      sortable: true,
    },
    {
      name: 'Количество, т.',
      selector: row => row.quantity,
      sortable: true,
    },
  ];

  const seedsData = data.map(row => ({
    id: row.id,
    organization: row?.agroid?.name,
    sort: row.sortid?.shortname,
    generation: row?.generationid?.name,
    batch_number: row?.batch_number,
    quantity: row?.quantity,
  }));

  const certificatesColumns = [
    {
      name: '',
      selector: row => row.id,
      omit: true,
    },
    {
      name: 'Сертификат',
      selector: row => row.certificate,
      sortable: true,
    },
    {
      name: 'Срок действия',
      selector: row => row.validity,
      format: row => formatDate(row.validity),
      sortFunction: (a, b) => getMilliseconds(a.validity) - getMilliseconds(b.validity),
      sortable: true,
    },
    {
      name: 'Номер партии',
      selector: row => row.seed,
      sortable: true,
    },
    {
      name: 'Масса 1000 семян, г',
      selector: row => row.weight_1000,
      sortable: true,
    },
    {
      name: 'Всхожесть, %',
      selector: row => row.germination,
      sortable: true,
    },
    {
      name: 'Чистота, %',
      selector: row => row.purity,
      sortable: true,
    },
    {
      name: 'Посевная годность, %',
      selector: row => row.suitability,
      sortable: true,
    },
  ];

  const certificatesData = data.map(row => ({
    id: row.id,
    certificate: row.certificate,
    validity: row.validity,
    seed: row.seed,
    weight_1000: row.weight_1000,
    germination: row.germination,
    purity: row.purity,
    suitability: getSuitability(row),
  }));

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
      getSeeds();
    } catch (error) {
      if (error.status === 409) {
        dispatch(showError('Удалить нельзя, т.к. есть связанные списки'));
      } else {
        dispatch(showError('Не удалось удалить запись'));
        console.log('error', error);
      }
    }
  };

  useEffect(() => {
    getSeeds();
  }, [activeTab]);

  // if (loading) {
  //   return (
  //     <Container fluid className="bg-light rounded-3" style={{ height: '300px', paddingTop: '50px' }}>
  //       <Row className="justify-content-center align-items-center">
  //         <Col>
  //           <Spinner />
  //         </Col>
  //       </Row>
  //     </Container>
  //   );
  // }

  return (
    <Container fluid className="bg-light rounded-3">
      <Row>
        <Col>
          <Tabs defaultActiveKey={activeTab} transition={true} id="noanim-tab-example" justify className="mb-3" onSelect={handleTabSelect}>
            <Tab eventKey="seeds" title="Партии семян">
              {loading ? (
                <div className="text-center py-3">
                  <Spinner />
                </div>
              ) : (
                <SeedsTable
                  data={seedsData}
                  columns={seedsColumns}
                  addBtnClick={() => navigate(url.seedsAdd())}
                  deleteBtnClick={() => deleteRow(seeds.deleteSeeds())}
                  handleSelectedRowsChange={handleSelectedRowsChange}
                  selectedRows={selectedRows}
                  isAddBtn={true}
                />
              )}
            </Tab>
            <Tab eventKey="certificates" title="Сертификаты">
              {loading ? (
                <div className="text-center py-3">
                  <Spinner />
                </div>
              ) : (
                <SeedsTable
                  data={certificatesData}
                  columns={certificatesColumns}
                  deleteBtnClick={() => deleteRow(seeds.deleteCertificates())}
                  handleSelectedRowsChange={handleSelectedRowsChange}
                  selectedRows={selectedRows}
                />
              )}
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};
