import {configureStore} from '@reduxjs/toolkit';
import healthMetricsReducer from '../features/healthMetricsSlice';

export default configureStore({
    reducer:{
        healthMetrics: healthMetricsReducer
    }
});