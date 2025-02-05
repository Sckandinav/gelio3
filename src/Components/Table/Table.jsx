import React, { useState } from 'react';
import DataTable from 'react-data-table-component';

export const Table = ({ title = '', selectableRows = true, data, columns, SelectFunc, hasSearch = true }) => {
  const [searchText, setSearchText] = useState('');

  const paginationOptions = {
    rowsPerPageText: 'Строк на странице:',
    rangeSeparatorText: 'из',
    noRowsPerPage: false,
    selectAllRowsItem: false,
    selectAllRowsItemText: 'Все',
  };

  const customStyles = {
    rows: {
      style: {
        padding: '10px 0',
      },
    },
    headCells: {
      style: {
        fontSize: '16px',
      },
    },
    cells: {
      style: {
        fontSize: '16px',
      },
    },
  };

  const isRowDisabled = row => {
    const isSigned = row.signers_status?.some(user => user.is_signed === true || user.is_signed === null);
    const isViewed = row.viewers_status?.some(user => user.is_viewed);
    return isSigned || isViewed;
  };

  const filteredData = data.filter(item => {
    return Object.keys(item).some(key => item[key]?.toString().toLowerCase().includes(searchText.toLowerCase()));
  });

  return (
    <div>
      <h2>{title}</h2>
      {hasSearch && (
        <div className="input-group mb-3">
          <label>
            <input className="form-control" type="search" placeholder="Поиск..." value={searchText} onChange={e => setSearchText(e.target.value)} />
          </label>
        </div>
      )}
      <DataTable
        style={{ fontSize: '16px' }}
        columns={columns}
        data={filteredData}
        pagination
        noDataComponent="Данные отсутствуют"
        selectableRows={selectableRows}
        paginationComponentOptions={paginationOptions}
        customStyles={customStyles}
        onSelectedRowsChange={SelectFunc}
        selectableRowDisabled={isRowDisabled}
      />
    </div>
  );
};
