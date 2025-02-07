import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Table, Form } from 'react-bootstrap';

import { FaEdit, FaRegSave } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';

import { MdOutlineCancel } from 'react-icons/md';

import { InputElem } from './InputElem';

export const Create = () => {
  const usersIdInRoom = [];
  const [appData, setAppData] = useState([]);
  const [agloList, setAgloList] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [btnState, setBtnState] = useState({
    addPosition: false,
  });



  const btnToggle = key => {
    setBtnState(prev => ({ ...prev, [key]: !prev[key] }));
  };
  const updateTable = data => {
    const newRow = {
      id: Date.now(),
      title: data.title,
      priceWithVAT: data.priceWithVAT,
      priceWithoutVAT: data.priceWithoutVAT,
      date: data.date,
      comment: data.comment,
      files: data.files,
    };

    setAppData(prev => [...prev, newRow]);
  };

  const formatPrice = price => {
    return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(price);
  };

  const saveRow = id => {
    setAppData(prev => prev.map(row => (row.id === id ? { ...row, ...editedRow } : row)));
    setEditingRowId(null);
  };

  const cancelEdit = () => {
    setEditingRowId(null);
    setEditedRow({});
  };

  const removeRow = id => {
    setAppData(prev => prev.filter(el => el.id !== id));
  };

  const editRow = id => {
    const rowToEdit = appData.find(row => row.id === id);
    setEditingRowId(id);
    setEditedRow(rowToEdit);
  };

  return (
    <Container fluid>
      <Row>
        <Col className="w100">
          <Table variant="outline-dark" bordered responsive style={{ tableLayout: 'fixed' }} className="align-middle" size="lg">
            <thead>
              <tr>
                <th title="Наименование статьи расходов" rowSpan="2" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Наименование статьи расходов
                </th>
                <th style={{ overflow: 'hidden', textOverflow: 'ellipsis' }} colSpan="2">
                  Сумма, требующая к перечислению
                </th>
                <th style={{ overflow: 'hidden', textOverflow: 'ellipsis' }} rowSpan="2">
                  Сроки исполнения
                </th>
                <th style={{ overflow: 'hidden', textOverflow: 'ellipsis' }} rowSpan="2">
                  Комментарий
                </th>
                <th style={{ overflow: 'hidden', textOverflow: 'ellipsis' }} rowSpan="2">
                  Файлы
                </th>
                <th style={{ overflow: 'hidden', textOverflow: 'ellipsis' }} rowSpan="2">
                  Действия
                </th>
              </tr>
              <tr>
                <th>с НДС</th>
                <th>без НДС</th>
              </tr>
            </thead>
            <tbody>
              {appData.length > 0 ? (
                appData.map(row => (
                  <tr key={row.id}>
                    {editingRowId === row.id ? (
                      <>
                        <td>{row.title.name}</td>
                        <td>
                          <Form.Label htmlFor="priceWithVAT">
                            <Form.Control
                              id="priceWithVAT"
                              type="number"
                              value={editedRow.priceWithVAT}
                              onChange={e => setEditedRow({ ...editedRow, priceWithVAT: e.target.value })}
                            />
                          </Form.Label>
                        </td>
                        <td>
                          <Form.Label htmlFor="priceWithoutVAT">
                            <Form.Control
                              id="priceWithoutVAT"
                              type="number"
                              value={editedRow.priceWithoutVAT}
                              onChange={e => setEditedRow({ ...editedRow, priceWithoutVAT: e.target.value })}
                            />
                          </Form.Label>
                        </td>
                        <td>
                          <Form.Label htmlFor="dateInput">
                            <Form.Control
                              id="dateInput"
                              type="date"
                              value={editedRow.date}
                              onChange={e => setEditedRow({ ...editedRow, date: e.target.value })}
                            />
                          </Form.Label>
                        </td>
                        <td>
                          <Form.Label htmlFor="comment">
                            <Form.Control
                              id="comment"
                              type="text"
                              value={editedRow.comment}
                              onChange={e => setEditedRow({ ...editedRow, comment: e.target.value })}
                            />
                          </Form.Label>
                        </td>
                        <td>
                          {row.files.map(el => (
                            <span title={el.name} key={el.lastModified + el.size}>
                              {el.name}
                            </span>
                          ))}
                        </td>
                        <td>
                          <div className="d-flex justify-content-around">
                            <Button title="Сохранить изменения" variant="outline-success" className="p-1 border-0" onClick={() => saveRow(row.id)}>
                              <FaRegSave size={25} />
                            </Button>
                            <Button title="Отменить действия" variant="outline-danger" className="p-1 border-0" onClick={cancelEdit}>
                              <MdOutlineCancel size={25} />
                            </Button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.title.name}</td>
                        <td>{formatPrice(row.priceWithVAT)}</td>
                        <td>{formatPrice(row.priceWithoutVAT)}</td>
                        <td>{new Date(row.date).toLocaleDateString()}</td>
                        <td style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.comment}</td>
                        <td>
                          {row.files.map(el => (
                            <div
                              title={el.name}
                              key={el.lastModified + el.size}
                              className="mb-1"
                              style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                            >
                              {el.name}
                            </div>
                          ))}
                        </td>
                        <td>
                          <div className="d-flex justify-content-around">
                            <Button title="Внести правки" variant="outline-success" className="p-1 border-0" onClick={() => editRow(row.id)}>
                              <FaEdit size={25} />
                            </Button>

                            <Button title="Удалить строку" variant="outline-danger" className="p-1 border-0" onClick={() => removeRow(row.id)}>
                              <MdDeleteForever size={25} />
                            </Button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">Нет данных</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col className="mb-3 d-flex column-gap-3 flex-wrap">
          <Button
            size="sm"
            className="rounded"
            variant="outline-success"
            onClick={() => btnToggle('addPosition')}
            aria-expanded={btnState.addPosition}
          >
            Добавить позицию
          </Button>
          <Button size="sm" className="rounded" variant="outline-success">
            Добавить согласующего
          </Button>
          <Button size="sm" className="rounded" variant="outline-success">
            Список согласующих
          </Button>
          <Button size="sm" className="rounded" variant="outline-success">
            Отправить
          </Button>
        </Col>
      </Row>
      {btnState.addPosition && (
        <Row>
          <Col>
            <InputElem close={() => btnToggle('addPosition')} addRow={updateTable} />
          </Col>
        </Row>
      )}
    </Container>
  );
};
