import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

import { PaymentList } from '../Components/Payment/PaymentList';
import { Dashboard } from '../Components/Dashboard/Dashboard';
import { CreatePayment } from '../Components/Payment/CreatePayment';
import { url, payment } from '../routes/routes.js';
import { useAxiosInterceptor } from '../Components/hoc/useAxiosInterceptor';
import { getData } from '../api/getData.js';
import { Spinner } from '../Components/Spinner/Spinner.jsx';

export const Payment = () => {
  const [paymentList, setPaymentList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const axiosInstance = useAxiosInterceptor();

  const type = searchParams.get('created');

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
      key: 'incoming',
      value: true,
    },
    created: {
      key: 'created',
      value: true,
    },
  };

  const getPayment = async () => {
    setIsLoading(true);
    try {
      const response = await getData(payment.payment(), axiosInstance, searchParams);
      setPaymentList(response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPayment();
  }, [searchParams]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!isLoading && paymentList) {
    return (
      <Container fluid className="bg-light-subtle rounded pt-3">
        <Row className="mb-3">
          <Col>
            <Dashboard
              isDropdown={false}
              data={[]}
              create={<CreatePayment />}
              modalTitle={'Создать заявку на оплату'}
              fullScreen={true}
              linkUrl={url.paymentAdd}
              setParamsFunc={addParam}
              removeParam={removeParam}
              searchProps={searchProps}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <PaymentList data={paymentList} title={type ? 'Заявки на оплату, исходящие' : 'Заявки на оплату, входящие'} />
          </Col>
        </Row>
      </Container>
    );
  }
};
