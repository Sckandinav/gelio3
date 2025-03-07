import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BsCheck2Circle } from 'react-icons/bs';
import { FaExclamation, FaEye } from 'react-icons/fa';
import { Badge, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

import { Table } from '../../Table//Table';
import { surnameFormatter } from '../../../utils/surnameFormatter.js';
import { getData } from '../../../api/getData.js';
import { useAxiosInterceptor } from '../../hoc/useAxiosInterceptor';
import { links } from '../../../routes/routes.js';

export const RoomsList = ({ data, title }) => {
  const { search } = useLocation();
  const [roomsType, setRoomsType] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const axiosInstance = useAxiosInterceptor();

  const setSelected = e => {
    setSelectedType(e.target.value);
  };
  const notificationInfo = row => {
    if (row.status === 'closed') {
      return null;
    }

    if (row.notifications === true) {
      return (
        <span title={`${row.actions ? `Необходимо выполнить действий: ${row.actions}` : 'Не все пользователи выполнили свои действия'}`}>
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

  const chekFrom = row => {
    if (search.includes('departament_id')) {
      return row.departament;
    } else if (search.includes('agro_id')) {
      return row.departament;
    } else {
      return row.company;
    }
  };

  const dateFormate = dateStr => {
    const [datePart, timePart] = dateStr.split(', ');
    const [day, month, year] = datePart.split('.');
    const [hours, minutes, seconds] = timePart.split(':');
    const date = new Date(year, month - 1, day, hours, minutes, seconds);
    return date.getTime();
  };

  const columns = [
    {
      name: '',
      selector: row => row.notifications,
      width: '50px',
    },
    {
      name: '№',
      selector: row => row.id,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Название',
      selector: row => row.title,
      sortable: true,
      cell: row => <Link to={`/room/${row.id}`}>{row.title}</Link>,
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
      name: 'Отправитель',
      selector: row => row.from,
      sortable: true,
    },
    {
      name: 'Категория',
      selector: row => row.room_type_name,
      width: '140px',
      sortable: true,
    },
    {
      name: 'Статус',
      selector: row => row.status,
      sortable: true,
      sortFunction: (a, b) => a.statusValue.localeCompare(b.statusValue),
      width: '100px',
    },

    {
      name: 'Создано',
      selector: row => dateFormate(row.date),
      sortable: true,
      cell: row => row.date,
      width: '150px',
    },
  ];

  const tableData = data?.map(row => ({
    id: row.id,
    notifications: notificationInfo(row),
    title: row.title,
    creator: surnameFormatter(row.creator),
    description: row.description,
    from: chekFrom(row),
    room_type_name: row.room_type_name,
    status: statusInfo(row),
    statusValue: row.status,
    date: new Date(row.created_at).toLocaleString(),
    roomType: row.room_type,
  }));

  useEffect(() => {
    const getCategory = async () => {
      try {
        const res = await getData(links.roomType(), axiosInstance);
        const option = res.map(el => ({
          value: el.id,
          label: el.name,
        }));
        setRoomsType(option);
      } catch (error) {
        console.log(error);
      }
    };
    getCategory();
  }, []);
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <Table
          columns={columns}
          data={tableData}
          // title={!search || search === '?mode=created' ? 'Обмен документами, исходящие' : 'Обмен документами, входящие'}
          title={`Обмен документами, ${title}`}
          selectableRows={false}
          sortingOptions={roomsType}
          selectedType={selectedType}
          onChangeSortingOptions={setSelected}
          dateFilter
          selectionkey="roomType"
          firstOptionTitle="Все категории"
        />
      </motion.div>
    </AnimatePresence>
  );
};
