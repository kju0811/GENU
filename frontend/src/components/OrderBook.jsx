import React, { useEffect, useState, useRef } from 'react';
import { getIP } from '../components/Tool';

// 한 줄에 보일 행 높이(픽셀)
const ROW_HEIGHT = 32;
// 한 번에 보일 최대 행 개수(스크롤 영역 높이용)
const VISIBLE_COUNT = 13;

/**
 * 코인 호가창(OrderBook)
 * @param {string} coin_no - 코인 식별자
 * @param {number} currentPrice - 현재가(선택 포커스 등으로 활용 가능)
 * @param {function} onSelectPrice - 가격 클릭 시 콜백(상위 주문창 등과 연동)
 */
export default function OrderBook({ coin_no, currentPrice, onSelectPrice }) {
  const [data, setData] = useState(null); // 서버에서 받아온 원시 호가 데이터
  const [selectedPrice, setSelectedPrice] = useState(null); // 사용자가 클릭한 가격(포커스)
  const listRef = useRef(null); // 리스트 영역 ref(스크롤/포커스 조작용)

  // ---- 1. 데이터 요청(코인 변경시마다) ----
  useEffect(() => {
    fetch(`http://${getIP()}:9093/coin/orderlist/${coin_no}`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, [coin_no]);

  // ---- 2. 데이터 파싱 및 정렬 ----
  // 서버로부터 온 객체 {가격:수량, ...} → [{price, amount}, ...]로 변환
  const prices = data
    ? Object.entries(data).map(([price, amount]) => ({
        price: Number(price),      // 문자열 가격 → 숫자 변환
        amount: Number(amount),    // 수량도 혹시 몰라 숫자 변환
      }))
    : [];
  // 가격 내림차순(큰 값이 위)으로 정렬, 호가창 표준 구조
  const displayPrices = [...prices].sort((a, b) => b.price - a.price);
  // 중앙 인덱스(매도/매수 기준선, 현재가 라인 등 UI 분기용)
  const mid = Math.floor(displayPrices.length / 2);

  // ---- 3. 로딩 뼈대(Skeleton) ----
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

  // ---- 4. 실제 호가창 렌더링 ----
  return (
    <div className="w-full max-w-xs mx-auto min-h-[500px] max-h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
      {/* 헤더 */}
      <h3 className="text-center text-base font-bold p-2 border-b dark:border-gray-700 text-gray-800 dark:text-gray-100 tracking-wide">
        호가창
      </h3>
      {/* 리스트(스크롤 영역) */}
      <div
        ref={listRef}
        className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto"
        style={{ maxHeight: ROW_HEIGHT * VISIBLE_COUNT }}
      >
        {displayPrices.map(({ price, amount }, i) => {
          // mid(중앙) 기준으로 매도/매수 색상 분기
          const isAsk = i < mid; // mid보다 작으면 매도(위쪽)
          const isBid = !isAsk;  // mid 포함~아래는 매수(아래쪽)
          const isSelected = price === selectedPrice; // 클릭 포커스 여부

          return (
            <div
              key={price + '-' + i}
              onClick={() => {
                setSelectedPrice(price);         // 선택 포커스
                onSelectPrice?.(price);          // 상위 콜백 호출(주문창 연동 등)
              }}
              className={`
                flex items-center cursor-pointer select-none transition-colors
                active:border-4 border-black inline-block active:border-black
                ${isAsk
                  ? 'hover:bg-red-50 dark:hover:bg-red-900'    // 매도호가 hover 효과
                  : 'hover:bg-blue-50 dark:hover:bg-blue-900'  // 매수호가 hover 효과
                }
                ${isSelected ? 'bg-yellow-50 dark:bg-yellow-900' : ''} // 선택된 줄 강조
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
