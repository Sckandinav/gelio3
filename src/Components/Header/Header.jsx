import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IoIosLogOut } from 'react-icons/io';
import { Row, Col, OverlayTrigger, Popover, Button, Badge, Dropdown, Modal, ListGroup } from 'react-bootstrap';
import { IoNotificationsOutline } from 'react-icons/io5';
import { notificationsSelector } from '../../store/selectors/notificationsSelector';

import { logOut } from '../../store/slices/userAuth';
import { Menu } from '../Menu/Menu';
import { userSelectors } from '../../store/selectors/userSelectors';

import styles from './Header.module.scss';

export const Header = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector(notificationsSelector);
  const [show, setShow] = useState(false);
  const [notificationModal, setNotificationModal] = useState(false);
  const user = useSelector(userSelectors).data.user;
  const target = useRef(null);

  const notificationModalToggle = () => {
    setNotificationModal(prev => !prev);
  };

  const stringFormatter = (notification, closeFunc, closeModal = false) => {
    const [action, title] = notification.message.split(':');

    if ((closeModal = false)) {
      return (
        <span>
          {action}: <Link to={`/edo/room/${notification.room_key}`}>{title}</Link>
        </span>
      );
    } else {
      return (
        <span>
          {action}:{' '}
          <Link to={`/edo/room/${notification.room_key}`} onClick={closeFunc}>
            {title}
          </Link>
        </span>
      );
    }
  };

  const lastNotifications = notifications?.slice(-1)[0]?.notifications;
  const unreadCount = notifications?.slice(-1)[0]?.notifications.length;

  useEffect(() => {
    const handleClickOutside = event => {
      if (target.current && !target.current.contains(event.target)) {
        setShow(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const showNotification = lastNotifications => {
    if (lastNotifications?.length === 0) {
      return <span>Нет новых уведомлений</span>;
    }

    if (lastNotifications?.length <= 2) {
      return lastNotifications?.map(notification => {
        return <div key={notification.id}>{stringFormatter(notification)}</div>;
      });
    }

    if (lastNotifications?.length > 2) {
      return (
        <>
          {lastNotifications.slice(0, 2).map(notification => {
            return (
              <div className="mb-3" key={notification.id}>
                {stringFormatter(notification)}
              </div>
            );
          })}

          <div className="d-flex justify-content-end">
            <Button onClick={notificationModalToggle} size="sm">
              Смотреть все
            </Button>
          </div>
        </>
      );
    }
  };

  return (
    <>
      <Row className="p-3 bg-body">
        <Col className="d-flex justify-content-between align-items-center">
          <Menu />

          <div className="d-flex">
            <OverlayTrigger
              show={show}
              trigger="click"
              key="Notification"
              placement="bottom"
              overlay={
                <Popover>
                  <Popover.Header as="h3">Оповещения</Popover.Header>
                  <Popover.Body>{showNotification(lastNotifications)}</Popover.Body>
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

            <Dropdown>
              <Dropdown.Toggle variant="light" id="dropdown-basic" className={styles.dropdownToggle}>
                {user.full_name}
              </Dropdown.Toggle>
              <Dropdown.Menu className={styles.dropdownMenu}>
                <Dropdown.Item as="div" className={styles.dropdownItem} variant="light">
                  <Button
                    className={styles.logoutButton}
                    variant="light"
                    onClick={() => {
                      dispatch(logOut());
                    }}
                  >
                    <IoIosLogOut /> Выход
                  </Button>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Col>
      </Row>
      {notificationModal && (
        <Modal size="xl" show={notificationModal} onHide={notificationModalToggle}>
          <Modal.Header closeButton>
            <Modal.Title>Оповещения</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ListGroup>
              {lastNotifications?.map(notification => {
                return <ListGroup.Item key={notification.id}>{stringFormatter(notification, notificationModalToggle, true)}</ListGroup.Item>;
              })}
            </ListGroup>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};
