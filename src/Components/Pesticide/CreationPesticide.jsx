import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Container, Row, Col, Button, Form } from 'react-bootstrap';

import { warehousingApi } from '../../routes/routes.js';
import { showSuccess, showError } from '../../store/slices/toast.js';
import { useAxiosInterceptor } from '../hoc/useAxiosInterceptor';
import { CreationPesticideElement } from './CreationPesticideElement.jsx';
import { getData } from '../../api/getData.js';
import { useUserToken } from '../hoc/useUserToken.js';

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
export const CreationPesticide = () => {
  const [pesticideTitle, setPesticideTitle] = useState([]);
  const [selectedPesticide, setSelectedPesticide] = useState(null);

  const [disposalCulture, setDisposalCulture] = useState([]);
  const [selectedDisposalCulture, setSelectedDisposalCulture] = useState(null);

  const [unitsOfApplication, setUnitsOfApplication] = useState('');
  const [pesticidesGroup, setPesticidesGroup] = useState([]);
  const [selectedPesticidesGroup, setSelectedPesticidesGroup] = useState();
  const [substance, setSubstance] = useState([]);
  const [selectedSubstance, setSelectedSubstance] = useState('');
  const [term, setTerm] = useState('');
  const [frequency, setFrequency] = useState('');
  const [applicationRate, setApplicationRate] = useState('');
  const [conditions, setConditions] = useState('');
  const [approximateTerms, setApproximateTerms] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const axiosInstance = useAxiosInterceptor();
  const token = useUserToken();

  const prepareDate = () => {
    return {
      pestecide_name_id: selectedPesticide?.value || '',
      pestecide_group_id: selectedPesticidesGroup?.value || '',
      substance_id: selectedSubstance?.value || '',
      cropid_id: selectedDisposalCulture?.value || '',
      norm: applicationRate,
      units: unitsOfApplication || '',
      frequency: frequency,
      term: term,
      conditions: conditions,
      approximate_terms: approximateTerms === null || approximateTerms === '' ? null : approximateTerms,
    };
  };

  const sendData = async e => {
    e.preventDefault();
    try {
      const data = prepareDate();

      await axiosInstance.post(warehousingApi.pesticides(), data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });

      dispatch(showSuccess('Пестицид добавлен'));
      navigate('/chemistry');
    } catch (error) {
      dispatch(showError('Не удалось выполнить действие'));
      console.log(error);
    }
  };

  const getPesticideTitle = async () => {
    try {
      const response = await getData(warehousingApi.pesticideNames(), axiosInstance);

      const pesticideOptions = response.map(pesticide => ({
        value: pesticide.id,
        label: pesticide.name,
      }));

      setPesticideTitle(pesticideOptions);
    } catch (error) {
      console.error('Error fetching pesticide titles', error);
    }
  };

  const getDisposalCulture = async () => {
    try {
      const response = await getData(warehousingApi.disposalCulture(), axiosInstance);
      const options = response.map(el => ({
        value: el.id,
        label: el.name,
      }));
      setDisposalCulture(options);
    } catch (error) {
      console.log(error);
    }
  };

  const getPesticidesGroup = async () => {
    try {
      const response = await getData(warehousingApi.pesticideGroup(), axiosInstance);
      const options = response.map(pesticide => ({
        value: pesticide.id,
        label: pesticide.name,
      }));

      setPesticidesGroup(options);
    } catch (error) {
      console.log(error);
    }
  };

  const getSubstance = async () => {
    try {
      const response = await getData(warehousingApi.substance(), axiosInstance);
      const options = response.map(pesticide => ({
        value: pesticide.id,
        label: pesticide.name,
      }));
      setSubstance(options);
    } catch (error) {
      console.log(error);
    }
  };

  const handleApproximateTerms = e => {
    setApproximateTerms(e.target.value);
  };

  const handleConditions = e => {
    setConditions(e.target.value);
  };

  const handleApplicationRate = e => {
    setApplicationRate(e.target.value);
  };

  const handleFrequency = e => {
    setFrequency(Math.round(e.target.value));
  };

  const handleTerm = e => {
    setTerm(Math.round(e.target.value));
  };

  const handleSubstance = selectedOption => {
    setSelectedSubstance(selectedOption);
  };

  const handlePesticidesGroup = selectedOption => {
    setSelectedPesticidesGroup(selectedOption);
  };

  const handleSelectChange = options => {
    setSelectedPesticide(options);
  };

  const handleDisposalCulture = selectedOption => {
    setSelectedDisposalCulture(selectedOption);
  };

  const handleUnitsOfApplication = e => {
    setUnitsOfApplication(e.target.value);
  };

  useEffect(() => {
    getPesticideTitle();
    getDisposalCulture();
    getPesticidesGroup();
    getSubstance();
  }, []);

  return (
    <Container className="bg-light-subtle p-3" style={{ maxWidth: '900px' }}>
      <Row>
        <Col>
          <Form onSubmit={sendData}>
            <fieldset className="border p-3">
              <legend className="w-auto float-none">Обязательные атрибуты</legend>
              <CreationPesticideElement
                data={pesticideTitle}
                selected={selectedPesticide}
                selectHandler={handleSelectChange}
                labelText={'Название препарата:'}
                addUrl={warehousingApi.pesticideNames}
                editUrl={warehousingApi.pesticideNamesChange}
                removeUrl={warehousingApi.pesticideNamesChange}
                updateFunc={getPesticideTitle}
              />

              <CreationPesticideElement
                data={disposalCulture}
                selected={selectedDisposalCulture}
                selectHandler={handleDisposalCulture}
                labelText={'Культура списания:'}
                addUrl={warehousingApi.disposalCulture}
                editUrl={warehousingApi.disposalCultureChange}
                removeUrl={warehousingApi.disposalCultureChange}
                updateFunc={getDisposalCulture}
              />

              <Form.Group as={Row} className="d-flex mb-2">
                <Form.Label column sm={4} className="fw-semibold" htmlFor="units">
                  Единицы применения:
                </Form.Label>
                <Col>
                  <Form.Select id="units" value={unitsOfApplication} onChange={handleUnitsOfApplication} style={{ width: '200px' }} required>
                    <option value="">Выберите единицы</option>
                    {UNITS_TYPES.map(el => (
                      <option value={el.value} key={el.value}>
                        {el.label}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Form.Group>

              <CreationPesticideElement
                data={pesticidesGroup}
                selected={selectedPesticidesGroup}
                selectHandler={handlePesticidesGroup}
                labelText={'Группа пестицидов:'}
                addUrl={warehousingApi.pesticideGroup}
                editUrl={warehousingApi.pesticideGroupChange}
                removeUrl={warehousingApi.pesticideGroupChange}
                updateFunc={getPesticidesGroup}
              />
            </fieldset>
            <fieldset className="border p-3 mb-2">
              <legend className="w-auto float-none">Дополнительно</legend>

              <CreationPesticideElement
                data={substance}
                selected={selectedSubstance}
                selectHandler={handleSubstance}
                labelText={'Действующее вещество:'}
                addUrl={warehousingApi.substance}
                editUrl={warehousingApi.substanceChange}
                removeUrl={warehousingApi.substanceChange}
                updateFunc={getSubstance}
              />

              <Form.Group as={Row} className="d-flex mb-2">
                <Form.Label column sm={4} className="fw-semibold" htmlFor="ApplicationRate">
                  Норма применения:
                </Form.Label>
                <Col sm={4}>
                  <Form.Control value={applicationRate} id="ApplicationRate" type="text" onChange={handleApplicationRate} required />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="d-flex mb-2">
                <Form.Label column sm={4} className="fw-semibold" htmlFor="FrequencyOfUse">
                  Кратность применения:
                </Form.Label>
                <Col sm={2}>
                  <Form.Control value={frequency} id="FrequencyOfUse" min="1" type="number" onChange={handleFrequency} required />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="d-flex mb-2">
                <Form.Label column sm={4} className="fw-semibold" htmlFor="term">
                  Срок до уборки урожая, дней:
                </Form.Label>
                <Col sm={2}>
                  <Form.Control value={term} id="term" min="1" type="number" onChange={handleTerm} required />
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
                    value={conditions}
                    onChange={handleConditions}
                    style={{ resize: 'none' }}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="d-flex mb-2">
                <Form.Label column sm={4} className="fw-semibold" htmlFor="approximateTerms">
                  ПРИМЕРНЫЕ сроки списания:
                </Form.Label>

                <Col sm={2}>
                  <Form.Control value={approximateTerms} id="approximateTerms" type="text" onChange={handleApproximateTerms} />
                </Col>
              </Form.Group>
            </fieldset>

            <Row>
              <Col className="d-flex justify-content-between">
                <Button variant="outline-danger" onClick={() => navigate(-1)}>
                  Назад
                </Button>
                <Button variant="outline-success" type="submit">
                  Добавить
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
