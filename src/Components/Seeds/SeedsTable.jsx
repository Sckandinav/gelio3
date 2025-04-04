import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button, Form, Row, Col } from 'react-bootstrap';

const paginationOptions = {
  rowsPerPageText: 'Строк на странице:',
  rangeSeparatorText: 'из',
  noRowsPerPage: false,
  selectAllRowsItem: false,
  selectAllRowsItemText: 'Все',
};

export const SeedsTable = ({ columns, data, addBtnClick, deleteBtnClick, handleSelectedRowsChange, selectedRows, isAddBtn = false }) => {
  const [searchText, setSearchText] = useState('');
  const filteredData = data.filter(item => {
    return Object.keys(item).some(key => item[key]?.toString().toLowerCase()?.includes(searchText.toLowerCase()));
  });
  return (
    <>
      <Row className="mb-3 ">
        <Col>
          <Form>
            <Form.Group>
              <Form.Label>
                <Form.Control value={searchText} onChange={e => setSearchText(e.target.value)} type="search" placeholder="Поиск ..."></Form.Control>
              </Form.Label>
            </Form.Group>
          </Form>
        </Col>

        <Col className="text-end">
          {isAddBtn && (
            <Button className="me-3" variant="outline-success" size="sm" onClick={addBtnClick}>
              Добавить
            </Button>
          )}
          <Button variant="outline-danger" size="sm" disabled={selectedRows?.length === 0} onClick={deleteBtnClick}>
            Удалить
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <DataTable
            columns={columns}
            data={filteredData}
            noDataComponent="Данные отсутствуют"
            paginationComponentOptions={paginationOptions}
            selectableRows={true}
            pagination
            onSelectedRowsChange={handleSelectedRowsChange}
          />
        </Col>
      </Row>
    </>
  );
};
