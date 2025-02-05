import React, { useState } from 'react';

import { useDispatch } from 'react-redux';

import { roomLinks } from '../../../../routes/routes.js';
import { showSuccess, showError } from '../../../../store/slices/toast.js';
import { useAxiosInterceptor } from '../../../hoc/useAxiosInterceptor';
import { CheckboxSelection } from '../../../Select/CheckboxSelection.jsx';

export const RemoveViewers = ({ closePopup, updateRoom, document, actionsIDHandler }) => {
  const [chosen, setChosen] = useState([]);
  const dispatch = useDispatch();
  const axiosInstance = useAxiosInterceptor();

  const prepareDataForUpdate = () => {
    return chosen.map(user => ({ viewer: user.label, viewer_id: user.value }));
  };

  const chosenToggle = el => {
    chosen.some(user => user.value === el.value) ? setChosen(prev => prev.filter(user => user.value !== el.value)) : setChosen(prev => [...prev, el]);
  };

  const userWithTaskCompleted = document.viewers_status.reduce((acc, current) => {
    if (current.is_viewed) {
      acc.push(current.signer_id);
    }
    return acc;
  }, []);

  const updateData = async e => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      const dataForSend = prepareDataForUpdate();
      await axiosInstance.post(roomLinks.removeViewers(document.id), dataForSend, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });
      dispatch(showSuccess(`${chosen.length > 1 ? 'Пользователе удалены' : 'Пользователь удален'}`));
      actionsIDHandler();
      closePopup();
      updateRoom();
    } catch (error) {
      dispatch(showError('Не удалось выполнить действие'));
      console.log(error);
    }
  };

  return (
    <div>
      <CheckboxSelection
        data={document.viewers_status
          .filter(user => !userWithTaskCompleted.includes(user.signer_id))
          .map(user => ({ value: user.viewer_id, label: user.viewer }))}
        chosen={chosen}
        func={chosenToggle}
        titleFromParent="Убрать"
        removeUser={updateData}
      />
    </div>
  );
};
