import React from 'react';
import DailyTrendsChart from './DailyTrendsChart.jsx';
import WeeklyTrendsChart from './WeeklyTrendsChart';
  
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