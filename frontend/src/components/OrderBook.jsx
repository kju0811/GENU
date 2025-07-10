import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getIP } from '../components/Tool';

/**
 * OrderBook 컴포넌트
 * - Tailwind CSS로 스타일 업데이트
 * - 현재 호가(CURRENT_PRICE) 강조
 */
export default function OrderBook() {
  const { coin_no } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`http://${getIP()}:9093/coin/orderlist/${coin_no}`)
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error(err));
  }, [coin_no]);

  if (!data) {
    return <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow text-center">Loading...</div>;
  }

  const prices = Object.entries(data).map(([price, amount]) => ({ price: Number(price), amount }));
  const CURRENT_PRICE = prices[Math.floor(prices.length/2)]?.price;

  return (
    <div className="w-64 mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <h3 className="text-center text-lg font-semibold p-2 border-b dark:border-gray-700">📈 호가창</h3>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {prices.reverse().map(({ price, amount }) => (
          <div
            key={price}
            className={`flex justify-between px-4 py-2 transition-colors ${
              price === CURRENT_PRICE ? 'bg-blue-50 dark:bg-blue-900 font-bold' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="text-sm  text-gray-800 dark:text-gray-200">{price.toLocaleString()}</span>
            <span className="text-sm text-green-600 dark:text-green-400">{amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
