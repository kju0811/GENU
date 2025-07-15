import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { getIP } from './Tool';

/**
 * ApexCharts 기반 캔들스틱 차트 컴포넌트
 * Props:
 *  - coin_no: 차트에 사용할 코인 번호
 *  - days: 조회 기간(일수), 기본값 30
 */
export default function ApexChart({ coin_no, days = 30 }) {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const options = {
    chart: { type: 'candlestick', height: 350, toolbar: { show: true } },
    title: { text: `${coin_no}번 코인 캔들스틱 (${days}일)`, align: 'left' },
    xaxis: { type: 'datetime' },
    yaxis: { 
      opposite: true, 
      tooltip: { enabled: true } 
    }
  };

  useEffect(() => {
    if (!coin_no) return;
    setLoading(true);
    setError(null);

    fetch(`http://${getIP()}:9093/coinlog/ohlc/${coin_no}?days=${days}`)
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(data => {
        // 응답: [[date, low, open, close, high], ...]
        const candlestickData = data.map(item => ({
          x: new Date(item[0]),
          y: [item[2], item[4], item[1], item[3]] // [open, high, low, close]
        }));
        setSeries([{ data: candlestickData }]);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [coin_no, days]);

  if (loading) return <div>Loading chart...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!series.length || !series[0].data.length) return <div>No data available</div>;

  return (
    <div>
      <Chart options={options} series={series} type="candlestick" height={350} />
    </div>
  );
}
