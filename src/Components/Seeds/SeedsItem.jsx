import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Spinner } from 'react-bootstrap';
import { IoMdRemoveCircleOutline } from 'react-icons/io';
import { useDispatch } from 'react-redux';

import { useAxiosInterceptor } from '../hoc/useAxiosInterceptor';
import { useUserToken } from '../hoc/useUserToken';
import { getData } from '../../api/getData';
import { seeds, links } from '../../routes/routes';
import { InputElem } from './InputElem.jsx';
import { showError, showSuccess } from '../../store/slices/toast.js';
import { Spinner as LoadingSpinner } from '../Spinner/Spinner.jsx';

export const SeedsItem = () => {
  const [data, setData] = useState({});
  const [payload, setPayload] = useState({
    organization: [],
    sort: [],
    generation: [],
  });
  const [isLoading, setIsLoading] = useState({
    getData: false,
    sendData: false,
  });

  const { id } = useParams();
  const token = useUserToken();
  const navigate = useNavigate();
  const axiosInstance = useAxiosInterceptor();
  const dispatch = useDispatch();

  console.log(data);

  const selectHandler = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const changeHandler = option => {
    console.log('option', option);
    setData(prev => ({ ...prev, sortid: option }));
  };

  const certificatesHandler = (id, key, value) => {
    setData(prev => ({ ...prev, seed_documents: prev.seed_documents.map(row => (row.id === id ? { ...row, [key]: value } : row)) }));
  };

  const removeNewCertificate = id => {
    setData(prev => ({ ...prev, seed_documents: prev.seed_documents.filter(el => el.id !== id) }));
  };

  const addNewCertificate = () => {
    setData(prev => ({
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
          seed: data.id,
        },
      ],
    }));
  };

  const getSeedItem = async () => {
    setIsLoading(prev => ({ ...prev, getData: true }));
    try {
      const getAgro = await getData(links.getAgro(), axiosInstance);
      const getSorts = await getData(seeds.sorts(), axiosInstance);
      const getGenerations = await getData(seeds.generations(), axiosInstance);
      const response = await getData(`${seeds.seeds()}${id}`, axiosInstance);
      setData({
        id: response.id,
        sortid: { value: response.sortid.id, label: response.sortid.shortname },
        generationid: { ...response.generationid },
        agroid: { ...response.agroid },
        seed_documents: [...response.seed_documents],
        batch_number: response.batch_number,
        quantity: response.quantity,
      });
      setPayload(prev => ({ ...prev, organization: getAgro, sort: getSorts, generation: getGenerations }));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(prev => ({ ...prev, getData: false }));
    }
  };

  const editSeeds = async e => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, sendData: true }));
    const dataToSend = { ...data };
    dataToSend.sortid = dataToSend.sortid.value;
    dataToSend.generationid = dataToSend?.generationid?.id ? dataToSend.generationid.id : dataToSend.generationid;
    dataToSend.agroid = dataToSend?.agroid?.id ? dataToSend.agroid?.id : dataToSend?.agroid;

    try {
      await axiosInstance.put(
        `${seeds.seeds()}${id}/`,
        { ...dataToSend },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        },
      );

      dispatch(showSuccess('Изменения внесены'));
      navigate(-1);
    } catch (error) {
      dispatch(showError('Не удалось внести изменения'));
      console.log(error);
    } finally {
      setIsLoading(prev => ({ ...prev, sendData: false }));
    }
  };

  useEffect(() => {
    getSeedItem();
  }, []);
  if (isLoading.getData) {
    return (
      <Container>
        <Row>
          <Col>
            <LoadingSpinner />
          </Col>
        </Row>
      </Container>
    );
  }

  if (!isLoading.getData && data) {
    return (
      <Container className="bg-light-subtle rounded p-5">
        <Row>
          <Col>
            <Form onSubmit={editSeeds}>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column xl={2} htmlFor="organization">
                  Организация:
                </Form.Label>
                <Col xl={4}>
                  <Form.Select id="organization" value={data?.agroid?.id} onChange={e => selectHandler('agroid', e.target.value)} required>
                    {payload.organization?.map(el => (
                      <option value={el.id} key={el.id}>
                        {el.name}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Form.Group>

              <InputElem
                options={payload.sort.map(el => ({ value: el.id, label: el.name }))}
                labelTitle="Сорт:"
                placeholder="Выберите сорт"
                selectHandler={changeHandler}
                value={data.sortid}
              />

              <Form.Group as={Row} className="mb-3">
                <Form.Label column xl={2} htmlFor="generation">
                  Поколение:
                </Form.Label>

                <Col xl={4}>
                  <Form.Select id="generation" value={data.generationid?.id} onChange={e => selectHandler('generationid', e.target.value)} required>
                    {payload.generation.map(el => (
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
                    value={data.batch_number}
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
                  <Form.Control id="mass" type="number" value={data.quantity} onChange={e => selectHandler('quantity', e.target.value)} required />
                </Col>
              </Form.Group>

              {data.seed_documents?.length > 0 &&
                data.seed_documents.map(row => (
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
                        value={row.validity}
                        required
                      />
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label htmlFor={`weight_1000${row.id}`}>Масса 1000 семян, г</Form.Label>
                      <Form.Control
                        id={`weight_1000${row.id}`}
                        type="number"
                        onChange={e => certificatesHandler(row.id, 'weight_1000', e.target.value)}
                        value={row.weight_1000}
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
                  {isLoading.sendData ? (
                    <Spinner animation="border" variant="success" />
                  ) : (
                    <Button variant="outline-success" size="sm" type="submit">
                      Сохранить
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
