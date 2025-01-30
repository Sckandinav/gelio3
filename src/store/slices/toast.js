import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const toastSlice = createSlice({
  name: 'toast',
  initialState: {},
  reducers: {
    showSuccess: (_, action) => {
      toast.success(action.payload);
    },
    showError: (_, action) => {
      toast.error(action.payload);
    },
    showInfo: (_, action) => {
      toast.info(action.payload);
    },
    showWarning: (_, action) => {
      toast.warn(action.payload);
    },
  },
});

export const { showSuccess, showError, showInfo, showWarning } = toastSlice.actions;
export default toastSlice.reducer;
