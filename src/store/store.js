import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userAuth';
import utilsReducer from './slices/utils';

export default configureStore({
  reducer: {
    user: userReducer,
    utils: utilsReducer,
  },
});
