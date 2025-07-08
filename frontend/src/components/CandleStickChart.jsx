import React from 'react';
import { Chart } from 'react-google-charts';
import { useEffect, useState } from "react";
import { getIP } from '../components/Tool';
import { useParams, useSearchParams } from 'react-router-dom';

const options = {
  legend: 'none',
  bar: { groupWidth: '100%' },
  candlestick: {
    fallingColor: { strokeWidth: 0, fill: '#a52714' },
    risingColor: { strokeWidth: 0, fill: '#0f9d58' },
  },
};

function CandleStickChart( { coin_no, days = 7 } ) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // const { coin_no } = useParams();
  // const [searchParams] = useSearchParams();
  // const days = searchParams.get('days') || '30';

  useEffect(() => {
    if (!coin_no) return;
    
    setLoading(true);
    setError(null);
    
    fetch(`http://${getIP()}:9093/coinlog/ohlc/${coin_no}?days=${days}`, {
      method: 'GET'
    })
    .then(result => {
      if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
      }
      return result.json();
    })
    .then(responseData => {
      console.log("Raw data -> ", responseData);
      
      // 백엔드에서 Google Charts 순서에 맞춰 데이터가 옴
      // 백엔드 데이터 순서: [Date, Low, Open, Close, High]
      // Google Charts 요구 순서: [Date, Low, Open, Close, High]
      const chartData = [
        ['Date', 'Low', 'Open', 'Close', 'High'], // 헤더
        ...responseData.map(item => [
          new Date(item[0]), // 날짜 (index 0)
          item[1], // Low (index 1)
          item[2], // Open (index 2)
          item[3], // Close (index 3)
          item[4]  // High (index 4)
        ])
      ];
      
      setData(chartData);
      setLoading(false);
    })
    .catch(err => {
      console.error('Error fetching data:', err);
      setError(err.message);
      setLoading(false);
    });
  }, [coin_no, days]);

  if (loading) {
    return <div>Loading chart...</div>;
  }

  if (error) {
    return <div>Error loading chart: {error}</div>;
  }

  if (!data || data.length <= 1) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <h3>{coin_no}번 코인 차트 ({days} 일)</h3>
      <Chart
        chartType="CandlestickChart"
        width="600px"
        height="400px"
        data={data}
        options={options}
      />
    </div>
  );
}

export default CandleStickChart;