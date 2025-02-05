import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, Row, Col, Stack, Badge, ListGroup, ButtonGroup } from 'react-bootstrap';
import { motion, AnimatePresence } from 'motion/react';
import { useSelector } from 'react-redux';
import { GoQuestion } from 'react-icons/go';
import { useDispatch } from 'react-redux';
import Accordion from 'react-bootstrap/Accordion';

import { getRoom } from '../../../api/getRoom';
import { roomLinks, url } from '../../../routes/routes';
import { Spinner } from '../../Spinner/Spinner';
import { Modal } from '../../Modal/Modal';
import { Table } from '../../Table/Table';
import { AddFile } from './DocumentsActions/AddFile';
import { InviteMembers } from './DocumentsActions/InviteMembers';
import { RemoveMembers } from './DocumentsActions/RemoveMembers';
import { userSelectors } from '../../../store/selectors/userSelectors';
import { AddSignatories } from './DocumentsActions/AddSignatories';
import { RemoveSigners } from './DocumentsActions/RemoveSigners';
import { AddViewers } from './DocumentsActions/AddViewers';
import { RemoveViewers } from './DocumentsActions/RemoveViewers';
import { SignDocument } from './DocumentsActions/SignDocument';
import { RejectSign } from './DocumentsActions/RejectSign';
import { ViewDocument } from './DocumentsActions/ViewDocument';
import { showSuccess, showError } from '../../../store/slices/toast';
import { useAxiosInterceptor } from '../../hoc/useAxiosInterceptor';

const statusInfo = status => {
  return (
    <Stack className="m-0 p-0 align-self-end">
      {status === 'closed' ? (
        <Badge pill bg="secondary">
          Закрыта
        </Badge>
      ) : (
        <Badge pill bg="success">
          Открыта
        </Badge>
      )}
    </Stack>
  );
};

export const EdoRoom = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const axiosInstance = useAxiosInterceptor();

  const currentUserID = useSelector(userSelectors).data?.user.id;
  console.log(data);

  const navigate = useNavigate();

  const [modalsBtns, setModalsBtns] = useState({
    participants: false,
    addFile: false,
    invite: false,
    removeUser: false,
    addSignatories: false,
    removeSigners: false,
    addViewers: false,
    removeViewers: false,
    signDocument: false,
    rejectSign: false,
    viewDocument: false,
  });
  const [isCompletedRoom, setIsCompletedRoom] = useState(false);

  const [actionsID, setActionsID] = useState('');
  const [fileIdsToRemove, setFileIdsToRemove] = useState([]);

  const actionsIDHandler = (val = null) => {
    actionsID === val || val === null ? setActionsID('') : setActionsID(val);
  };
  const [actionsOnDocument, setActionsOnDocument] = useState([]);

  const modalToggle = key => {
    setModalsBtns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const checkSigners = row => {
    return row?.signers_status.some(signer => Number(signer.signer_id) === Number(currentUserID) && !signer.is_signed && signer.is_signed !== null);
  };

  const checkViewers = row => {
    return row?.viewers_status.some(viewer => Number(viewer.viewer_id) === Number(currentUserID) && !viewer.is_viewed);
  };

  const isFreeUsers = row => {
    const membersID = data.members.map(user => user.user_id);
    const usersWithRole = [...row.signers_status.map(user => user.signer_id), ...row.viewers_status.map(user => user.viewer_id)];
    return membersID.some(user => !usersWithRole.includes(user));
  };

  const isSigners = row => {
    return row.signers_status.length > 0 && row.signers_status.some(user => user.is_signed !== true);
  };

  const isViewers = row => {
    return row.viewers_status.length > 0;
  };

  const addFileToRemove = data => {
    setFileIdsToRemove(data.selectedRows);
  };

  const isCurrentUserInRoom = () => {
    return data.members?.some(user => Number(user.user_id) === Number(currentUserID)) || Number(currentUserID) === Number(data.creator_id);
  };

  const actionsBtn = row => {
    return (
      <>
        <Button variant="outline-secondary" onClick={() => actionsIDHandler(row.id)} className="mb-1" disabled={data.status === 'closed'}>
          Действия
        </Button>
        <AnimatePresence>
          {actionsID === row.id && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <ButtonGroup vertical>
                {checkSigners(row) && (
                  <Button
                    variant="secondary"
                    className="text-start"
                    onClick={() => {
                      modalToggle('signDocument');
                      setActionsOnDocument(row);
                    }}
                  >
                    Подписать
                  </Button>
                )}
                {checkSigners(row) && (
                  <Button
                    variant="secondary"
                    className="text-start"
                    onClick={() => {
                      modalToggle('rejectSign');
                      setActionsOnDocument(row);
                    }}
                  >
                    Отклонить
                  </Button>
                )}
                {checkViewers(row) && (
                  <Button
                    variant="secondary"
                    className="text-start"
                    onClick={() => {
                      modalToggle('viewDocument');
                      setActionsOnDocument(row);
                    }}
                  >
                    Подтвердить просмотр
                  </Button>
                )}

                {isFreeUsers(row) && (
                  <Button
                    variant="secondary"
                    className="text-start"
                    onClick={() => {
                      modalToggle('addSignatories');
                      setActionsOnDocument(row);
                    }}
                  >
                    Добавить подписанта
                  </Button>
                )}

                {isFreeUsers(row) && (
                  <Button
                    variant="secondary"
                    className="text-start"
                    onClick={() => {
                      modalToggle('addViewers');
                      setActionsOnDocument(row);
                    }}
                  >
                    Добавить просмотрщика
                  </Button>
                )}

                {isSigners(row) && (
                  <Button
                    variant="secondary"
                    className="text-start"
                    onClick={() => {
                      modalToggle('removeSigners');
                      setActionsOnDocument(row);
                    }}
                  >
                    Убрать подписанта
                  </Button>
                )}

                {isViewers(row) && (
                  <Button
                    variant="secondary"
                    className="text-start"
                    onClick={() => {
                      modalToggle('removeViewers');
                      setActionsOnDocument(row);
                    }}
                  >
                    Убрать просмотрщика
                  </Button>
                )}
              </ButtonGroup>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  };

  const displayUsers = (row, role) => {
    const users = role === 'signers' ? row.signers_status : row.viewers_status || [];

    return users?.map((user, index) => {
      if (role === 'signers' && user.is_signed === null) {
        return (
          <div key={index}>
            <span className="text-danger d-block">{user.signer}</span>
            <span className="text-danger">
              Отклонен {new Date(user.signed_at).toLocaleString()} <GoQuestion title={`Отклонен с комментарием: "${user.comment}"`} size={20} />
            </span>
          </div>
        );
      }
      if (role === 'signers' && user.is_signed === true) {
        return (
          <div key={index}>
            <span className="text-success d-block">{user.signer}</span>
            <span className="text-success">Подписан {new Date(user.signed_at).toLocaleString()}</span>
          </div>
        );
      }
      if (role === 'viewers' && user.is_viewed) {
        return (
          <div key={index}>
            <span className="text-success d-block">{user.viewer}</span>
            <span className="text-success">Просмотрен {new Date(user.viewed_at).toLocaleString()}</span>
          </div>
        );
      }

      return <span key={index}>{role === 'signers' ? user.signer : user.viewer}</span>;
    });
  };

  const dowLoadLink = row => {
    return (
      <a href={row.file} download>
        {row.name}
      </a>
    );
  };

  const columns = [
    {
      name: '',
      selector: row => row.id,
      omit: true,
    },

    {
      name: 'Название',
      selector: row => row.name,
    },
    {
      name: 'Создатель документа',
      selector: row => row.creator,
    },

    {
      name: 'Действия с документом',
      selector: row => actionsBtn(row),
      grow: 2,
    },

    {
      name: 'Подписанты',
      cell: row => displayUsers(row, 'signers'),
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '5px',
        justifyContent: 'center',
        fontSize: '14px',
      },
    },

    {
      name: 'Просмотр файла',
      cell: row => displayUsers(row, 'viewers'),
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '5px',
        justifyContent: 'center',
        fontSize: '14px',
      },
    },
  ];

  const tableData = data?.documents?.map(row => ({
    id: row.id,
    name: dowLoadLink(row),
    creator: row.uploaded_by,
    actions: actionsBtn(row),
    signers_status: row.signers_status,
    viewers_status: row.viewers_status || [],
  }));

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await getRoom(roomLinks.room(id), axiosInstance);
      setData(response);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const deleteFileFromRoom = async () => {
    const token = localStorage.getItem('token');
    const axInst = axiosInstance;
    const filesID = fileIdsToRemove.map(file => file.id);
    try {
      await axInst.post(
        roomLinks.removeFile(id),
        { documents: filesID },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        },
      );
      dispatch(showSuccess('Файл удален'));
      fetchData();
    } catch (error) {
      console.log(error);
      dispatch(showError('Не удалось удалить файл'));
    }
  };

  const closingRoom = async () => {
    const token = localStorage.getItem('token');
    const axInst = axiosInstance;
    try {
      await axInst.post(
        roomLinks.toggleStatus(id),
        { status: `${data.status === 'closed' ? 'open' : 'closed'}` },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        },
      );
      if (data.status === 'open') {
        fetchData();
        dispatch(showSuccess('Комната закрыта'));
        navigate('/edo');
      } else {
        fetchData();
        dispatch(showSuccess('Комната открыта'));
      }
    } catch (error) {
      dispatch(showError('Не удалось выполнить действие'));
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (data && data.documents) {
      const isCompleted = data.documents.every(doc => {
        const hasRejected = doc.signers_status.some(signer => signer.is_signed === null && signer.comment);
        if (hasRejected) {
          return true;
        }
        const allViewed = doc.viewers_status.every(viewer => viewer.is_viewed);
        const allSigned = doc.signers_status.every(signer => signer.is_signed === true);

        return allViewed && allSigned;
      });

      setIsCompletedRoom(isCompleted);
    }
  }, [data]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!isLoading && !isCurrentUserInRoom()) {
    navigate(url.notFound());
  }

  if (!isLoading) {
    return (
      <>
        <Row className="p-0 d-flex align-items-center mb-3">
          <Col className="p-0">
            <div style={{ maxWidth: '200px' }} className="d-flex align-items-center mb-2">
              <span className="mx-1 d-block">Комната:</span>
              {statusInfo(data.status)}
            </div>
            <div>
              <p className="m-0">
                Описание комнаты: <span>{data.description}</span>
              </p>
              <p className="m-0">
                Создатель комнаты: <span>{data.creator}</span>
              </p>
            </div>
          </Col>

          <Col className="d-flex justify-content-end column-gap-3">
            <Button variant="secondary" onClick={() => modalToggle('participants')}>
              Участники
            </Button>
            <Button variant="success" onClick={() => modalToggle('invite')} disabled={data.status === 'closed'}>
              Пригласить участника
            </Button>
            <Button variant="danger" onClick={() => modalToggle('removeUser')} disabled={data.status === 'closed'}>
              Удалить участника
            </Button>
            <Button disabled={!isCompletedRoom} onClick={closingRoom}>
              {data.status === 'open' ? ' Закрыть комнату' : 'Открыть комнату'}
            </Button>
          </Col>
        </Row>

        <Row>
          <Col className="p-0">
            <h3>Документы</h3>
          </Col>
          <Col className="d-flex justify-content-end column-gap-3">
            <Button variant="success" onClick={() => modalToggle('addFile')} disabled={data.status === 'closed'}>
              Добавить файл
            </Button>
            <Button variant="danger" disabled={fileIdsToRemove.length === 0 || data.status === 'closed'} onClick={deleteFileFromRoom}>
              Удалить файл
            </Button>
          </Col>
        </Row>
        <Row>
          <Col className="p-0 ">
            <Table selectableRows={true} columns={columns} data={tableData} SelectFunc={addFileToRemove} hasSearch={false} />
          </Col>
        </Row>
        <Row>
          <Col>
            <Accordion defaultActiveKey="0" className="mb-3">
              <Accordion.Item>
                <Accordion.Header>Протокол комнаты</Accordion.Header>
                <Accordion.Body>
                  {data.room_history.map((el, id) => (
                    <span className="d-block " key={id}>
                      {el}
                    </span>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>

        <Modal show={modalsBtns.participants} close={() => modalToggle('participants')} title={'Участники комнаты'}>
          <ListGroup>
            {data.members.map(user => (
              <ListGroup.Item key={user.user_id}>{user.full_name}</ListGroup.Item>
            ))}
          </ListGroup>
        </Modal>

        <Modal show={modalsBtns.addFile} close={() => modalToggle('addFile')} title={'Добавить файл'}>
          <AddFile closePopup={() => modalToggle('addFile')} updateRoom={fetchData} />
        </Modal>
        <Modal show={modalsBtns.invite} close={() => modalToggle('invite')} title={'Пригласить участника'}>
          <InviteMembers closePopup={() => modalToggle('invite')} updateRoom={fetchData} members={data.members} />
        </Modal>
        <Modal show={modalsBtns.removeUser} close={() => modalToggle('removeUser')} title={'Убрать участника'}>
          <RemoveMembers closePopup={() => modalToggle('removeUser')} updateRoom={fetchData} roomsDetails={data} />
        </Modal>

        <Modal show={modalsBtns.addSignatories} close={() => modalToggle('addSignatories')} title={'Добавить подписанта'}>
          <AddSignatories
            closePopup={() => modalToggle('addSignatories')}
            updateRoom={fetchData}
            document={actionsOnDocument}
            members={data.members}
            actionsIDHandler={actionsIDHandler}
          />
        </Modal>

        <Modal show={modalsBtns.removeSigners} close={() => modalToggle('removeSigners')} title={'Убрать подписанта'}>
          <RemoveSigners
            closePopup={() => modalToggle('removeSigners')}
            updateRoom={fetchData}
            document={actionsOnDocument}
            actionsIDHandler={actionsIDHandler}
          />
        </Modal>

        <Modal show={modalsBtns.addViewers} close={() => modalToggle('addViewers')} title={'Добавить просмотрщика'}>
          <AddViewers
            closePopup={() => modalToggle('addViewers')}
            updateRoom={fetchData}
            document={actionsOnDocument}
            members={data.members}
            actionsIDHandler={actionsIDHandler}
          />
        </Modal>

        <Modal show={modalsBtns.removeViewers} close={() => modalToggle('removeViewers')} title={'Убрать просмотрщика'}>
          <RemoveViewers
            closePopup={() => modalToggle('removeViewers')}
            updateRoom={fetchData}
            document={actionsOnDocument}
            actionsIDHandler={actionsIDHandler}
          />
        </Modal>

        {modalsBtns.signDocument && (
          <SignDocument
            show={modalsBtns.signDocument}
            close={() => modalToggle('signDocument')}
            updateRoom={fetchData}
            document={actionsOnDocument}
            actionsIDHandler={actionsIDHandler}
          />
        )}

        {modalsBtns.rejectSign && (
          <RejectSign
            show={modalsBtns.rejectSign}
            close={() => modalToggle('rejectSign')}
            updateRoom={fetchData}
            document={actionsOnDocument}
            actionsIDHandler={actionsIDHandler}
          />
        )}
        {modalsBtns.viewDocument && (
          <ViewDocument
            show={modalsBtns.viewDocument}
            close={() => modalToggle('viewDocument')}
            updateRoom={fetchData}
            document={actionsOnDocument}
            actionsIDHandler={actionsIDHandler}
          />
        )}
      </>
    );
  }
};
