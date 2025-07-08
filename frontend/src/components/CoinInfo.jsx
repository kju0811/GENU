import React from 'react';

/**
 * CoinInfo
 * @param {{ name: string, symbol: string, price: number, change: number, marketCap: number, volume24h: number }} data
 * - data: 코인 기본 정보 객체
 */
export default function CoinInfo({ data = {} }) {
  const { name, symbol, price, change, marketCap, volume24h } = data;
  return (
    <div className="bg-white dark:bg-[#1E2028] rounded-lg p-4 shadow grid grid-cols-2 gap-4">
      <div>
        <h4 className="text-sm text-gray-500">Name</h4>
        <p className="font-medium">{name} ({symbol})</p>
      </div>
      <div>
        <h4 className="text-sm text-gray-500">Price</h4>
        <p className="font-medium">{price?.toLocaleString()} 원</p>
      </div>
      <div>
        <h4 className="text-sm text-gray-500">Change (24h)</h4>
        <p className={`${change >= 0 ? 'text-green-500' : 'text-red-500'} font-medium`}>{change}%</p>
      </div>
      <div>
        <h4 className="text-sm text-gray-500">Market Cap</h4>
        <p className="font-medium">{marketCap?.toLocaleString()} 원</p>
      </div>
      <div>
        <h4 className="text-sm text-gray-500">Volume (24h)</h4>
        <p className="font-medium">{volume24h?.toLocaleString()} 원</p>
      </div>
    </div>
  );
}
