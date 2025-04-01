import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInst from '../api/axiosInst';

export const getDaily= createAsyncThunk('healthMetrics/getDaily', async()=>{
    const response = await axiosInst.get('/health-metrics/daily');
    return response.data;
});

export const getWeekly= createAsyncThunk('/healthMetrics/getWeekly', async()=>{
    const response = await axiosInst.get('/health-metrics/weekly');
    return response.data;
});

const healthMetricsSlice =createSlice({
    name:'healthMetrics',
    initialState: {
        daily: {
            data: null, 
            loading:false, 
            error:null
        },
        weekly: {
            data: null, 
            loading:false, 
            error:null
        }
    },
    reducers: {},
    extraReducers: (builder)=>{
        builder.addCase(getDaily.pending,(state)=>{
            state.daily.loading=true;
        })
        .addCase(getDaily.fulfilled,(state, action)=>{
            state.daily.loading=false;
            state.daily.data= action.payload;
        })
        .addCase(getDaily.rejected,(state, action)=>{
            state.daily.loading=false;
            state.daily.error= action.error.message;
        })
        .addCase(getWeekly.pending,(state)=>{
            state.weekly.loading=true;
        })
        .addCase(getWeekly.fulfilled,(state, action)=>{
            state.weekly.loading=false;
            state.weekly.data= action.payload;
        })
        .addCase(getWeekly.rejected,(state, action)=>{
            state.weekly.loading=false;
            state.weekly.error= action.error.message;
        });
    }
});
export default healthMetricsSlice.reducer;