import { createSlice } from '@reduxjs/toolkit';
import { fetchEdoMenu } from '../api/fetchEdoMenu';

const initialState = {
  notifications: [],
  unreadCount: 0,
  sideBar: {
    loading: false,
    data: [],
    error: null,
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
  },

  extraReducers: builder => {
    builder
      .addCase(fetchEdoMenu.pending, state => {
        state.sideBar.loading = true;
      })
      .addCase(fetchEdoMenu.fulfilled, (state, action) => {
        state.sideBar.loading = false;
        state.sideBar.data = action.payload;
      })
      .addCase(fetchEdoMenu.rejected, (state, action) => {
        state.sideBar.loading = false;
        state.sideBar.data = [];
        state.sideBar.error = action.payload;
      });
  },
});

export const { addNotification, setWebSocketData } = notificationsSlice.actions;
export default notificationsSlice.reducer;
