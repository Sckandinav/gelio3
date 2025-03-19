import React, { useState } from 'react';

import { useDispatch } from 'react-redux';

import { roomLinks } from '../../../../routes/routes.js';
import { showSuccess, showError } from '../../../../store/slices/toast.js';
import { useAxiosInterceptor } from '../../../hoc/useAxiosInterceptor';
import { CheckboxSelection } from '../../../Select/CheckboxSelection.jsx';

export const RemoveSigners = ({ closePopup, updateRoom, document, actionsIDHandler }) => {
  const [chosen, setChosen] = useState([]);
  const dispatch = useDispatch();
  const axiosInstance = useAxiosInterceptor();

  const prepareDataForUpdate = () => {
    return chosen.map(user => ({ signer: user.label, signer_id: user.value }));
  };

  const chosenToggle = el => {
    chosen.some(user => user.value === el.value) ? setChosen(prev => prev.filter(user => user.value !== el.value)) : setChosen(prev => [...prev, el]);
  };

  const updateData = async e => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      const dataForSend = prepareDataForUpdate();

      await axiosInstance.post(roomLinks.removeSigners(document.id), dataForSend, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });
      dispatch(showSuccess(`${chosen.length > 1 ? 'Пользователи удалены' : 'Пользователь удален'}`));
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
        data={document.signers_status.filter(user => user.is_signed === false).map(user => ({ value: user.signer_id, label: user.signer }))}
        chosen={chosen}
        func={chosenToggle}
        titleFromParent="Убрать"
        removeUser={updateData}
      />
    </div>
  );
};
