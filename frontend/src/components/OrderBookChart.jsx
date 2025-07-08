// src/components/OrderBookChart.jsx
import React from 'react';

/**
 * OrderBookChart
 * @param {{ bids: Array<{ price: number, volume: number }>, asks: Array<{ price: number, volume: number }> }} data
 * - bids: 매수 호가 리스트
 * - asks: 매도 호가 리스트
 * TODO: 차트 라이브러리(예: Recharts, Chart.js)로 Depth 차트 구현
 */
export default function OrderBookChart({ data }) {
  const { bids = [], asks = [] } = data || {};
  return (
    <div className="bg-white dark:bg-[#1E2028] rounded-lg p-4 shadow">
      {/* TODO: 호가창 Depth 차트 */}
      <p className="text-center text-gray-500">Order Book Depth Chart</p>
    </div>
  );
}