import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { BsCheck2Circle } from 'react-icons/bs';
import { IoMdTimer } from 'react-icons/io';
import { Link } from 'react-router-dom';

import { Table } from '../Table/Table';

export const PaymentList = ({ data, title }) => {
  const statusCheck = status => {
    return status ? (
      <BsCheck2Circle title="Заявка согласована" size={20} style={{ color: 'green' }} />
    ) : (
      <IoMdTimer title="Ожидает согласования" size={20} style={{ color: 'red' }} />
    );
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

    { name: 'Кому', selector: row => row.beneficiary, sortable: true },
    { name: 'Банк', selector: row => row.bank, sortable: true },
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
    { name: 'Дата создания', selector: row => dateFormate(row.date), cell: row => row.date, sortable: true },
    {
      name: 'Одобрено руководителем',
      selector: row => row.signed,
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
  const tableData = data?.map(row => ({
    id: row.id,
    number: row.id,
    title: row.payer_name,
    beneficiary: row.beneficiary,
    bank: row.bank,
    amount: row.amount,
    date: new Date(row.created_at).toLocaleString(),
    signed: statusCheck(row.users_signed),
    ceo: statusCheck(row.is_ceo_signed),
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
