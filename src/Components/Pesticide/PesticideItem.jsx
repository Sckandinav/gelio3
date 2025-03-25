import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Form, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { getData } from '../../api/getData';
import { useAxiosInterceptor } from '../hoc/useAxiosInterceptor';
import { useUserToken } from '../hoc/useUserToken.js';
import { warehousingApi } from '../../routes/routes';
import { Spinner as LoadingSpinner } from '../Spinner/Spinner';
import { CreationPesticideElement } from './CreationPesticideElement.jsx';
import { showError, showSuccess } from '../../store/slices/toast.js';

const UNITS_TYPES = [
  { value: 'l/ga', label: 'л/га' },
  { value: 'kg/ga', label: 'кг/га' },
  { value: 'l/t', label: 'л/т' },
  { value: 'kg/t', label: 'кг/т' },
  { value: 'ml/m2', label: 'мл/м2' },
  { value: 'ml/t', label: 'мл/т' },
  { value: 'g/t', label: 'г/т' },
  { value: 'g/m3', label: 'г/м3' },
];

export const PesticideItem = () => {
  const [data, setData] = useState({});
  const [payLoad, setPayload] = useState({
    pesticideTitle: [],
    disposalCulture: [],
    pesticidesGroup: [],
    substance: [],
  });
  const [loading, setLoading] = useState({
    getData: false,
    sendData: false,
  });
  const dispatch = useDispatch();
  const { id } = useParams();
  const axiosInstance = useAxiosInterceptor();
  const navigate = useNavigate();
  const token = useUserToken();

  const prepareDate = () => {
    return {
      pestecide_name_id: data?.pestecide_name?.id || '',
      pestecide_group_id: data?.pestecide_group?.id || '',
      substance_id: data.substance?.id || '',
      cropid_id: data?.cropid?.id || '',
      norm: data?.norm,
      units: data?.units || '',
      frequency: data?.frequency,
      term: data?.term,
      conditions: data?.conditions,
      approximate_terms: data?.approximateTerms,
    };
  };

  const getPesticideItem = async () => {
    setLoading(prev => ({ ...prev, getData: true }));
    try {
      const getPesticideTitle = await getData(warehousingApi.pesticideNames(), axiosInstance);
      const getDisposalCulture = await getData(warehousingApi.disposalCulture(), axiosInstance);
      const getPesticidesGroup = await getData(warehousingApi.pesticideGroup(), axiosInstance);
      const getSubstance = await getData(warehousingApi.substance(), axiosInstance);
      const response = await getData(`${warehousingApi.pesticides()}${id}`, axiosInstance);
      setData(response);
      setPayload(prev => ({
        ...prev,
        pesticideTitle: getPesticideTitle,
        disposalCulture: getDisposalCulture,
        pesticidesGroup: getPesticidesGroup,
        substance: getSubstance,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(prev => ({ ...prev, getData: false }));
    }
  };

  const updatePesticideItem = async e => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, sendData: true }));
    const serverData = prepareDate();
    try {
      await axiosInstance.put(warehousingApi.pesticidesPUT(id), serverData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });
      dispatch(showSuccess('Изменения внесены'));
      navigate('/chemistry');
    } catch (error) {
      dispatch(showError('Не удалось внести изменения'));
      console.log(error);
    } finally {
      setLoading(prev => ({ ...prev, sendData: false }));
    }
  };

  const inputHandler = (key, value) => {
    setData(prev => ({ ...prev, [key]: value.target.value }));
  };

  useEffect(() => {
    getPesticideItem();
  }, []);

  console.log('data', data);

  if (loading.getData) {
    return <LoadingSpinner />;
  }
  if (!loading.getData && data) {
    return (
      <Container className="bg-light-subtle p-3">
        <Row>
          <Col>
            <Form onSubmit={updatePesticideItem}>
              <fieldset className="border p-3">
                <legend className="w-auto float-none">Обязательные атрибуты</legend>

                <CreationPesticideElement
                  data={payLoad.pesticideTitle.map(el => ({ value: el.id, label: el.name }))}
                  selected={{ value: data.pestecide_name?.id, label: data.pestecide_name?.name }}
                  selectHandler={e => setData(prev => ({ ...prev, pestecide_name: { id: e?.value, name: e?.label } }))}
                  labelText="Название препарата:"
                  addUrl={warehousingApi.pesticideNames}
                  editUrl={warehousingApi.pesticideNamesChange}
                  removeUrl={warehousingApi.pesticideNamesChange}
                  updateFunc={getPesticideItem}
                />
                <CreationPesticideElement
                  data={payLoad.disposalCulture.map(el => ({ value: el.id, label: el.name }))}
                  selected={{ value: data.cropid?.id, label: data?.cropid?.name }}
                  selectHandler={e => setData(prev => ({ ...prev, cropid: { id: e?.value, name: e?.label } }))}
                  labelText={'Культура списания:'}
                  addUrl={warehousingApi.disposalCulture}
                  editUrl={warehousingApi.disposalCultureChange}
                  removeUrl={warehousingApi.disposalCultureChange}
                  updateFunc={getPesticideItem}
                />

                <Form.Group as={Row}>
                  <Form.Label column sm={4} className="fw-semibold" htmlFor="units">
                    Единицы применения:
                  </Form.Label>
                  <Col>
                    <Form.Select
                      id="units"
                      value={data.units}
                      onChange={e => {
                        const selectedValue = e.target.value;
                        const selectedOption = UNITS_TYPES.find(el => el.value === selectedValue);
                        setData(prev => ({ ...prev, units: selectedValue, units_display: selectedOption?.label || '' }));
                      }}
                      style={{ width: '200px' }}
                      required
                    >
                      {UNITS_TYPES.map(el => (
                        <option value={el.value} key={el.value}>
                          {el.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                </Form.Group>

                <CreationPesticideElement
                  data={payLoad.pesticidesGroup.map(el => ({ value: el.id, label: el.name }))}
                  selected={{ value: data.pestecide_group?.id, label: data?.pestecide_group?.name }}
                  selectHandler={e => setData(prev => ({ ...prev, pestecide_group: { id: e?.value, name: e?.label } }))}
                  labelText={'Группа пестицидов:'}
                  addUrl={warehousingApi.pesticideGroup}
                  editUrl={warehousingApi.pesticideGroupChange}
                  removeUrl={warehousingApi.pesticideGroupChange}
                  updateFunc={getPesticideItem}
                />
              </fieldset>
              <fieldset className="border p-3 mb-2">
                <legend className="w-auto float-none">Дополнительно</legend>

                <CreationPesticideElement
                  data={payLoad.substance.map(el => ({ value: el.id, label: el.name }))}
                  selected={{ value: data.substance?.id, label: data?.substance?.name }}
                  selectHandler={e => setData(prev => ({ ...prev, substance: { id: e?.value, name: e?.label } }))}
                  labelText={'Действующее вещество:'}
                  addUrl={warehousingApi.substance}
                  editUrl={warehousingApi.substanceChange}
                  removeUrl={warehousingApi.substanceChange}
                  updateFunc={getPesticideItem}
                />

                <Form.Group as={Row} className="d-flex mb-2">
                  <Form.Label column sm={4} className="fw-semibold" htmlFor="ApplicationRate">
                    Норма применения:
                  </Form.Label>
                  <Col sm={4}>
                    <Form.Control value={data.norm} id="ApplicationRate" type="text" onChange={e => inputHandler('norm', e)} required />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="d-flex mb-2">
                  <Form.Label column sm={4} className="fw-semibold" htmlFor="FrequencyOfUse">
                    Кратность применения:
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control
                      value={data.frequency}
                      id="FrequencyOfUse"
                      min="1"
                      type="number"
                      onChange={e => inputHandler('frequency', e)}
                      required
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="d-flex mb-2">
                  <Form.Label column sm={4} className="fw-semibold" htmlFor="term">
                    Срок до уборки урожая, дней:
                  </Form.Label>
                  <Col sm={2}>
                    <Form.Control value={data.term} id="term" min="1" type="number" onChange={e => inputHandler('term', e)} required />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="d-flex mb-2">
                  <Form.Label column sm={4} className="fw-semibold" htmlFor="TermsOfUse">
                    Условия применения:
                  </Form.Label>
                  <Col sm={7}>
                    <Form.Control
                      as="textarea"
                      name="TermsOfUse"
                      id="TermsOfUse"
                      value={data.conditions}
                      onChange={e => inputHandler('conditions', e)}
                      style={{ resize: 'none' }}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="d-flex mb-2">
                  <Form.Label column sm={4} className="fw-semibold" htmlFor="approximateTerms">
                    ПРИМЕРНЫЕ сроки списания:
                  </Form.Label>

                  <Col sm={2}>
                    <Form.Control
                      value={data.approximateTerms}
                      id="approximateTerms"
                      type="text"
                      onChange={e => inputHandler('approximateTerms', e)}
                    />
                  </Col>
                </Form.Group>
              </fieldset>

              <Row>
                <Col className="d-flex justify-content-between">
                  <Button variant="outline-danger" type="button" onClick={() => navigate(-1)}>
                    Назад
                  </Button>
                  {loading.sendData ? (
                    <Spinner animation="border" variant="success" />
                  ) : (
                    <Button variant="outline-success" type="submit">
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
