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
export default function OrderForm({ coin_no, defaultPrice }) {
  const [type, setType] = useState('limit'); // 'limit' | 'market'
  const [side, setSide] = useState('buy');  // 'buy' | 'sell'
  const [price, setPrice] = useState(defaultPrice || '');
  const [quantity, setQuantity] = useState('');

  // defaultPrice가 바뀔 때마다 price를 업데이트
  useEffect(() => {
    setPrice(defaultPrice ?? '');
  }, [defaultPrice]);

  // 총 주문 금액 계산
  const total = type === 'market'
    ? '시가' // TODO: 시장가일 경우 시가 데이터 바인딩
    : (price && quantity ? (parseFloat(price) * parseFloat(quantity)).toLocaleString() : 0);

  // 수량 비율 설정 핸들러
  const handlePercent = percent => {
    // TODO: 사용자의 잔고 기반으로 수량 계산
    const qty = Math.floor(((myBalance * percent) / 100) / price);
    console.log("qty -> ", qty)
    setQuantity(qty);
  };

  let [memberNo, setMemberNo] = useState(null);
  const jwt = sessionStorage.getItem("jwt");
  // const token = localStorage.getItem('token');
  const [myBalance, setMyBalance] = useState(0);       // buy
  const [myAmount, setMyAmount] = useState(0);         // sell
  const [myDealList, setMyDealList] = useState([]);    // list

  const handleSubmit = async e => {
    e.preventDefault();
    // TODO: 주문 API 호출 로직
    // 만약 시장가라면 해당 코인의 가격으로 설정

    console.log({ coin_no, side, type, price, quantity });
    const dto = {
      coin: { "coin_no": coin_no },
      member: { "member_no": memberNo },
      price: type === 'market'
        ? defaultPrice
        : parseInt(price, 10),
      cnt: parseInt(quantity, 10),
    };
    console.log("dto -> ", dto)

    try {
      if (side == "buy") {
        fetch(`http://${getIP()}:9093/deal/buydeal`, {
          method: 'POST',
          headers: {
            'Authorization': jwt,
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
        fetch(`http://${getIP()}:9093/deal/selldeal`, {
          method: 'POST',
          headers: {
            'Authorization': jwt,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dto)
        }).then(result => result.json())
          .then(data => {
            console.log("date -> ", data)
            if (data.deal_no > 0) {
              alert('매도 주문 완료!');
              window.location.reload();
            } else {
              alert('매도 주문 실패. 다시 시도하세요.');
            }

          })
          .catch(err => console.error(err))

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

      let endpoint = '';
      let stateSetter;

      if (side === 'buy') {
        endpoint = `http://${getIP()}:9093/pay/my/${decodedMemberNo}`;
        stateSetter = setMyBalance;
      } else if (side === 'sell') {
        endpoint = `http://${getIP()}:9093/deal/get_total_cnt/${decodedMemberNo}/${coin_no}`
        stateSetter = setMyAmount;
      } else if (side === 'list') {
        endpoint = `http://${getIP()}:9093/deal/find_deal_by_member_coin/${decodedMemberNo}/${coin_no}`
        stateSetter = setMyDealList;
      }

      if (endpoint) {
        fetch(endpoint, {
          method: 'GET',
          headers: { 'Authorization': jwt }
        })
          .then(result => result.json())
          .then(data => {
            console.log("받은 데이터 -> ", data);
            stateSetter(data);
          })
          .catch(err => console.error(err));
      }

    } catch (err) {
      console.error("Invalid token:", err.message);
      setMyBalance(0);
      setMyAmount(0);
      setMyDealList([]);
    }

  }, [jwt, side])


  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1E2028] rounded-lg p-4 shadow space-y-4">
      {/* 매수/매도/내역 탭 */}
      <div className="flex space-x-4">
        <button type="button" onClick={() => setSide('buy')} className={`${side === 'buy' ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-[#2A2C36] text-gray-500'} flex-1 py-2 rounded`}>매수</button>
        <button type="button" onClick={() => setSide('sell')} className={`${side === 'sell' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-[#2A2C36] text-gray-500'} flex-1 py-2 rounded`}>매도</button>
        <button type="button" onClick={() => setSide('list')} className={`${side === 'list' ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-[#2A2C36] text-gray-500'} flex-1 py-2 rounded`}>내역</button>
      </div>

      {side !== 'list' ? (
        <>
          {/* 주문 유형 선택 */}
          <div className="flex space-x-2">
            <button type="button" onClick={() => setType('limit')} className={`${type === 'limit' ? 'font-medium' : 'text-gray-500'} text-sm`}>지정가</button>
            <button type="button" onClick={() => setType('market')} className={`${type === 'market' ? 'font-medium' : 'text-gray-500'} text-sm`}>시장가</button>
          </div>

          <div>
            {side === 'buy' && (
              <div>
                보유금액 : {
                  typeof myBalance === 'object'
                    ? (myBalance.message || JSON.stringify(myBalance))
                    : Number(myBalance).toLocaleString()
                } 누렁
              </div>
            )}

            {side === 'sell' && (
              <div>
                매도 가능 수량 : {myAmount} 개
              </div>
            )}
          </div>

          {/* 가격 입력 (지정가일 때만 표시) */}
          <div>
            <label className="block text-xs text-gray-500">가격</label>
            {type === 'limit' ? (
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full mt-1 p-2 border rounded bg-gray-50 dark:bg-[#2A2C36]"
              />
            ) : (
              <div className="w-full mt-1 p-2 border rounded bg-gray-50 dark:bg-[#2A2C36] text-gray-500">
                시장가{side === 'buy' ? '로 매수' : '로 매도'}
              </div>
            )}
          </div>

          {/* 수량 입력 */}
          <div>
            <label className="block text-xs text-gray-500">수량</label>
            <input
              type="number"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              className="w-full mt-1 p-2 border rounded bg-gray-50 dark:bg-[#2A2C36]"
              placeholder="0" />
            {/* 수량 비율 버튼 */}
            <div className="flex space-x-2 mt-1">
              {[10, 25, 50, 100].map(p => (
                <button key={p} type="button" onClick={() => handlePercent(p)} className="flex-1 text-xs py-1 bg-gray-100 dark:bg-[#2A2C36] rounded">{p}%</button>
              ))}
            </div>
          </div>

          {/* 총 주문 금액 */}
          <div className="text-right text-sm text-gray-500">
            총 주문 금액: <span className="font-medium">{total}</span> 원
          </div>
          {/* 주문 버튼 */}
          <button type="submit" className="w-full py-2 bg-green-500 text-white rounded font-medium">{side === 'buy' ? '매수' : '매도'} 주문</button>
        </>
      ) : (
        <>
          <div className="text-gray-400 text-sm">
              🧾 주문 내역 탭입니다. 여기에 내역 리스트 UI가 들어갈 수 있습니다.
          </div>
          <div style={{ textAlign: "center" }}>
            <h5>거래 내역</h5>
            <div className="flex flex-col gap-4 items-center">
              <ul>
                {myDealList.length > 0 ? myDealList.map((item, idx) => (
                  <li key={idx}>  
                  {item.deal_type === 3 ? "매수" : "매도"} / 예상 수수료:{item.deal_fee.toLocaleString()} / {item.deal_price.toLocaleString()}누렁 / {item.deal_cnt}개</li>
                )) : <p>거래 내역이 없습니다.</p>}
              </ul>
            </div>
          </div>
        </>
      )}
    </form>
  )
}