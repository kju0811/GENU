import React, { useState, useEffect } from 'react';
import { getIP } from "./Tool";
import { jwtDecode } from 'jwt-decode';

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
export default function OrderForm({ coin_no, coin_price }) {
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

  let [memberNo, setMemberNo] = useState(null);
  const jwt = sessionStorage.getItem("jwt");
  // const token = localStorage.getItem('token');
  const [myprice, setMyprice] = useState(0);

  const handleSubmit = async e => {
    e.preventDefault();
    // TODO: 주문 API 호출 로직
    console.log({ coin_no, side, type, price, quantity });
    const dto = {
      coin: {"coin_no": coin_no},
      member: {"member_no": memberNo},
      price: parseInt(price),
      cnt: parseInt(quantity),
    };
    console.log("dto -> ", dto)

    try {
      if (side == "buy"){
        fetch(`http://${getIP()}:9093/deal/buydeal`, {
          method: 'POST',
          headers : { 
            'Authorization' : jwt ,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dto)
        }).then(result => result.json())
        .then(data => {
          console.log("date -> ", data)
          if (data.deal_no > 0) {
            alert('매수 주문 완료!');
            window.location.reload();
          } else {
            alert('매수 주문 실패. 다시 시도하세요.');
          }

        })
        .catch(err => console.error(err))

      } else if (side == "sell") {

      }
    } catch (err) {
      console.error(err);
      alert('서버 오류 발생');
    }


  };

  useEffect(() => {
    try {
      const decoded = jwtDecode(jwt);
      console.log(decoded);
      const decodedMemberNo = decoded.member_no;
      setMemberNo(decoded.member_no);

      console.log("member_no -> ", decodedMemberNo);
      fetch(`http://${getIP()}:9093/pay/my/${decodedMemberNo}`, {
        method: 'GET',
        headers : { 'Authorization' : jwt }

      })
      .then(result => result.json())
      .then(data => {
        console.log("돈date -> ", data)
        setMyprice(data);

      })
      .catch(err => console.error(err))

    } catch (err) {
      console.error("Invalid token:", err.message);
      setMyprice(0);
    }
  }, [jwt])


  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1E2028] rounded-lg p-4 shadow space-y-4">
      {/* 매수/매도/내역 탭 */}
      <div className="flex space-x-4">
        <button type="button" onClick={() => setSide('buy')} className={`${side==='buy'? 'bg-blue-500 text-white':'bg-gray-100 dark:bg-[#2A2C36] text-gray-500'} flex-1 py-2 rounded`}>매수</button>
        <button type="button" onClick={() => setSide('sell')} className={`${side==='sell'? 'bg-red-500 text-white':'bg-gray-100 dark:bg-[#2A2C36] text-gray-500'} flex-1 py-2 rounded`}>매도</button>
        <button type="button" onClick={() => setSide('list')} className={`${side==='list'? 'bg-red-500 text-white':'bg-gray-100 dark:bg-[#2A2C36] text-gray-500'} flex-1 py-2 rounded`}>내역</button>
      </div>

      {/* 주문 유형 선택 */}
      <div className="flex space-x-2">
        <button type="button" onClick={() => setType('limit')} className={`${type==='limit'? 'font-medium':'text-gray-500'} text-sm`}>지정가</button>
        <button type="button" onClick={() => setType('market')} className={`${type==='market'? 'font-medium':'text-gray-500'} text-sm`}>시장가</button>
      </div>

      <div>
        보유금액 : {typeof myprice === 'object'
          ? (myprice.message || JSON.stringify(myprice))
          : Number(myprice).toLocaleString()} 누렁
      </div>

      {/* 가격 입력 (지정가일 때만 표시) */}
      {type === 'limit' && (
        <div>
          <label className="block text-xs text-gray-500">가격</label>
          <input 
            type="number" 
            value={price} 
            onChange={e=>setPrice(e.target.value)} 
            className="w-full mt-1 p-2 border rounded bg-gray-50 dark:bg-[#2A2C36]" 
            placeholder="0.0" />
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

      <button type="submit" className="w-full py-2 bg-green-500 text-white rounded font-medium">{side==='buy'?'매수':'매도'} 주문</button>
    </form>
  )
}