import React from 'react';

/**
 * TradeChart
 * @param {{ timestamp: string, price: number }[]} data
 * - data: 시간별 가격 정보 배열
 * TODO: Line 또는 Area 차트로 가격 추이 시각화
 */
export default function TradeChart({ data = [] }) {
  return (
    <div className="bg-white dark:bg-[#1E2028] rounded-lg p-4 shadow">
      {/* TODO: 거래 차트 구현 */}
      <p className="text-center text-gray-500">Trade Price Chart</p>
    </div>
  );
}