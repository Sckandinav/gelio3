import React, { useState, useEffect } from 'react';
import { Outlet, useSearchParams, useLocation } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import { Dashboard } from '../Components/Dashboard/Dashboard';
import { Spinner } from '../Components/Spinner/Spinner';
import { WebSocketMenuListener } from '../Components/hoc/WebSocket/WebSocketMenuListener';
import { notificationsSelector } from '../store/selectors/notificationsSelector';
import { Create } from '../Components/Edo/Create';
import { getRoom } from '../api/getRoom';
import { useAxiosInterceptor } from '../Components/hoc/useAxiosInterceptor';
import { links } from '../routes/routes.js';
import { RoomsList } from '../Components/Edo/RoomsList/RoomsList.jsx';

import styles from './styles/Edo.module.scss';

export const Edo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [title, setTitle] = useState('входящие');
  const [searchParams, setSearchParams] = useSearchParams();
  const axiosInstance = useAxiosInterceptor();
  const { pathname } = useLocation();

  const { data } = useSelector(notificationsSelector)?.sideBar || {};

  const addParam = (key, value) => {
    searchParams.set(key, value);
    setSearchParams(searchParams);
  };

  const removeParam = key => {
    searchParams.delete(key);
    setSearchParams(searchParams);
  };

  const getRoomsList = async () => {
    setIsLoading(true);
    try {
      const response = await getRoom(links.getRooms(), axiosInstance, searchParams);
      setRooms(response);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRoomsList();
  }, [searchParams]);

  if (isLoading) {
    return <Spinner />;
  } else {
    return (
      <Container fluid className={`bg-light-subtle rounded pt-3  ${styles.edoInner}`}>
        <Row className="mb-3">
          <Col>
            <WebSocketMenuListener />
            <Dashboard
              isDropdown={true}
              data={data}
              create={<Create />}
              setParamsFunc={addParam}
              removeParam={removeParam}
              updateList={getRoomsList}
              setTitle={setTitle}
            />
          </Col>
        </Row>
        <Row>
          <Col className="px-4">{pathname.includes('/edo/room/') ? <Outlet /> : <RoomsList data={rooms} title={title} />}</Col>
        </Row>
      </Container>
    );
  }
};
