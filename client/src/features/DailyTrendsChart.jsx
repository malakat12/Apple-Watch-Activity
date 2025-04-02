import React, { useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { getDaily } from './healthMetricsSlice';
import {Line} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LineElement, 
    PointElement, 
    LinearScale, 
    Title, 
    Tooltip, 
    Legend, 
    Filler 
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LineElement, 
    PointElement, 
    LinearScale, 
    Title, 
    Tooltip, 
    Legend, 
    Filler
);

const DailyTrendsChart= ()=>{
    const dispatch = useDispatch();
    const {data , loading, error}= useSelector((state)=>state.healthMetrics.daily);

    useEffect(()=>{
        dispatch(getDaily());
    }, [dispatch]);

    if (loading) return <p>Loading daily metrics...</p>;
    if (error) return <p>Error loading data: {error}</p>;
    if(!data || !Array.isArray(data)) return <p>No daily data</p>;

    const charData={
        labels: data.map(item=>item.date),
        datasets:[
            {
                label: 'Daily Activity',
                data: data.map(item=>item.value),
                fill:true,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor:'rgba(75,192,192,1)',
            }
        ]
    };
    
    return <Line data={charData} />;
};

export default DailyTrendsChart;