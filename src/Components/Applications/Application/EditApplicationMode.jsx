import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Form, ListGroup, CloseButton } from 'react-bootstrap';
import Select from 'react-select';

import { useAxiosInterceptor } from '../../hoc/useAxiosInterceptor';
import { useUserToken } from '../../hoc/useUserToken';
import { applicationUrl } from '../../../routes/routes.js';
import { getData } from '../../../api/getData.js';

export const EditApplicationMode = ({ data, appID, update, close }) => {
  const [state, setState] = useState(data);
  const [expenses, setExpenses] = useState([]);
  const [newRows, setNewRows] = useState([]);

  const token = useUserToken();
  const axiosInstance = useAxiosInterceptor();

  const inputHandler = (index, key, value) => {
    setState(prev => ({
      ...prev,
      items: prev.items.map(row => (row.id === index ? { ...row, [key]: value } : row)),
    }));
  };

  const newInputHandler = (index, key, value) => {
    setNewRows(prev => prev.map(row => (row.frontID === index ? { ...row, [key]: value } : row)));
  };

  const deleteFile = (rowID, fileID) => {
    setState(prev => ({
      ...prev,
      items: prev.items.map(row => {
        if (row.id === rowID) {
          return {
            ...row,
            files: row.files.filter(file => file.id !== fileID),
            files_id: row.files_id.filter(el => el !== fileID),
          };
        }
        return row;
      }),
    }));
  };

  const deleteFileOnNewRow = (rowID, fileID) => {
    setNewRows(prev =>
      prev.map(row =>
        row.frontID === rowID
          ? { ...row, files: row.files.filter(file => file.id !== fileID), files_id: row.files_id.filter(el => el !== fileID) }
          : row,
      ),
    );
  };

  const addFile = (rowID, event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      file_name: file.name,
      file: file,
      uploaded_at: new Date().toISOString(),
      application_item: rowID,
    }));

    const newID = newFiles.map(el => el.id);

    setState(prev => ({
      ...prev,
      items: prev.items.map(row => {
        if (row.id === rowID) {
          return {
            ...row,
            files: [...row.files, ...newFiles],
            files_id: [...row.files_id, ...newID],
          };
        }
        return row;
      }),
    }));
  };

  const addFileOnNewRow = (rowID, event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      file_name: file.name,
      file: file,
      uploaded_at: new Date().toISOString(),
      application_item: rowID,
    }));

    const newID = newFiles.map(el => el.id);

    setNewRows(prev =>
      prev.map(row => (row.frontID === rowID ? { ...row, files: [...row.files, ...newFiles], files_id: [...row.files_id, ...newID] } : row)),
    );
  };

  const optionFormatter = option => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        width: '100%',
        opacity: '1',
        visibility: 'visibility',
        fontSize: '16px',
        color: '#000',
        gap: '10px',
        alignItems: 'center',
      }}
    >
      <span>{option.label}</span>
      {option?.category && <span style={{ fontStyle: 'italic', color: '#000', fontSize: '12px' }}>{option.category}</span>}
    </div>
  );

  const onSelect = (rowID, selectedOption) => {
    const selectedObj = expenses.find(item => item.id === selectedOption.value);
    setNewRows(prev =>
      prev.map(row =>
        row.frontID === rowID
          ? {
              ...row,
              cost_item: selectedObj.id,
              cost_item_name: selectedObj.name,
              cost_item_group: selectedObj.cost_item_group.id,
              cost_item_group_name: selectedObj.cost_item_group.name,
            }
          : row,
      ),
    );
  };

  const getExpenses = async () => {
    try {
      const res = await getData(applicationUrl.expensesUrl(), axiosInstance);

      setExpenses(res);
    } catch (error) {
      console.log(error);
    }
  };

  const mergeRows = () => {
    const prepare = newRows
      .filter(row => row.amount_with_nds !== '' || row.cost_item_name !== '' || row.date_end !== '')
      .map(({ frontID, ...rest }) => rest);
    return { ...state, items: [...state.items, ...prepare] };
  };

  const updateApplication = async e => {
    e.preventDefault();
    const updateDate = mergeRows();
    const formData = new FormData();
    formData.append('agro', updateDate.agro);
    formData.append('agroid', updateDate.agroid);
    formData.append('approved_by_ceo', updateDate.approved_by_ceo);
    formData.append('ceo_data', updateDate.ceo_data);
    formData.append('created_at', updateDate.created_at);
    formData.append('creator', updateDate.creator);
    formData.append('creator_id', updateDate.creator_id);
    formData.append('id', updateDate.id);
    formData.append('item_approvals_history', updateDate.item_approvals_history);
    formData.append('items', JSON.stringify(updateDate.items.map(({ files, ...rest }) => rest)));
    formData.append('managers_approvals', updateDate.managers_approvals);
    formData.append('user_approvals', JSON.stringify(updateDate.user_approvals));

    updateDate.items.forEach(row => {
      if (row.files.length === 0) {
        return;
      }
      row.files.forEach(file => {
        formData.append(`files[${file.id}]`, file.file);
      });
    });

    try {
      await axiosInstance.post(applicationUrl.editApplication(appID), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${token}`,
        },
      });
      close();
      update();
      setNewRows([]);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteRow = id => {
    setState(prev => ({
      ...prev,
      items: prev.items.map(row => {
        return row.id === id ? { ...row, is_delete: true } : row;
      }),
    }));
  };

  const deleteNewRow = id => {
    setNewRows(prev =>
      prev.map(row => {
        return row.frontID === id ? { ...row, is_delete: true } : row;
      }),
    );
  };

  const createNewRow = () => {
    const newRow = {
      id: null,
      cost_item_name: '',
      cost_item_group: '',
      cost_item_group_name: '',
      item_approvals: [],
      files: [],
      files_id: [],
      amount_with_nds: '',
      date_end: '',
      comment: '',
      need_approve: true,
      application: appID,
      cost_item: '',
      frontID: Date.now(),
    };

    setNewRows(prev => [...prev, newRow]);
  };

  useEffect(() => {
    getExpenses();
  }, []);

  return (
    <div>
      <Form onSubmit={updateApplication}>
        {state.items
          .filter(row => !row.hasOwnProperty('is_delete'))
          .map(row => {
            return (
              <Form.Group key={row.id} as={Row} className="border border-primary-subtle align-items-end mb-3 p-2">
                <Col lg={2}>
                  <Form.Label htmlFor="cost_item_name">Наименование статьи затрат</Form.Label>
                  <Form.Control
                    id="cost_item_name"
                    type="text"
                    value={row.cost_item_name}
                    disabled
                    onChange={e => inputHandler(row.id, 'cost_item_name', e.target.value)}
                  />
                </Col>

                <Col lg={2}>
                  <Form.Label htmlFor="amount_with_nds">Сумма, требуемая к перечислению, (руб) c НДС</Form.Label>
                  <Form.Control
                    id="amount_with_nds"
                    type="number"
                    value={row.amount_with_nds}
                    onChange={e => inputHandler(row.id, 'amount_with_nds', e.target.value)}
                    required
                    min={1}
                  />
                </Col>

                <Col xl={1} lg={2}>
                  <Form.Label htmlFor="date_end">Сроки исполнения</Form.Label>
                  <Form.Control id="date_end" type="date" value={row.date_end} onChange={e => inputHandler(row.id, 'date_end', e.target.value)} />
                </Col>

                <Col lg={2}>
                  <Form.Label htmlFor="comment">Комментарий</Form.Label>
                  <Form.Control
                    id="comment"
                    as="textarea"
                    value={row.comment}
                    style={{ resize: 'none', height: '38px' }}
                    onChange={e => inputHandler(row.id, 'comment', e.target.value)}
                  />
                </Col>

                <Col lg={2}>
                  <Form.Label>Файлы</Form.Label>
                  <Form.Text>
                    <ListGroup>
                      {row?.files?.map(file => (
                        <ListGroup.Item key={`${row.id}${file.id}`} className="d-flex justify-content-between align-items-center">
                          <span style={{ overflow: 'hidden', wordWrap: 'normal', textOverflow: 'ellipsis' }} title={file.file_name}>
                            {file.file_name}
                          </span>
                          <CloseButton onClick={() => deleteFile(row.id, file.id)} />
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Form.Text>
                </Col>

                <Col lg={1}>
                  <Form.Label>Добавить файл</Form.Label>
                  <Form.Control type="file" multiple onChange={e => addFile(row.id, e)} />
                </Col>
                <Col lg={1}>
                  <Button type="button" size="sm" variant="outline-danger" onClick={() => deleteRow(row.id)}>
                    Удалить
                  </Button>
                </Col>
              </Form.Group>
            );
          })}

        {newRows &&
          newRows
            ?.filter(row => !row.hasOwnProperty('is_delete'))
            .map(row => {
              return (
                <Form.Group key={row.frontID} as={Row} className="border border-success-subtle align-items-end mb-3 p-2">
                  <Col xl={2}>
                    <Select
                      options={expenses.map(el => ({
                        value: el.id,
                        label: el.name,
                        category: el.cost_item_group.name,
                      }))}
                      placeholder="Выберите позицию"
                      formatOptionLabel={optionFormatter}
                      onChange={e => onSelect(row.frontID, e)}
                    />
                  </Col>

                  <Col xl={2}>
                    <Form.Label htmlFor="amount_with_nds">Сумма, требуемая к перечислению, (руб)</Form.Label>
                    <Form.Control
                      id={`${row.frontID}amount_with_nds`}
                      type="number"
                      value={row.amount_with_nds}
                      onChange={e => newInputHandler(row.frontID, 'amount_with_nds', e.target.value)}
                      required
                      min={1}
                    />
                  </Col>

                  <Col xl={1}>
                    <Form.Label htmlFor={`${row.frontID}date_end`}>Сроки исполнения</Form.Label>
                    <Form.Control
                      id={`${row.frontID}date_end`}
                      type="date"
                      value={row.date_end}
                      onChange={e => newInputHandler(row.frontID, 'date_end', e.target.value)}
                      required
                    />
                  </Col>

                  <Col xl={2}>
                    <Form.Label htmlFor={`${row.frontID}comment`}>Комментарий</Form.Label>
                    <Form.Control
                      id={`${row.frontID}comment`}
                      as="textarea"
                      value={row.comment}
                      style={{ resize: 'none', height: '38px' }}
                      onChange={e => newInputHandler(row.frontID, 'comment', e.target.value)}
                    />
                  </Col>

                  <Col xl={2}>
                    <Form.Label>Файлы</Form.Label>
                    <Form.Text>
                      <ListGroup>
                        {row?.files?.map(file => (
                          <ListGroup.Item key={`${row.frontID}${file.id}`} className="d-flex justify-content-between align-items-center">
                            <span style={{ overflow: 'hidden', wordWrap: 'normal', textOverflow: 'ellipsis' }} title={file.file_name}>
                              {file.file_name}
                            </span>
                            <CloseButton onClick={() => deleteFileOnNewRow(row.frontID, file.id)} />
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Form.Text>
                  </Col>

                  <Col xl={1}>
                    <Form.Label>Добавить файл</Form.Label>
                    <Form.Control type="file" multiple onChange={e => addFileOnNewRow(row.frontID, e)} />
                  </Col>
                  <Col xl={1}>
                    <Button type="button" size="sm" variant="outline-danger" onClick={() => deleteNewRow(row.frontID)}>
                      Удалить
                    </Button>
                  </Col>
                </Form.Group>
              );
            })}
        <div className="d-flex align-items-center mb-2">
          <Button size="sm" variant="outline-danger" onClick={close}>
            Отменить
          </Button>
          <Button size="sm" variant="outline-secondary" className="mx-2" onClick={createNewRow} type="button">
            Добавить строку
          </Button>
          <Col className="flex-grow-1 text-end">
            <Button size="sm" type="submit" variant="outline-success">
              Сохранить
            </Button>
          </Col>
        </div>
      </Form>
    </div>
  );
};
