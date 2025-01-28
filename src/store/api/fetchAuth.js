import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { links } from '../../routes/routes';

export const fetchAuth = createAsyncThunk('users/fetchAuth', async ({ username, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(links.login(), { username, password }, { headers: { 'Content-Type': 'application/json' } });

    if (response.status === 200) {
      const { token, user } = response.data;
      if (token && user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      return response.data;
    }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Неизвестная ошибка с сервера');
  }
});
