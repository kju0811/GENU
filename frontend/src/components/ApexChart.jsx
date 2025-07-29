import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { getIP } from './Tool';

export default function ApexChart({ coin_no, days: initialDays = 30 }) {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('candlestick');
  const [days, setDays] = useState(initialDays);

  const chartTypeLabel = {
    candlestick: '캔들스틱',
    line: '라인',
    bar: '막대',
    area: '영역',
  };

  const options = {
    chart: { type: chartType, height: 350, toolbar: { show: true } },
    title: { text: `${chartTypeLabel[chartType]} 차트 (${days}일)`, align: 'left' },
    xaxis: { type: 'datetime' },
    yaxis: { opposite: true, tooltip: { enabled: true } }
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
        let processed;
        if (chartType === 'candlestick') {
          processed = [{
            data: data.map(item => ({
              x: new Date(item[0]),
              y: [item[2], item[4], item[1], item[3]]
            }))
          }];
        } else {
          processed = [{
            name: '종가',
            data: data.map(item => ({
              x: new Date(item[0]),
              y: item[3]
            }))
          }];
        }
        setSeries(processed);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [coin_no, days, chartType]);

  if (loading) return <div>Loading chart...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!series.length || !series[0].data.length) return <div>No data available</div>;

  return (
    <div>
      {/* 차트 유형 드롭다운 */}
      <div className="mb-2 flex items-center gap-4">
        <div>
          <label htmlFor="chartType" className="mr-2 font-semibold">차트 유형:</label>
          <select
            id="chartType"
            value={chartType}
            onChange={e => setChartType(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="candlestick">캔들스틱</option>
            <option value="line">라인</option>
            <option value="bar">막대</option>
            <option value="area">영역</option>
          </select>
        </div>
        {/* 기간(일수) 드롭다운 */}
        <div>
          <label htmlFor="days" className="mr-2 font-semibold">기간:</label>
          <select
            id="days"
            value={days}
            onChange={e => setDays(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            <option value={3}>3일</option>
            <option value={7}>7일</option>
            <option value={30}>30일</option>
            <option value={90}>90일</option>
          </select>
        </div>
      </div>
      <Chart options={options} series={series} type={chartType} height={350} />
    </div>
  );
}
