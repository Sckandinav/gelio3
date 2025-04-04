import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { BsCheck2Circle } from 'react-icons/bs';
import { IoMdTimer } from 'react-icons/io';
import { Link } from 'react-router-dom';

import { Table } from '../Table/Table';

export const PaymentList = ({ data, title }) => {
  const statusCheck = (status, titleDone = 'Заявка согласована', titlePending = 'Ожидает согласования') => {
    return status ? (
      <BsCheck2Circle title={titleDone} size={20} style={{ color: 'green' }} />
    ) : (
      <IoMdTimer title={titlePending} size={20} style={{ color: 'red' }} />
    );
  };

  const dateFormate = dateStr => {
    const [datePart, timePart] = dateStr.split(', ');
    const [day, month, year] = datePart.split('.');
    const [hours, minutes, seconds] = timePart.split(':');
    const date = new Date(year, month - 1, day, hours, minutes, seconds);
    return date.getTime();
  };

  const nameFormate = str => {
    if (str) {
      const [surname, name, patronymic] = str?.split(' ');
      return `${surname} ${name[0]}.${patronymic[0]}.`;
    }
  };

  const columns = [
    {
      name: '',
      selector: row => row.id,
      omit: true,
    },
    {
      name: '№ заявки',
      selector: row => row.number,
      sortable: true,
      width: '90px',
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    {
      name: 'Наименование плательщика',
      selector: row => row.title,
      sortable: true,
      cell: row => <Link to={`/payment/${row.id}`}>{row.title}</Link>,
    },
    { name: 'Банк плательщика', selector: row => row.bank_from, sortable: true },

    { name: 'Кому', selector: row => row.beneficiary, sortable: true },
    { name: 'Банк получателя', selector: row => row.bank_to, sortable: true },
    {
      name: 'Сумма',
      selector: row => row.amount,
      sortable: true,
      cell: row =>
        (+row.amount).toLocaleString('ru-RU', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
    { name: 'Создатель', selector: row => nameFormate(row.creator), sortable: true },
    { name: 'Дата создания', selector: row => dateFormate(row.date), cell: row => row.date, sortable: true },
    {
      name: 'Одобрено руководителем',
      selector: row => row.signed,
      width: '150px',
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    {
      name: 'Одобрена генеральным директором',
      selector: row => row.ceo,
      width: '130px',
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    {
      name: 'Статус платежа',
      selector: row => row.paymentStatus,
      width: '100px',
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
  ];
  const tableData = data?.map(row => ({
    id: row.id,
    number: row.id,
    title: row.payer_name,
    bank_from: row.bank_from?.name,
    beneficiary: row.beneficiary,
    bank_to: row.bank_to?.name,
    amount: row.amount,
    creator: row.creator.full_name,
    date: new Date(row.created_at).toLocaleString(),
    signed: statusCheck(row.users_signed),
    ceo: statusCheck(row.is_ceo_signed),
    paymentStatus: statusCheck(row.is_done),
  }));

  return (
    <Row>
      <Col>
        <h3>{title}</h3>
        <Table columns={columns} data={tableData} selectableRows={false} dateFilter={true} />
      </Col>
    </Row>
  );
};
