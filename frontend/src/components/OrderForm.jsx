import React, { useState, useEffect } from 'react';
import { getIP } from "./Tool";
import { jwtDecode } from 'jwt-decode';

const FEE_RATE = 0.0005; // 수수료 비율 0.05%

// 수수료 계산 함수
const calculateFee = (price, quantity) => {
  const fee = price * quantity * FEE_RATE;
  return Math.max(Math.floor(fee), 1); // 최소 수수료 1원
};

// 총 주문 금액 계산 함수
const calculateTotal = (price, quantity, side) => {
  const baseAmount = price * quantity;
  const fee = calculateFee(price, quantity);
  return side === 'buy' ? baseAmount + fee : baseAmount - fee; // 매수면 수수료를 더하고, 매도면 수수료를 뺌
};

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
  // 1. state 선언
  const [type, setType] = useState('limit'); // 'limit' | 'market'
  const [side, setSide] = useState('buy');   // 'buy' | 'sell'
  const [price, setPrice] = useState(defaultPrice);
  const [quantity, setQuantity] = useState('');
  const [memberNo, setMemberNo] = useState(null);
  const [avgPrice, setAvgPrice] = useState(null); // 평단가
  const [totalPrice, setTotalPrice] = useState(null); // 평가금액
  const [profitAmount, setProfitAmount] = useState(null); // 평가손익
  const [profitPercentage, setProfitPercentage] = useState(null); // 수익률

  const jwt = sessionStorage.getItem("jwt");
  // const token = localStorage.getItem('token');
  const [myBalance, setMyBalance] = useState(0);       // buy
  const [myAmount, setMyAmount] = useState(0);         // sell
  const [myDealList, setMyDealList] = useState([]);    // list

  // 2. useEffect 선언

  // 호가창에서 선택한값으로 변경
  useEffect(() => {
    setPrice(defaultPrice);
    if (type === 'market') setType('limit');
  }, [defaultPrice]);

  // memberNo 세팅 및 잔고/수량/내역 fetch
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

  }, [jwt, side, coin_no]); // coin_no도 추가해야 안전!

  // 평단가 연결
  useEffect(() => {
    if (memberNo && coin_no) {
      fetch(`http://${getIP()}:9093/deal/get_one_asset/${memberNo}/${coin_no}`, {
        method: "GET",
        headers: { Authorization: jwt },
      })
        .then(res => res.json())
        .then(data => {
          setAvgPrice(data.avg_price ?? null); // 평단가
          setTotalPrice(data.total_price ?? null); // 평가금액
          setProfitAmount(data.profitAmount ?? null); // 평가손익
          setProfitPercentage(data.profitPercentage ?? null); // 수익률
        })
        .catch(err => {
          console.error(err);
          setAvgPrice(null);
          setTotalPrice(null);
          setProfitAmount(null);
          setProfitPercentage(null);
        });
    }
  }, [memberNo, coin_no, jwt]);

  // 3. 핸들러 함수

  // 수량 비율 설정 핸들러
  const handlePercent = percent => {
    if (side === 'buy') {
      // 가격, 보유금액이 유효한지 체크
      if (!price || isNaN(price) || !myBalance || isNaN(myBalance)) return;

      // 수수료 포함 실제 필요한 단가 계산 (가격 + 수수료)
      const effectivePrice = price * (1 + FEE_RATE);

      // 보유금액의 percent%만큼 사용할 때 구매 가능한 최대 수량 계산
      // 수수료 포함된 가격으로 나눔
      const qty = Math.floor(((myBalance * percent) / 100) / effectivePrice);
      setQuantity(qty);

    } else if (side === 'sell') {
      if (!myAmount || isNaN(myAmount)) return;
      // 보유 수량의 percent% 만큼 매도할 수량 설정
      const qty = Math.floor((myAmount * percent) / 100);
      setQuantity(qty);
    }
  };

  // 거래내역에서 취소 시
  const handleCancel = (dealNo, dealTpye) => {
    let endpoint = '';
    console.log("deal_no -> ", dealNo);
    console.log("dealTpye -> ", dealTpye);
    if (confirm('정말 해당 매매주문을 취소하시겠습니까?')) {
      if (dealTpye === 3) { // 매수 주문일 시
        endpoint = `http://${getIP()}:9093/deal/buydeal/cancel/${dealNo}`;
      } else if (dealTpye === 4) { // 매도 주문일 시
        endpoint = `http://${getIP()}:9093/deal/selldeal/cancel/${dealNo}`;
      }

      fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: jwt,
        },
      })
        .then(res => {
          if (res.ok) {
            alert("주문이 취소되었습니다.");
            setMyDealList(prev => prev.filter(item => item.deal_no !== dealNo));
          } else {
            throw new Error("주문 취소 실패!");
          }
        })
        .catch(err => {
          console.error(err);
          alert("거래 취소 중 오류가 발생했습니다.");
        });
    }
  };

  // 총 주문 금액 계산
  const total = type === 'market'
    ? '시가'
    : (price && quantity
      ? calculateTotal(parseFloat(price), parseFloat(quantity), side).toLocaleString()
      : 0);

  const fee = price && quantity
    ? calculateFee(parseFloat(price), parseFloat(quantity))
    : 0;

  // 주문 submit
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

  // 4. 렌더링 return
  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1E2028] min-w-[300px] min-h-[500px] max-h-[500px] rounded-lg p-4 shadow space-y-4">
      {/* 매수/매도/내역 탭 */}
      <div className="flex space-x-4">
        <button type="button" onClick={() => setSide('buy')} className={`${side === 'buy' ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-[#2A2C36] text-gray-500'} flex-1 py-2 rounded`}>매수</button>
        <button type="button" onClick={() => setSide('sell')} className={`${side === 'sell' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-[#2A2C36] text-gray-500'} flex-1 py-2 rounded`}>매도</button>
        <button type="button" onClick={() => setSide('list')} className={`${side === 'list' ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-[#2A2C36] text-gray-500'} flex-1 py-2 rounded`}>내역</button>
      </div>

      {side !== 'list' ? (
        <div>
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
              min="1"
              step="1"
              inputMode="numeric"
              pattern="[0-9]*"
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
          <div className="text-right text-sm text-gray-500 p-2">
            총 주문 금액: <span className="font-medium">{total}</span> 원
          </div>
          {/* 주문 버튼 */}
          <button type="submit" className="w-full py-2 bg-green-500 text-white rounded font-medium">{side === 'buy' ? '매수' : '매도'} 주문</button>

          {/* 평단가및 수익률 */}
          <div>
            <div className='text-left text-s mb-1'>보유코인</div>
            <div className='flex flex-col space-y-1'>
              <div className='flex justify-between'>
                <div className='text-xs text-gray-500'>평균매수가</div>
                <div className='text-xs text-gray-500'>
                  {avgPrice !== null ? avgPrice.toLocaleString() + " 누렁" : "-"}
                </div>
              </div>
              <div className='flex justify-between'>
                <div className='text-xs text-gray-500'>평가금액</div>
                <div className='text-xs text-gray-500'>
                  {totalPrice !== null ? totalPrice.toLocaleString() + " 누렁" : "-"}
                </div>
              </div>
              <div className='flex justify-between'>
                <div className='text-xs text-gray-500'>평가손익</div>
                <div className='text-xs text-gray-500'>
                  {profitAmount !== null ? profitAmount.toLocaleString() + " 누렁" : "-"}
                </div>
              </div>
              <div className='flex justify-between'>
                <div className='text-xs text-gray-500'>수익률</div>
                <div className='text-xs text-gray-500'>
                  {profitPercentage !== null ? profitPercentage.toFixed(1) + " %" : "-"}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-300 dark:border-gray-600 mt-1"></div>

          <div className='flex justify-between pt-1'>
            <div className='text-right text-xxs text-gray-500'>수수료: 총 주문 금액의 0.05% </div>
            <div className="text-right text-xs text-gray-500">
              예상 수수료: {fee.toLocaleString()} 원
            </div>
          </div>
        </div>
      ) : (

        <div>
          {/* 거래내역탭 */}
          <h5 className="text-lg font-semibold text-center mb-2">🧾 예약 내역</h5>
          <ul className="w-full max-h-[330px] overflow-y-auto flex flex-col gap-3">
            {myDealList.length > 0 ? myDealList.map((item, idx) => (
              <li
                key={idx}
                className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 rounded-lg shadow border border-gray-100"
              >
                <div className="flex flex-col text-left">
                  <span className={`text-xs font-bold ${item.deal_type === 3 ? 'text-red-500' : 'text-blue-500'}`}>
                    {item.deal_type === 3 ? "매수" : "매도"}
                  </span>
                  <span className="text-xs text-gray-700 font-mono">
                    {item.deal_price.toLocaleString()} <span className="font-normal">누렁</span>
                  </span>
                  <span className="text-xs text-gray-400">
                    수량: <span className="font-mono">{item.deal_cnt}</span>개
                  </span>
                </div>
                <button
                  className="ml-2 text-red-400 hover:text-red-700 font-bold text-xl"
                  title="주문 취소"
                  onClick={() => handleCancel(item.deal_no, item.deal_type)}
                >
                  ❌
                </button>
              </li>
            )) : (
              <li className="text-gray-400 py-8 text-center w-full">
                예약 내역이 없습니다.
              </li>
            )}
          </ul>
        </div>
      )}
    </form>
  )
}
