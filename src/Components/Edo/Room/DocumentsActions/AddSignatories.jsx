import React, { useState } from 'react';

import { useDispatch } from 'react-redux';

import { roomLinks } from '../../../../routes/routes.js';
import { showSuccess, showError } from '../../../../store/slices/toast.js';
import { useAxiosInterceptor } from '../../../hoc/useAxiosInterceptor';
import { CheckboxSelection } from '../../../Select/CheckboxSelection.jsx';

export const AddSignatories = ({ closePopup, updateRoom, document, members, actionsIDHandler }) => {
  const [chosen, setChosen] = useState([]);
  const dispatch = useDispatch();
  const axiosInstance = useAxiosInterceptor();

  const chosenToggle = el => {
    chosen.some(user => user.value === el.value) ? setChosen(prev => prev.filter(user => user.value !== el.value)) : setChosen(prev => [...prev, el]);
  };

  const canInviteUser = () => {
    const signers = document.signers_status.map(user => user.signer_id);
    const viewer = document.viewers_status.map(user => user.viewer_id);

    return members.filter(user => !signers.includes(user.user_id)).filter(user => !viewer.includes(user.user_id));
  };

  const prepareDataForUpdate = () => {
    return chosen.map(user => ({
      user_id: user.value,
      full_name: user.label,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const dataForSend = prepareDataForUpdate();
    try {
      await axiosInstance.post(roomLinks.addSigners(document.id), dataForSend, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });
      dispatch(showSuccess(`${chosen.length > 1 ? 'Подписанты добавлены' : 'Подписант добавлен'}`));
      updateRoom();
      closePopup();
      actionsIDHandler();
    } catch (error) {
      console.log(error);
      dispatch(showError('Не удалось выполнить действие'));
    }
  };

  return (
    <div>
      <CheckboxSelection
        data={canInviteUser().map(user => {
          return {
            value: user.user_id,
            label: user.full_name,
          };
        })}
        chosen={chosen}
        func={chosenToggle}
        titleFromParent="Добавить"
        removeUser={handleSubmit}
      />
    </div>
  );
};
