import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpenMainMenu: false,
  department: '',
  pagination: {
    rowsPerPage: 10,
    currentPage: 1,
  },
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
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setRowsPerPage: (state, action) => {
      state.pagination.rowsPerPage = action.payload;
    },
    resetPagination: state => {
      state.pagination.rowsPerPage = 10;
      state.pagination.currentPage = 1;
    },
  },
});

export const { menuToggle, setDepartment, setCurrentPage, setRowsPerPage, resetPagination } = utilsSlice.actions;
export default utilsSlice.reducer;
