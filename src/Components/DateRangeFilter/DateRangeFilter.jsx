import React from 'react';
import { Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { ru } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

import styles from './DateRangeFilter.module.scss';

export const DateRangeFilter = ({ onFilter, startDate, setStartDate, endDate, setEndDate, close, onFilterResetClick }) => {
  const resetFilter = () => {
    setStartDate(null);
    setEndDate(null);
    onFilterResetClick();
  };

  return (
    <div className={styles.DateRangeFilter}>
      <div className={styles.inputWrapper}>
        <div>
          <DatePicker
            className={styles.inputEl}
            selected={startDate}
            onChange={date => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="dd.MM.yy"
            locale={ru}
            placeholderText="Начало"
          />
        </div>
        <div>
          <DatePicker
            className={styles.inputEl}
            selected={endDate}
            onChange={date => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat="dd.MM.yy"
            locale={ru}
            placeholderText="Конец"
          />
        </div>
      </div>

      <div className={styles.btnWrapper}>
        <Button
          variant="outline-success"
          size="sm"
          className="rounded"
          onClick={() => {
            onFilter();
            close();
          }}
          disabled={!startDate || !endDate}
        >
          Применить
        </Button>
        <Button variant="outline-danger" size="sm" className="rounded" onClick={resetFilter}>
          Сбросить
        </Button>
      </div>
    </div>
  );
};
