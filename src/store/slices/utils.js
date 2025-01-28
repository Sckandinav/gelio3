import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpenMainMenu: false,
};

const utilsSlice = createSlice({
  name: 'utilsSlice',
  initialState,
  reducers: {
    menuToggle: state => {
      state.isOpenMainMenu = !state.isOpenMainMenu;
    },
  },
});

export const { menuToggle } = utilsSlice.actions;
export default utilsSlice.reducer;
