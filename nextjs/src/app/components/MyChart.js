// components/TSLAChart.js
'use client';

import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import MyLoader from './loader';

import { useUser } from '@auth0/nextjs-auth0/client';



ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const MyChart = ({stockId,startDate}) => {
  const [data, setData] = useState([]); // State to store the fetched data
  const [chartData, setChartData] = useState(null); // State for chart-ready data
  const [interval, setInterval] = useState('weekly'); // State to track selected interval



  // const [loading, setLoading] = useState(true);



  
  const period1 = startDate;
  const period2 = new Date().toISOString().split('T')[0];
  // console.log(period1,period2)
  // Fetch stock data and store it in the `data` state
  
  const fetchData = async () => {


      fetch('/api/get-stock-data', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(
          {
            
            "stockId":stockId,
            "period1":period1,
            "period2":period2
        
        }
        )
    })
        .then((response) => response.json())
        .then((data) => {
            // console.log(data);
            // console.log('Fetched data:', data.quotes);
            setData(data.quotes); // Store the fetched data in the state
            // setLoading(false);
        })
        .catch((error) => {
            console.error(error);
        });

        
  };

  

  // Filter data based on the selected interval
  const filterDataByInterval = (interval) => {
    if (interval === 'weekly') {
      return data.filter((_, index) => index % 7 === 0); // Filter weekly data
    } else if (interval === 'monthly') {
      return data.filter((_, index) => index % 30 === 0); // Filter monthly data
    } else {
      return data; // Return all data for daily
    }
  };

  // Update chart data when the interval changes or data is updated
  useEffect(() => {
    if (data.length > 0) {
      const filteredData = filterDataByInterval(interval);

      const labels = filteredData.map((item) => new Date(item.date).toLocaleDateString());
      const openPrices = filteredData.map((item) => item.open);

      setChartData({
        labels,
        datasets: [
          {
            data: openPrices,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.2,
          },
        ],
      });
    }
  }, [interval, data]);

  useEffect(() => {
    // console.log(stockId, period1, period2);
    fetchData();
}, [stockId, period1, period2]);

  if(!chartData){
    return <div>Loading...</div>
  }

  return (
    <div className='mx-2'>

      
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: false, // Hide the legend as there's only one dataset
            },
            title: {
              display: true,
              text: `${stockId} Stock Open Prices (${interval.toUpperCase()})`,
            },
          },
          elements: {
            point: {
              radius: 1,
            },
          },
        }}
      />

<div className="mydict" style={{ marginBottom: '20px' }}>
        <div>
          <label>
            <input
              type="radio"
              name="interval"
              value="daily"
              checked={interval === 'daily'}
              onChange={(e) => setInterval(e.target.value)} // Update state on change
            />
            <span>Daily</span>
          </label>
          <label>
            <input
              type="radio"
              name="interval"
              value="weekly"
              checked={interval === 'weekly'}
              onChange={(e) => setInterval(e.target.value)} // Update state on change
            />
            <span>Weekly</span>
          </label>
          <label>
            <input
              type="radio"
              name="interval"
              value="monthly"
              checked={interval === 'monthly'}
              onChange={(e) => setInterval(e.target.value)} // Update state on change
            />
            <span>Monthly</span>
          </label>
        </div>
      </div>


    </div>
  );
};

export default MyChart;
