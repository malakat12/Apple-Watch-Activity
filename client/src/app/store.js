import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/authSlice'
import healthMetricsReducer from '../features/healthMetricsSlice';

export default configureStore({
    reducer:{
        auth: authReducer,
        healthMetrics: healthMetricsReducer
    }
});