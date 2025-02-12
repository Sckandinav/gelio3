import React from 'react';
import { FaExclamation } from 'react-icons/fa';
import { BsCheck2Circle } from 'react-icons/bs';
import { IoMdTimer } from 'react-icons/io';
import { useSelector } from 'react-redux';

import { Table } from '../../Table/Table';
import { userSelectors } from '../../../store/selectors/userSelectors';

// mc = Managing Сompany - управляющая компания

export const ApplicationsList = ({ data, title }) => {
  const currentUsersGroup = useSelector(userSelectors).data.user.groups_names;

  const notificationCheck = row => {
    if (row.approved_by_ceo) {
      return null;
    }
    if (currentUsersGroup.includes('Заявки')) {
      if (row.notifications.lacks_assigned_item_approvers || row.notifications.lacks_assigned_ceo) {
        <FaExclamation title="Все действия выполнили" size={20} style={{ color: 'red' }} />;
      }
      return <BsCheck2Circle title="Выполнили действия" size={20} style={{ color: 'green' }} />;
    }
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
      name: 'Статус назначения',
      selector: row => row.appointment,
      maxWidth: '150px',
    },
    {
      name: 'Предприятие',
      selector: row => row.title,
      sortable: true,
    },
    {
      name: 'Создал',
      selector: row => row.creator,
      sortable: true,
    },
    {
      name: 'Дата создания',
      selector: row => row.date,
      sortable: true,
    },
    {
      name: `Одобрена агропредприятием`,
      selector: row => row.agro,
      maxWidth: '200px',
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    {
      name: 'Одобрена УК',
      selector: row => row.mc,
      maxWidth: '200px',
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    {
      name: 'Одобрена генеральным директором',
      selector: row => row.ceo,
      maxWidth: '200px',
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
  ];

  const tableData = data.map(row => ({
    id: row.id,
    appointment: notificationCheck(row),
    title: row.agro,
    creator: row.creator_name,
    date: `${new Date(row.created_at).toLocaleString()}`,
    agro: statusCheck(row.fully_approved_by_users),
    mc: statusCheck(row.fully_approved_by_items),
    ceo: statusCheck(row.approved_by_ceo),
  }));

  return (
    <div>
      <h2>{title}</h2>
      <Table selectableRows={false} columns={columns} data={tableData} />
    </div>
  );
};
