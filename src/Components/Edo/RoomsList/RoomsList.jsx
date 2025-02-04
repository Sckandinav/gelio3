import React, { useState, useEffect } from 'react';
import { BsCheck2Circle } from 'react-icons/bs';
import { FaExclamation, FaEye } from 'react-icons/fa';
import { Badge, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { Table } from '../../Table//Table';
import { getRooms } from '../../../api/getRooms';
import { links } from '../../../routes/routes.js';
import { Spinner } from '../../Spinner/Spinner.jsx';

export const RoomsList = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const notificationInfo = row => {
    if (row.status === 'closed') {
      return null;
    }

    if (row.notifications === true) {
      return (
        <span title={`Необходимо выполнить действий: ${row.actions}`}>
          <FaExclamation size={16} style={{ color: 'red' }} />
        </span>
      );
    }

    if (row.notifications === null) {
      return (
        <span title="Вы являетесь наблюдателем">
          <FaEye size={16} style={{ color: '#0d6efd' }} />
        </span>
      );
    }

    if (row.notifications === false) {
      return (
        <span title="Все действия выполнены">
          <BsCheck2Circle size={16} style={{ color: 'green' }} />
        </span>
      );
    }
  };

  const statusInfo = row => {
    return (
      <Stack>
        {row.status === 'closed' ? (
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

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await getRooms(links.getRooms());
        setData(response);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const columns = [
    {
      name: '',
      selector: row => row.id,
      omit: true,
    },
    {
      name: '',
      selector: row => row.notifications,
      width: '50px',
    },
    {
      name: 'Название',
      selector: row => row.title,
      sortable: true,
      cell: row => <Link to={`/edo/room/${row.id}`}>{row.title}</Link>,
    },
    {
      name: 'Создатель комнаты',
      selector: row => row.creator,
      sortable: true,
    },
    {
      name: 'Описание',
      selector: row => row.description,
      sortable: true,
    },
    {
      name: 'Статус',
      selector: row => row.status,
      sortable: true,
      sortFunction: (a, b) => a.statusValue.localeCompare(b.statusValue),
    },

    {
      name: 'Создано',
      selector: row => row.date,
      sortable: true,
    },
  ];

  const tableData = data.map(row => ({
    id: row.id,
    notifications: notificationInfo(row),
    title: row.title,
    creator: row.creator,
    description: row.description,
    status: statusInfo(row),
    statusValue: row.status,
    date: `${new Date(row.created_at).toLocaleString()}`,
  }));

  if (isLoading) {
    return <Spinner />;
  }

  if (!isLoading) {
    return (
      <div>
        <Table columns={columns} data={tableData} title="Созданные" selectableRows={false} />
      </div>
    );
  }
};
