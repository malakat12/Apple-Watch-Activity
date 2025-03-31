import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchDailyMetrics = createAsyncThunk(
  'healthMetrics/fetchDaily',
  async (days = 30) => {
    const response = await axios.get(`/api/health-metrics/daily?days=${days}`);
    return response.data;
  }
);

export const fetchWeeklyMetrics = createAsyncThunk(
  'healthMetrics/fetchWeekly',
  async (weeks = 12) => {
    const response = await axios.get(`/api/health-metrics/weekly?weeks=${weeks}`);
    return response.data;
  }
);

const healthMetricsSlice = createSlice({
  name: 'healthMetrics',
  initialState: {
    daily: {
      data: null,
      loading: false,
      error: null
    },
    weekly: {
      data: null,
      loading: false,
      error: null
    }
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Daily metrics
      .addCase(fetchDailyMetrics.pending, (state) => {
        state.daily.loading = true;
        state.daily.error = null;
      })
      .addCase(fetchDailyMetrics.fulfilled, (state, action) => {
        state.daily.loading = false;
        state.daily.data = action.payload;
      })
      .addCase(fetchDailyMetrics.rejected, (state, action) => {
        state.daily.loading = false;
        state.daily.error = action.error.message;
      })
      
      // Weekly metrics
      .addCase(fetchWeeklyMetrics.pending, (state) => {
        state.weekly.loading = true;
        state.weekly.error = null;
      })
      .addCase(fetchWeeklyMetrics.fulfilled, (state, action) => {
        state.weekly.loading = false;
        state.weekly.data = action.payload;
      })
      .addCase(fetchWeeklyMetrics.rejected, (state, action) => {
        state.weekly.loading = false;
        state.weekly.error = action.error.message;
      });
  }
});

export default healthMetricsSlice.reducer;