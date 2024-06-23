import axiosInstance from '@/lib/axiosInstance';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface getEventsPropsType {
  oem: string;
  from: string;
  to: string;
  page: string;
  limit: string;
  eventTypes: 'relativeHumidity' | 'temperature'
}

const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    events: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    resetState: (state, action) => {
      state.events = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getEvents.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getEvents.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(getEvents.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});

export const getEvents = createAsyncThunk(
  'events/getEvents',
  async ({ oem, eventTypes, from, to, page = '1', limit = '100' }: getEventsPropsType) => {
    const response = await axiosInstance.get(`/events?oem=${oem}&from=${from}&to=${to}`, { params: {eventTypes: eventTypes}})
    return response.data
  },
);

export const { resetState } = eventsSlice.actions;
export default eventsSlice.reducer;
