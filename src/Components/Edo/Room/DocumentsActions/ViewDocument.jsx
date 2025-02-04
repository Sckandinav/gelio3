import React from 'react';
import { useDispatch } from 'react-redux';
import { roomLinks } from '../../../../routes/routes.js';
import { showSuccess, showError } from '../../../../store/slices/toast.js';
import { axiosInstance } from '../../../hoc/AxiosInstance.js';
import { Confirm } from '../../../Confirm/Confirm.jsx';

export const ViewDocument = ({ show, close, updateRoom, document, actionsIDHandler }) => {
  const dispatch = useDispatch();

  const view = async () => {
    const token = localStorage.getItem('token');
    const axInst = axiosInstance;

    try {
      await axInst.post(
        roomLinks.viewDoc(document.id),
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        },
      );

      dispatch(showSuccess('Документ просмотрен'));
      updateRoom();
      actionsIDHandler();
    } catch (error) {
      dispatch(showError('Не удалось подтвердить просмотр'));
      console.log(error);
    }
  };
  return (
    <div>
      <Confirm onCancel={close} show={show} onConfirm={() => view()} text="Подтверждаете просмотр?" />
    </div>
  );
};
