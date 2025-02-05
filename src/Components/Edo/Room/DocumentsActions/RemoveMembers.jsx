import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showSuccess, showError } from '../../../../store/slices/toast.js';
import { useAxiosInterceptor } from '../../../hoc/useAxiosInterceptor';
import { roomLinks } from '../../../../routes/routes.js';
import { CheckboxSelection } from '../../../Select/CheckboxSelection.jsx';

export const RemoveMembers = ({ closePopup, updateRoom, roomsDetails }) => {
  const [usersWithCompletedTasks, setUsersWithCompletedTasks] = useState([]);
  const [usersData, setChosen] = useState([]);
  const axiosInstance = useAxiosInterceptor();

  const users = roomsDetails.members;
  const { id } = useParams();
  const dispatch = useDispatch();

  const chosenHandler = selected => {
    usersData.includes(selected.value) ? setChosen(prev => prev.filter(id => id !== selected.value)) : setChosen(prev => [...prev, selected.value]);
  };

  const removeUser = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axiosInstance.post(
        roomLinks.removeUser(id),
        { usersData },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        },
      );
      closePopup();
      dispatch(showSuccess(`${usersData.length > 1 ? 'Сотрудники удалены из комнаты' : 'Сотрудник удален из комнаты'}`));
      updateRoom();
    } catch (error) {
      console.log(error);
      dispatch(showError('Не удалось убрать пользователя'));
    }
  };

  useEffect(() => {
    const filterToDeleteUsers = () => {
      const documentViewedOrSignedUsers = roomsDetails.documents.flatMap(document => [
        ...document.signers_status.filter(signer => signer.is_signed === true || signer.is_signed === null).map(signer => signer.signer_id),
        ...document.viewers_status.filter(viewer => viewer.is_viewed).map(viewer => viewer.viewer_id),
      ]);

      setUsersWithCompletedTasks(documentViewedOrSignedUsers);
    };

    filterToDeleteUsers();
  }, [roomsDetails.documents]);

  return (
    <>
      <CheckboxSelection
        data={users.filter(user => !usersWithCompletedTasks.includes(user.user_id)).map(user => ({ value: user.user_id, label: user.full_name }))}
        chosen={usersData}
        titleFromParent="Убрать"
        func={chosenHandler}
        removeUser={removeUser}
      />
    </>
  );
};
