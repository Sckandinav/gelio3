import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { IoIosLogOut } from 'react-icons/io';
import { Row, Col, OverlayTrigger, Popover, Button, Badge } from 'react-bootstrap';
import { IoNotificationsOutline } from 'react-icons/io5';
import { notificationsSelector } from '../../store/selectors/notificationsSelector';

import { logOut } from '../../store/slices/userAuth';
import { Menu } from '../Menu/Menu';
import { url } from '../../routes/routes.js';

export const Header = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector(notificationsSelector);
  const [show, setShow] = useState(false);
  const target = useRef(null); // Ссылка на кнопку

  const lastNotifications = notifications?.slice(-1)[0]?.notifications;

  useEffect(() => {
    const handleClickOutside = event => {
      if (target.current && !target.current.contains(event.target)) {
        setShow(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <Row className="p-3 bg-body">
      <Col className="d-flex justify-content-between align-items-center">
        <Menu />

        <div>
          <OverlayTrigger
            show={show}
            trigger="click"
            key="Notification"
            placement="bottom"
            overlay={
              <Popover id={`popover-positioned-bottom`}>
                <Popover.Header as="h3">Оповещения</Popover.Header>
                <Popover.Body>
                  {lastNotifications && lastNotifications.length > 0
                    ? lastNotifications?.map((notification, id) => {
                        if (notification.object_type === 'document_viewer') {
                          return (
                            <span key={id} className="d-block mb-1">
                              Вам нужно подтвердить просмотр <Link to={url.edo()}>{notification.count}</Link> документ(-ов).
                            </span>
                          );
                        }
                        if (notification.object_type === 'document_signer') {
                          return (
                            <span key={id} className="d-block mb-1">
                              Вам необходимо подписать <Link to={url.edo()}>{notification.count}</Link> документ(-ов).
                            </span>
                          );
                        }
                        return null;
                      })
                    : 'Нет новых уведомлений'}
                </Popover.Body>
              </Popover>
            }
          >
            <Button ref={target} variant="link" className="p-0 position-relative" onClick={() => setShow(!show)}>
              <IoNotificationsOutline size={30} className="mx-4" />
              {unreadCount && unreadCount > 0 ? (
                <Badge pill bg="primary" className="position-absolute top-0 end-0 translate-middle-x">
                  {unreadCount}
                </Badge>
              ) : null}
            </Button>
          </OverlayTrigger>

          <Button
            className="mx-4"
            variant="light"
            onClick={() => {
              dispatch(logOut());
            }}
          >
            <IoIosLogOut /> Выход
          </Button>
        </div>
      </Col>
    </Row>
  );
};
