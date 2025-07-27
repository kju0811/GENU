import React from 'react';
import Chart from 'react-apexcharts';

export default function PieChartCard({ assetList, nurung }) {

    const filtered = assetList.filter(item => item.total_price > 0);
    const coinTotal = filtered.reduce((sum, item) => sum + item.total_price, 0);
    const cash = nurung || 0;

    const fullSeries = [...filtered.map(item => item.total_price), cash];
    const fullLabels = [...filtered.map(item => item.coin_name), '💰 현금'];

    if (coinTotal === 0 && cash === 0) {
        return (
            <div className="bg-white border rounded-xl p-6 shadow-sm text-gray-600 text-sm">
                보유 중인 자산이 없습니다.
            </div>
        );
    }

    const options = {
        chart: {
            type: 'pie',
            height: '100%',
        },
        labels: fullLabels,
        legend: {
            position: 'right',
            fontSize: '14px',
            fontFamily: 'MaplestoryOTFBold, Pretendard, sans-serif',
            labels: {
                colors: '#4B5563',
            }
        },
        tooltip: {
            y: {
                formatter: (value) => `${value.toLocaleString()} 누렁`,
            },
        },
        dataLabels: {
            enabled: false
        },
        responsive: [{
            breakpoint: 768,
            options: {
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    return (
        <div className="bg-white border rounded-xl p-6 shadow-sm h-[300px]">
            <div className="font-semibold mb-3 text-gray-700">📊 보유 자산 비중 (코인 + 현금)</div>
            <div className="w-full h-[220px]">
                <Chart options={options} series={fullSeries} type="pie" height={220} />
            </div>
        </div>
    );
}
