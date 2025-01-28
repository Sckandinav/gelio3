import { createSlice } from '@reduxjs/toolkit';
import { fetchAuth } from '../api/fetchAuth';

const initialState = {
  loading: false,
  isAuth: Boolean(localStorage.getItem('token')),
  data: { token: localStorage.getItem('token') || '', user: JSON.parse(localStorage.getItem('user')) || {} },
  error: null,
};

const userDetailsSlice = createSlice({
  name: 'userDetailsSlice',
  initialState,
  reducers: {
    logOut: state => {
      state.data = [];
      state.isAuth = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAuth.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuth = true;
        state.data = action.payload;
      })
      .addCase(fetchAuth.rejected, (state, action) => {
        state.loading = false;
        state.isAuth = false;
        state.data = [];
        state.error = action.payload;
      });
  },
});

export const { logOut } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;
