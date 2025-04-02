import React, { useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { getWeekly } from './healthMetricsSlice';
import {Line} from 'react-chartjs-2';
import {
    Chart as ChartJS, 
    LineElement, 
    PointElement, 
    LinearScale, 
    Title, 
    Tooltip, 
    Legend, 
    Filler 
} from 'chart.js';

ChartJS.register(
    LineElement, 
    PointElement, 
    LinearScale, 
    Title, 
    Tooltip, 
    Legend, 
    Filler
);

const WeeklyTrendsChart= ()=>{
    const dispatch = useDispatch();
    const {data , loading, error}= useSelector((state)=>state.healthMetrics.weekly);

    useEffect(()=>{
        dispatch(getWeekly());
    }, [dispatch]);

    if (loading) return <p>Loading Weekly metrics...</p>;
    if (error) return <p>Error loading data: {error}</p>;
    if (!data) return <p>No weekly data available</p>;

const charData={
        labels: data.dates,
        datasets: [
          {
            label: 'Steps',
            data: data.steps,
            fill: true,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1
          },
          {
            label: 'Active Minutes',
            data: data.active_minutes,
            fill: false,
            borderColor: 'rgba(255, 99, 132, 1)',
            tension: 0.1
          }
        ]
    };
    
    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'weekly Health Metrics',
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            beginAtZero: true
          }
        }
      };
    
      return (
        <div>
          <Line data={charData} options={options} />
        </div>
      );
};

export default WeeklyTrendsChart;