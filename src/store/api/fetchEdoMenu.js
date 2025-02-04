import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchEdoMenu = createAsyncThunk('notifications/webSocketMessageReceived', async (data, { rejectWithValue }) => {
  try {
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});
