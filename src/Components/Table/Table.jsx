import React, { useState, useRef, useEffect } from 'react';
import DataTable, { defaultThemes } from 'react-data-table-component';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Form } from 'react-bootstrap';

import { setCurrentPage, setRowsPerPage } from '../../store/slices/utils.js';
import { utilsSelector } from '../../store/selectors/utilsSelector.js';
import { DateRangeFilter } from '../DateRangeFilter/DateRangeFilter.jsx';
import './styles.css';

export const Table = ({
  title = '',
  selectableRows = true,
  data,
  columns,
  SelectFunc,
  hasSearch = true,
  sortingOptions,
  onChangeSortingOptions,
  selectedType,
  dateFilter = false,
}) => {
  const [searchText, setSearchText] = useState('');
  const [showDate, setShowDate] = useState(false);
  const dateRef = useRef(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [appliedStartDate, setAppliedStartDate] = useState(null);
  const [appliedEndDate, setAppliedEndDate] = useState(null);

  const { rowsPerPage, currentPage } = useSelector(utilsSelector).pagination;
  const dispatch = useDispatch();

  const dateToggle = () => {
    setShowDate(prev => !prev);
  };

  const paginationOptions = {
    rowsPerPageText: 'Строк на странице:',
    rangeSeparatorText: 'из',
    noRowsPerPage: false,
    selectAllRowsItem: false,
    selectAllRowsItemText: 'Все',
  };

  const parseCustomDate = dateStr => {
    const [datePart] = dateStr.split(', ');
    const [day, month, year] = datePart.split('.');
    const date = new Date(year, month - 1, day);
    date.setHours(0, 0, 0, 0);
    const milliseconds = date.getTime();
    return milliseconds;
  };

  const handleFilter = () => {
    if (!appliedStartDate || !appliedEndDate) {
      return data;
    }
    const parsedStartDate = new Date(new Date(appliedStartDate).setHours(0, 0, 0, 0));
    const parsedEndDate = new Date(new Date(appliedEndDate).setHours(23, 59, 59, 999));
    const res = data.filter(row => parseCustomDate(row.date) >= parsedStartDate && parseCustomDate(row.date) <= parsedEndDate);
    return res;
  };

  const onFilterClick = () => {
    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);
  };
  const onFilterResetClick = () => {
    setAppliedStartDate(null);
    setAppliedEndDate(null);
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
        overflow: 'hidden',
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

  const filteredData = handleFilter()
    .filter(item => {
      if (!selectedType) {
        return item;
      }
      return item.roomType === Number(selectedType);
    })
    .filter(item => {
      return Object.keys(item).some(key => item[key]?.toString().toLowerCase().includes(searchText.toLowerCase()));
    });

  const handlePageChange = page => {
    dispatch(setCurrentPage(page));
  };

  const handlePerRowsChange = (newPerPage, page) => {
    dispatch(setRowsPerPage(newPerPage));
    dispatch(setCurrentPage(page));
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setShowDate(false);
      }
    };

    if (showDate) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDate]);

  return (
    <div>
      <h2>{title}</h2>
      <div className="d-flex column-gap-4  mb-2">
        {hasSearch && (
          <div>
            <label>
              <input className="form-control" type="search" placeholder="Поиск..." value={searchText} onChange={e => setSearchText(e.target.value)} />
            </label>
          </div>
        )}

        {sortingOptions && sortingOptions.length > 0 && (
          <div style={{ width: '200px' }}>
            <Form.Select onChange={onChangeSortingOptions}>
              <option value="">Все категории</option>
              {sortingOptions?.map(el => (
                <option key={el.value} value={el.value}>
                  {el.label}
                </option>
              ))}
            </Form.Select>
          </div>
        )}

        {dateFilter && (
          <div ref={dateRef}>
            <Button variant="outline-secondary" onClick={dateToggle} style={{ width: '130px' }}>
              {showDate ? 'Скрыть даты' : 'Выбрать даты'}
            </Button>
            {showDate && (
              <div>
                <DateRangeFilter
                  onFilter={onFilterClick}
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                  close={dateToggle}
                  onFilterResetClick={onFilterResetClick}
                />
              </div>
            )}
          </div>
        )}
      </div>
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
