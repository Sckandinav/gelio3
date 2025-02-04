import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpenMainMenu: false,
  department: '',
};

const utilsSlice = createSlice({
  name: 'utilsSlice',
  initialState,
  reducers: {
    menuToggle: state => {
      state.isOpenMainMenu = !state.isOpenMainMenu;
    },
    setDepartment: (state, action) => {
      state.department = action.payload;
    },
  },
});

export const { menuToggle, setDepartment } = utilsSlice.actions;
export default utilsSlice.reducer;
