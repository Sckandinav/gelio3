import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaExclamation } from 'react-icons/fa';
import { BsCheck2Circle } from 'react-icons/bs';
import { IoMdTimer } from 'react-icons/io';
import { useSelector } from 'react-redux';

import { Table } from '../../Table/Table';
import { userSelectors } from '../../../store/selectors/userSelectors';

// mc = Managing Сompany - управляющая компания

export const ApplicationsList = ({ data, title, company }) => {
  const currentUsersGroup = useSelector(userSelectors).data.user.groups_names;
  const [selectedType, setSelectedType] = useState('');

  const setSelected = e => {
    setSelectedType(e.target.value);
  };

  const dateFormate = dateStr => {
    const [datePart, timePart] = dateStr.split(', ');
    const [day, month, year] = datePart.split('.');
    const [hours, minutes, seconds] = timePart.split(':');
    const date = new Date(year, month - 1, day, hours, minutes, seconds);
    return date.getTime();
  };

  const notificationCheck = row => {
    if (row.approved_by_ceo) {
      return null;
    }

    return row.notification ? (
      <FaExclamation title="Необходимо выполнить действие" size={20} style={{ color: 'red' }} />
    ) : (
      <BsCheck2Circle title="Выполнили действия" size={20} style={{ color: 'green' }} />
    );
  };

  const statusCheck = value => {
    return value ? (
      <BsCheck2Circle title="Заявка согласована" size={20} style={{ color: 'green' }} />
    ) : (
      <IoMdTimer title="Ожидает согласования" size={20} style={{ color: 'red' }} />
    );
  };

  const columns = [
    {
      name: '',
      selector: row => row.id,
      omit: true,
    },
    {
      name: '№',
      selector: row => row.number,
      width: '80px',
      sortable: true,
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    {
      name: 'Статус',
      selector: row => row.appointment,
      width: '80px',
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    {
      name: 'Предприятие',
      selector: row => row.title,
      sortable: true,
      cell: row => <Link to={`/application/${row.id}`}>{row.title}</Link>,
    },
    {
      name: 'Создал',
      selector: row => row.creator,
      sortable: true,
    },
    {
      name: 'Дата создания',
      selector: row => dateFormate(row.date),
      sortable: true,
      cell: row => row.date,
    },
    {
      name: `Одобрена агропредприятием`,
      selector: row => row.agro,
      width: '200px',
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    {
      name: 'Одобрена УК',
      selector: row => row.mc,
      width: '200px',
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    {
      name: 'Одобрена генеральным директором',
      selector: row => row.ceo,
      width: '200px',
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
  ];

  const tableData = data.map(row => ({
    id: row.id,
    number: row.id,
    appointment: notificationCheck(row),
    title: row.agro,
    creator: row.creator_name,
    date: new Date(row.created_at).toLocaleString(),
    agro: statusCheck(row.fully_approved_by_users),
    mc: statusCheck(row.fully_approved_by_items && row.fully_approved_by_managers),
    ceo: statusCheck(row.approved_by_ceo),
    agroID: row.agroid,
  }));

  return (
    <div>
      <h2>{title}</h2>
      <Table
        selectableRows={false}
        columns={columns}
        data={tableData}
        dateFilter={true}
        sortingOptions={company}
        onChangeSortingOptions={setSelected}
        selectedType={selectedType}
        selectionkey="agroID"
        firstOptionTitle="Все предприятия"
      />
    </div>
  );
};
