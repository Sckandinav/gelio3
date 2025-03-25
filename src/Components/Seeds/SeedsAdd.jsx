import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Spinner } from 'react-bootstrap';
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from 'react-icons/io';
import { FaRegEdit } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { links, seeds } from '../../routes/routes.js';
import { useUserToken } from '../hoc/useUserToken.js';
import { useAxiosInterceptor } from '../hoc/useAxiosInterceptor.jsx';
import { getData } from '../../api/getData.js';
import { InputElem } from './InputElem.jsx';
import { showError, showSuccess } from '../../store/slices/toast.js';
import { Spinner as LoadingSpinner } from '../Spinner/Spinner.jsx';

export const SeedsAdd = () => {
  const [data, setData] = useState({
    organization: [],
    sort: [],
    generation: [],
  });
  const [selected, setSelected] = useState({
    agroid: '',
    batch_number: '',
    generationid: '',
    id: Date.now(),
    quantity: '',
    seed_documents: [],
    sortid: null,
  });
  const [sendingData, setSendingData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useUserToken();
  const axiosInstance = useAxiosInterceptor();

  const selectHandler = (key, value) => {
    setSelected(prev => ({ ...prev, [key]: value }));
  };

  const changeHandler = option => {
    setSelected(prev => ({ ...prev, sortid: option }));
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const getAgro = await getData(links.getAgro(), axiosInstance);
      const getSorts = await getData(seeds.sorts(), axiosInstance);
      const getGenerations = await getData(seeds.generations(), axiosInstance);
      setData(prev => ({ ...prev, organization: getAgro, sort: getSorts, generation: getGenerations }));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const addNewCertificate = () => {
    setSelected(prev => ({
      ...prev,
      seed_documents: [
        ...prev.seed_documents,
        {
          id: Date.now(),
          certificate: '',
          validity: '',
          weight_1000: '',
          germination: '',
          purity: '',
          seed_id: selected.id,
        },
      ],
    }));
  };

  const removeNewCertificate = id => {
    setSelected(prev => ({ ...prev, seed_documents: prev.seed_documents.filter(el => el.id !== id) }));
  };

  const certificatesHandler = (id, key, value) => {
    setSelected(prev => ({ ...prev, seed_documents: prev.seed_documents.map(row => (row.id === id ? { ...row, [key]: value } : row)) }));
  };

  const AddSeedBatch = async e => {
    e.preventDefault();
    setSendingData(true);
    const dataToSend = { ...selected };
    dataToSend.sortid = dataToSend.sortid.value;
    try {
      await axiosInstance.post(
        seeds.seeds(),
        { ...dataToSend },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        },
      );

      dispatch(showSuccess('Партия семян создана'));
      navigate(-1);
    } catch (error) {
      dispatch(showError('Не удалось создать партию семян'));
      console.log(error);
    } finally {
      setSendingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isLoading) {
    return (
      <Container className="bg-light-subtle rounded p-5">
        <Row>
          <Col>
            <Form onSubmit={AddSeedBatch}>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column xl={2} htmlFor="organization">
                  Организация:
                </Form.Label>
                <Col xl={4}>
                  <Form.Select id="organization" value={selected.agroid} onChange={e => selectHandler('agroid', e.target.value)} required>
                    <option value="">Выберите организацию</option>
                    {data.organization.map(el => (
                      <option value={el.id} key={el.id}>
                        {el.name}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Form.Group>

              <InputElem
                options={data.sort.map(el => ({ value: el.id, label: el.name }))}
                labelTitle="Сорт:"
                placeholder="Выберите сорт"
                selectHandler={changeHandler}
                value={selected.sortid}
              />

              <Form.Group as={Row} className="mb-3">
                <Form.Label column xl={2} htmlFor="generation">
                  Поколение:
                </Form.Label>

                <Col xl={4}>
                  <Form.Select id="generation" value={selected.generationid} onChange={e => selectHandler('generationid', e.target.value)} required>
                    <option value="">Выберите Поколение</option>
                    {data.generation.map(el => (
                      <option value={el.id} key={el.id}>
                        {el.name}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column xl={2} htmlFor="batchNumber">
                  Номер партии:
                </Form.Label>
                <Col xl={4}>
                  <Form.Control
                    id="batchNumber"
                    type="tex"
                    value={selected.batch_number}
                    onChange={e => selectHandler('batch_number', e.target.value)}
                    required
                    maxLength={100}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column xl={2} htmlFor="mass">
                  Количество, т.
                </Form.Label>
                <Col xl={4}>
                  <Form.Control
                    id="mass"
                    type="number"
                    value={selected.quantity}
                    onChange={e => selectHandler('quantity', e.target.value)}
                    required
                  />
                </Col>
              </Form.Group>

              {selected.seed_documents.length > 0 &&
                selected.seed_documents.map(row => (
                  <Row key={row.id} className="align-items-center mb-2 py-2 border border-primary-subtle rounded-3">
                    <Form.Group as={Col} xl={3}>
                      <Form.Label htmlFor={`certificate${row.id}`}>Сертификат</Form.Label>
                      <Form.Control
                        id={`certificate${row.id}`}
                        type="text"
                        onChange={e => certificatesHandler(row.id, 'certificate', e.target.value)}
                        value={row.certificate}
                        required
                        maxLength={100}
                      />
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label htmlFor={`validity${row.id}`}>Срок действия</Form.Label>
                      <Form.Control
                        id={`validity${row.id}`}
                        type="date"
                        onChange={e => certificatesHandler(row.id, 'validity', e.target.value)}
                        value={row.date}
                        required
                      />
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label htmlFor={`weight_1000${row.id}`}>Масса 1000 семян, г</Form.Label>
                      <Form.Control
                        id={`weight_1000${row.id}`}
                        type="number"
                        onChange={e => certificatesHandler(row.id, 'weight_1000', e.target.value)}
                        value={row.mass}
                        required
                      />
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label htmlFor={`germination${row.id}`}>Всхожесть, %</Form.Label>
                      <Form.Control
                        id={`germination${row.id}`}
                        type="number"
                        onChange={e => certificatesHandler(row.id, 'germination', e.target.value)}
                        value={row.germination}
                        required
                        min={0}
                        max={100}
                      />
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label htmlFor={`purity${row.id}`}>Чистота, %</Form.Label>
                      <Form.Control
                        id={`purity${row.id}`}
                        onChange={e => certificatesHandler(row.id, 'purity', e.target.value)}
                        value={row.purity}
                        type="number"
                        required
                        min={0}
                        max={100}
                      />
                    </Form.Group>

                    <Col xl={1} className="text-center">
                      <Button className="actionBtn" onClick={() => removeNewCertificate(row.id)}>
                        <IoMdRemoveCircleOutline size={20} color="#dc3545" />
                      </Button>
                    </Col>
                  </Row>
                ))}

              <Button size="sm" variant="outline-primary" className="mb-3" type="button" onClick={addNewCertificate}>
                Добавить сертификат
              </Button>
              <Row>
                <Col>
                  <Button size="sm" variant="outline-danger" type="button" onClick={() => navigate(-1)}>
                    Назад
                  </Button>
                </Col>
                <Col className="text-end">
                  {sendingData ? (
                    <Spinner animation="border" variant="success" />
                  ) : (
                    <Button variant="outline-success" size="sm" type="submit">
                      Создать
                    </Button>
                  )}
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
};
