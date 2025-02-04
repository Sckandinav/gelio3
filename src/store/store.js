import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userAuth';
import utilsReducer from './slices/utils';
import toastReducer from './slices/toast';
import notificationReducer from './slices/notifications';

export default configureStore({
  reducer: {
    user: userReducer,
    utils: utilsReducer,
    toast: toastReducer,
    notifications: notificationReducer,
  },
});
