import React, { useState } from 'react';

/**
 * OrderForm
 * @param {{ coin_no: string }} props
 * - coin_no: 주문할 코인 식별자
 * 기능:
 * - 주문 유형(지정가/시장가), 매수/매도 선택
 * - 가격, 수량 입력 및 비율 버튼
 * - 총 주문 금액 계산
 * TODO: 백엔드 주문 API 연동
 */
export default function OrderForm({ coin_no }) {
  const [type, setType] = useState('limit'); // 'limit' | 'market'
  const [side, setSide] = useState('buy');  // 'buy' | 'sell'
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  // 총 주문 금액 계산
  const total = type === 'market'
    ? '시가' // TODO: 시장가일 경우 시가 데이터 바인딩
    : (price && quantity ? (parseFloat(price) * parseFloat(quantity)).toLocaleString() : 0);

  // 수량 비율 설정 핸들러
  const handlePercent = percent => {
    // TODO: 사용자의 잔고 기반으로 수량 계산
    const qty = ((percent / 100) * /* availableBalance */ 0).toFixed(4);
    setQuantity(qty);
  };

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: 주문 API 호출 로직
    console.log({ coin_no, side, type, price, quantity });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1E2028] rounded-lg p-4 shadow space-y-4">
      {/* 매수/매도 탭 */}
      <div className="flex space-x-4">
        <button type="button" onClick={() => setSide('buy')} className={`${side==='buy'? 'bg-blue-500 text-white':'bg-gray-100 dark:bg-[#2A2C36] text-gray-500'} flex-1 py-2 rounded`}>매수</button>
        <button type="button" onClick={() => setSide('sell')} className={`${side==='sell'? 'bg-red-500 text-white':'bg-gray-100 dark:bg-[#2A2C36] text-gray-500'} flex-1 py-2 rounded`}>매도</button>
      </div>

      {/* 주문 유형 선택 */}
      <div className="flex space-x-2">
        <button type="button" onClick={() => setType('limit')} className={`${type==='limit'? 'font-medium':'text-gray-500'} text-sm`}>지정가</button>
        <button type="button" onClick={() => setType('market')} className={`${type==='market'? 'font-medium':'text-gray-500'} text-sm`}>시장가</button>
      </div>

      {/* 가격 입력 (지정가일 때만 표시) */}
      {type === 'limit' && (
        <div>
          <label className="block text-xs text-gray-500">가격</label>
          <input type="number" value={price} onChange={e=>setPrice(e.target.value)} className="w-full mt-1 p-2 border rounded bg-gray-50 dark:bg-[#2A2C36]" placeholder="0.0" />
        </div>
      )}

      {/* 수량 입력 */}
      <div>
        <label className="block text-xs text-gray-500">수량</label>
        <input type="number" value={quantity} onChange={e=>setQuantity(e.target.value)} className="w-full mt-1 p-2 border rounded bg-gray-50 dark:bg-[#2A2C36]" placeholder="0.0" />
        {/* 수량 비율 버튼 */}
        <div className="flex space-x-2 mt-1">
          {[10,25,50,100].map(p => (
            <button key={p} type="button" onClick={()=>handlePercent(p)} className="flex-1 text-xs py-1 bg-gray-100 dark:bg-[#2A2C36] rounded">{p}%</button>
          ))}
        </div>
      </div>

      {/* 총 주문 금액 */}
      <div className="text-right text-sm text-gray-500">
        총 주문 금액: <span className="font-medium">{total}</span> 원
      </div>

      <button type="submit" className="w-full py-2 bg-green-500 text-white rounded font-medium">{side==='buy'?'매수':'매도'} 예약</button>
    </form>
  )
}