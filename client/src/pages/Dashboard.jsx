import React from 'react';
import DailyTrendsChart from '../features/DailyTrendsChart.jsx';
import WeeklyTrendsChart from '../features/WeeklyTrendsChart.jsx';
  
const Dashboard = ()=>{
    return (
        <div>
            <h1>Activity Trends</h1>
            <h2>Daily Trends</h2>
            <DailyTrendsChart />
            <h2>Weekly Trends</h2>
            <WeeklyTrendsChart />
        </div>
    )
};

export default Dashboard;