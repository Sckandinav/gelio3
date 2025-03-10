import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';

import { SelectComponent } from '../../../Select/Select';
import { showSuccess, showError } from '../../../../store/slices/toast.js';

import { roomLinks, links } from '../../../../routes/routes.js';
import { fetchUsers } from '../../../../api/fetchUsers.js';
import { useAxiosInterceptor } from '../../../hoc/useAxiosInterceptor';

export const InviteMembers = ({ closePopup, updateRoom, members }) => {
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const [chosen, setChosen] = useState([]);
  const dispatch = useDispatch();
  const axiosInstance = useAxiosInterceptor();
  const prepareDataForUpdate = () => {
    const result = chosen.map(user => ({
      id: user.value,
      label: user.label,
      companyName: user.companyName,
      post: user.post,
    }));

    return result;
  };

  const usersIdInRoom = members?.map(user => user.user_id);

  const selectHandler = (...props) => {
    setChosen(prev => [...prev, props[1]]);
  };
  const deleteHandler = (...props) => {
    const selected = props[1];
    setChosen(prev => prev.filter(user => user.value !== selected.value));
  };

  const updateData = async e => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const axInst = axiosInstance;
      const dataForSend = prepareDataForUpdate();

      await axInst.post(roomLinks.addUser(id), dataForSend, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });

      closePopup();
      updateRoom();
      dispatch(showSuccess(`${chosen.length > 1 ? 'Пользователи добавлены' : 'Пользователь добавлен'}`));
    } catch (error) {
      console.log(error);
      dispatch(showError('Не удалось добавить пользователя'));
    }
  };

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetchUsers(links.getUsers(), axiosInstance);
        const options = response.reduce((acc, user) => {
          if (!usersIdInRoom?.includes(user.id)) {
            acc.push({
              value: user.id,
              label: user.full_name,
              companyName: user?.user_post_departament?.length > 0 ? user.user_post_departament[0].company_name : null,
              post: user?.user_post_departament?.length > 0 ? user.user_post_departament[0].post_name : null,
            });
          }

          return acc;
        }, []);
        setUsers(options);
      } catch (error) {
        console.log(error);
      }
    };

    getUsers();
  }, [members]);

  return (
    <div>
      <form onSubmit={updateData}>
        <SelectComponent data={users} selected={chosen} selectHandler={selectHandler} deleteHandler={deleteHandler} />
        <Button disabled={chosen.length === 0} variant="success" className="mt-3" type="submit">
          Добавить
        </Button>
      </form>
    </div>
  );
};
