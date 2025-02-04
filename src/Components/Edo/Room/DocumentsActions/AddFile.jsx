import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

import { showSuccess, showError } from '../../../../store/slices/toast.js';
import { axiosInstance } from '../../../hoc/AxiosInstance.js';
import { roomLinks } from '../../../../routes/routes.js';
import styles from './AddFile.module.scss';

export const AddFile = ({ closePopup, updateRoom }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { id } = useParams();
  const dispatch = useDispatch();

  const sendFile = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('name', selectedFile.name);
    const token = localStorage.getItem('token');
    const axInst = axiosInstance;

    try {
      await axInst.post(roomLinks.addFile(id), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${token}`,
        },
      });

      dispatch(showSuccess('Файл добавлен'));
      closePopup();
      updateRoom();
    } catch (error) {
      console.log(error);
      dispatch(showError('Не удалось добавить файл'));
    }
  };

  const handleFileChange = event => {
    setSelectedFile(event.target.files[0]);
  };
  return (
    <div>
      <form onSubmit={sendFile}>
        <Col className={`${styles.fileUpload} mb-4`}>
          <label className={styles.label}>
            <input type="file" className={styles.customFileInput} onChange={handleFileChange} />
            <span className={styles.customFileButton}>Выберите файл</span>
          </label>
          <span className={styles.fileName} title={selectedFile ? selectedFile.name : ''}>
            {selectedFile ? selectedFile.name : 'Файл не выбран'}
          </span>
        </Col>

        <Button disabled={!selectedFile} type="submit" variant="success">
          Добавить
        </Button>
      </form>
    </div>
  );
};
