import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { CloseButton, ListGroup } from 'react-bootstrap';
import styles from './Select.module.scss';

export const SelectComponent = ({ data, placeholder = 'Выберите пользователей', multiSelection = true, selected, selectHandler, deleteHandler }) => {
  const [initialList, setInitialList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const updateListOnAdd = selectedOption => {
    if (multiSelection === true) {
      setSelectedUser(selectedUser);
      setInitialList(prev => prev.filter(item => item.value !== selectedOption.value));
      setSelectedUser(null);
    } else {
      setSelectedUser(selectedOption);
    }
  };

  const updateListonRemove = selectedOption => {
    setInitialList(prev => [...prev, selectedOption]);
  };

  const formatOptionLabel = option => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        width: '100%',
        opacity: '1',
        visibility: 'visibility',
        fontSize: '16px',
        color: 'var(--dark)',
        gap: '10px',
        alignItems: 'center',
      }}
    >
      <span>{option.label}</span>
      {option.post && (
        <span style={{ fontStyle: 'italic', color: 'var(--text)', fontSize: '12px' }}>
          {option.companyName}, {option.post}
        </span>
      )}
    </div>
  );

  useEffect(() => {
    setInitialList(data);
  }, [data]);
  return (
    <>
      <Select
        options={initialList}
        value={selectedUser}
        placeholder={placeholder}
        formatOptionLabel={formatOptionLabel}
        onChange={e => {
          selectHandler('members', e);
          updateListOnAdd(e);
        }}
      />

      {multiSelection && selected.length > 0 && (
        <div className={`mt-3  ${styles.listBlock}`}>
          <ListGroup>
            {selected.map(user => (
              <ListGroup.Item className="d-flex justify-content-between align-items-center" key={user.value}>
                {user.label}
                <CloseButton
                  onClick={() => {
                    deleteHandler('members', user);
                    updateListonRemove(user);
                  }}
                />
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}
    </>
  );
};
