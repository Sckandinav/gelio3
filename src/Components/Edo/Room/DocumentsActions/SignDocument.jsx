import React from 'react';
import { useDispatch } from 'react-redux';
import { roomLinks } from '../../../../routes/routes.js';
import { showSuccess, showError } from '../../../../store/slices/toast.js';
import { useAxiosInterceptor } from '../../../hoc/useAxiosInterceptor';
import { Confirm } from '../../../Confirm/Confirm.jsx';

export const SignDocument = ({ show, close, updateRoom, document, actionsIDHandler }) => {
  const dispatch = useDispatch();
  const axiosInstance = useAxiosInterceptor();

  const sign = async () => {
    const token = localStorage.getItem('token');

    try {
      await axiosInstance.post(
        roomLinks.signDoc(document.id),
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        },
      );

      dispatch(showSuccess('Документ подписан'));
      updateRoom();
      actionsIDHandler();
    } catch (err) {
      dispatch(showError('Не удалось подписать документ'));
      console.log(err);
    }
  };

  return <Confirm onCancel={close} show={show} onConfirm={() => sign()} />;
};
