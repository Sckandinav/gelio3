import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  unreadCount: 0,
  sideBar: {
    data: [],
  },
  applicationMenu: {
    data: [],
  },
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
      const lastNotifications = state.notifications.slice(-1)[0]?.notifications;
      if (lastNotifications === null) {
        state.unreadCount = 0;
      }
      if (lastNotifications) {
        state.unreadCount = lastNotifications.reduce((acc, curr) => {
          acc += curr.count;
          return acc;
        }, 0);
      }
    },
    setWebSocketData: (state, action) => {
      state.sideBar.data = action.payload;
    },
    setApplicationCounter: (state, action) => {
      state.applicationMenu.data = action.payload;
    },
  },
});

export const { addNotification, setWebSocketData, setApplicationCounter } = notificationsSlice.actions;
export default notificationsSlice.reducer;
