import React, { useEffect, useState, useRef } from 'react';
import { getIP } from '../components/Tool';

const ROW_HEIGHT = 32;
const VISIBLE_COUNT = 13;

export default function OrderBook({ coin_no, currentPrice, onSelectPrice }) {
  const [data, setData] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    fetch(`http://${getIP()}:9093/coin/orderlist/${coin_no}`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, [coin_no]);

  const prices = data
    ? Object.entries(data).map(([price, amount]) => ({
        price: Number(price),
        amount: Number(amount),
      }))
    : [];
  const displayPrices = [...prices].sort((a, b) => b.price - a.price);
  const mid = Math.floor(displayPrices.length / 2);

  if (!data) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
        <div className="space-y-2">
          {Array.from({ length: VISIBLE_COUNT }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-7 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xs mx-auto min-h-[500px] max-h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
      <h3 className="text-center text-base font-bold p-2 border-b dark:border-gray-700 text-gray-800 dark:text-gray-100 tracking-wide">
        호가창
      </h3>
      <div
        ref={listRef}
        className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto"
        style={{ maxHeight: ROW_HEIGHT * VISIBLE_COUNT }}
      >
        {displayPrices.map(({ price, amount }, i) => {
          const isAsk = i < mid;
          const isBid = !isAsk;
          const isSelected = price === selectedPrice;

          return (
            <div
              key={price + '-' + i}
              onClick={() => {
                setSelectedPrice(price);
                onSelectPrice?.(price);
              }}
              className={`
                flex items-center cursor-pointer select-none transition-colors
                active:border-4 border-black inline-block active:border-black
                ${isAsk
                  ? 'hover:bg-red-50 dark:hover:bg-red-900'
                  : 'hover:bg-blue-50 dark:hover:bg-blue-900'
                }
              `}
              style={{ height: ROW_HEIGHT }}
            >
              {/* 좌측: 매도 대기 수량 */}
              <div className={`flex-1 text-left pl-2 text-xs sm:text-sm font-semibold
                ${isAsk ? 'text-red-600 dark:text-red-200' : 'text-transparent'}`}>
                {isAsk ? amount.toLocaleString() : '-'}
              </div>
              {/* 중앙: 가격 */}
              <div className={`
                flex-1 text-center text-base sm:text-lg font-mono
                ${isAsk ? 'text-red-600' : 'text-blue-700'}
                dark:text-white
              `}>
                {price.toLocaleString()}
              </div>
              {/* 우측: 매수 대기 수량 */}
              <div className={`flex-1 text-right pr-2 text-xs sm:text-sm font-semibold
                ${isBid ? 'text-blue-700 dark:text-blue-300' : 'text-transparent'}`}>
                {isBid ? amount.toLocaleString() : '-'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
