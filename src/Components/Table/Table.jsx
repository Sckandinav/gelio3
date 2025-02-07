import React, { useState } from 'react';
import DataTable, { defaultThemes } from 'react-data-table-component';
import { useSelector, useDispatch } from 'react-redux';

import { setCurrentPage, setRowsPerPage } from '../../store/slices/utils.js';
import { utilsSelector } from '../../store/selectors/utilsSelector.js';
import './styles.css';

export const Table = ({ title = '', selectableRows = true, data, columns, SelectFunc, hasSearch = true }) => {
  const [searchText, setSearchText] = useState('');

  const { rowsPerPage, currentPage } = useSelector(utilsSelector).pagination;
  const dispatch = useDispatch();

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
        padding: '10px',
      },
    },
    cells: {
      style: {
        fontSize: '16px',
        whiteSpace: 'normal',
        wordWrap: 'break-word',
        padding: '10px',
        '&:not(:last-of-type)': {
          borderRightStyle: 'solid',
          borderRightWidth: '1px',
          borderRightColor: defaultThemes.default.divider.default,
        },
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

  const handlePageChange = page => {
    dispatch(setCurrentPage(page));
  };

  const handlePerRowsChange = (newPerPage, page) => {
    dispatch(setRowsPerPage(newPerPage));
    dispatch(setCurrentPage(page));
  };

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
        paginationPerPage={rowsPerPage}
        paginationDefaultPage={currentPage}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowsChange}
      />
    </div>
  );
};
