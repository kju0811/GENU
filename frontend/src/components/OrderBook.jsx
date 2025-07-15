import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getIP } from '../components/Tool';

/**
 * OrderBook 컴포넌트 ( 호가창 )
 * - 현재 호가 강조
 */
export default function OrderBook({ coin_no, currentPrice, onSelectPrice }) {
  const [data, setData] = useState(null);
  const listRef = useRef(null);
  const ROW_HEIGHT = 30;
  const VISIBLE_COUNT = 13;

  // 1) 데이터 로딩
  useEffect(() => {
    const fetchData = () => {
      fetch(`http://${getIP()}:9093/coin/orderlist/${coin_no}`)
        .then(res => res.json())
        .then(setData)
        .catch(console.error);
    }; 
    fetchData();                                  // 최초 호출
    const id = setInterval(fetchData, 5000);     // 5초마다 재호출 (우선 5초마다 폴링 방식 채택)
    return () => clearInterval(id);
  }, [coin_no]);

  // 2) 데이터 포맷
  const prices = data
    ? Object.entries(data).map(([price, amount]) => ({ price: Number(price), amount }))
    : [];
  const sorted = [...prices].sort((a, b) => a.price - b.price);
  const displayPrices = [...sorted].reverse();

  // 3) 초기 스크롤: 중앙에 currentPrice 위치시키기
  useEffect(() => {
    if (listRef.current && currentPrice != null) {
      const idx = displayPrices.findIndex(p => p.price === currentPrice);
      const offset = (idx - Math.floor(VISIBLE_COUNT / 2)) * ROW_HEIGHT;
      listRef.current.scrollTop = Math.max(0, offset);  
    }
  }, [displayPrices, currentPrice]);

  if (!data) {
    return <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow text-center">Loading...</div>;
  }
  
  // 4) 중앙 인덱스 계산
  const centerIndex = Math.floor(displayPrices.length / 2);


  return (
    <div className="w-64 mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <h3 className="text-center text-lg font-semibold p-2 border-b dark:border-gray-700">
        📈 호가창
      </h3>
      <div
        ref={listRef}
        className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto"
        style={{ maxHeight: ROW_HEIGHT * VISIBLE_COUNT }}
      >
        {displayPrices.map(({ price, amount }, i) => (
          <div
            key={price}
            onClick={() => onSelectPrice(price)}
            // i === centerIndex 일 때만 강조
            className={`flex justify-between items-center px-4 py-2 cursor-pointer transition-colors ${
              i === centerIndex
                ? 'bg-blue-100 dark:bg-blue-900 font-medium'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            style={{ height: ROW_HEIGHT }}
          >
            <span className="text-sm text-gray-800 dark:text-gray-200">{price.toLocaleString()}</span>
            <span className="text-sm text-green-600 dark:text-green-400">{amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}