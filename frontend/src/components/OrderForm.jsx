import React, { useState, useEffect } from 'react';
import { getIP } from "./Tool";
import { jwtDecode } from 'jwt-decode';

// 수수료 비율 상수
const FEE_RATE = 0.0005;

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
 * - 코인 주문(매수/매도/내역) 폼
 * - 내역탭: 미체결/체결 탭 분리
 */
export default function OrderForm({ coin_no, defaultPrice }) {
  // === [1] 상태 선언 ===
  // 주문 종류
  const [type, setType] = useState('limit');     // 'limit' | 'market'
  const [side, setSide] = useState('buy');       // 'buy' | 'sell' | 'list'
  // 내역탭 내부(미체결/체결) 소탭
  const [historyTab, setHistoryTab] = useState('pending'); // 'pending' | 'done'
  // 주문 정보
  const [price, setPrice] = useState(defaultPrice);
  const [quantity, setQuantity] = useState('');
  const [memberNo, setMemberNo] = useState(null);

  // 자산 정보
  const [avgPrice, setAvgPrice] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);
  const [profitAmount, setProfitAmount] = useState(null);
  const [profitPercentage, setProfitPercentage] = useState(null);

  // 내 잔고/보유수량/내역
  const [myBalance, setMyBalance] = useState(0);       // 매수시 사용
  const [myAmount, setMyAmount] = useState(0);         // 매도시 사용

  // 내역: 미체결(예약), 체결(완료) 리스트
  const [pendingList, setPendingList] = useState([]);  // 미체결(예약주문)
  const [doneList, setDoneList] = useState([]);        // 체결(실제매수/매도)

  // 토큰
  const jwt = sessionStorage.getItem("jwt");

  // === [2] useEffect: 가격/유형 바뀔 때 ===
  useEffect(() => {
    setPrice(defaultPrice);
    if (type === 'market') setType('limit');
  }, [defaultPrice]);

  // === [3] useEffect: 잔고/보유수량/내역 fetch ===
  useEffect(() => {
    try {
      const decoded = jwtDecode(jwt);
      const decodedMemberNo = decoded.member_no;
      setMemberNo(decodedMemberNo);

      let endpoint = '';
      let stateSetter;

      // 매수: 내 보유금액
      if (side === 'buy') {
        endpoint = `http://${getIP()}:9093/pay/my/${decodedMemberNo}`;
        stateSetter = setMyBalance;
      }
      // 매도: 내 보유 코인 수량
      else if (side === 'sell') {
        endpoint = `http://${getIP()}:9093/deal/get_total_cnt/${decodedMemberNo}/${coin_no}`;
        stateSetter = setMyAmount;
      }
      // 내역탭: 미체결/체결 각각 별도 fetch (아래서 별도 처리)
      else if (side === 'list') {
        return; // 여기선 아무것도 하지 않음
      }

      // fetch
      if (endpoint) {
        fetch(endpoint, {
          method: 'GET',
          headers: { 'Authorization': jwt }
        })
          .then(result => result.json())
          .then(data => stateSetter(data))
          .catch(() => stateSetter(0));
      }
    } catch (err) {
      setMyBalance(0);
      setMyAmount(0);
    }
  }, [jwt, side, coin_no]);

  // === [4] useEffect: 내역탭에서 미체결/체결 데이터 모두 fetch ===
  useEffect(() => {
    if (side !== 'list') return;
    try {
      const decoded = jwtDecode(jwt);
      const memberNo = decoded.member_no;

      // [1] 미체결(예약): deal_type=3,4
      fetch(`http://${getIP()}:9093/deal/find_deal_by_member_coin/${memberNo}/${coin_no}`, {
        method: 'GET',
        headers: { 'Authorization': jwt }
      })
        .then(res => res.json())
        .then(setPendingList)
        .catch(() => setPendingList([]));

      // [2] 체결(완료): deal_type=1,2
      fetch(`http://${getIP()}:9093/deal/find_confirmed_deal_by_member_coin/${memberNo}/${coin_no}`, {
        method: 'GET',
        headers: { 'Authorization': jwt }
      })
        .then(res => res.json())
        .then(setDoneList)
        .catch(() => setDoneList([]));
    } catch (err) {
      setPendingList([]);
      setDoneList([]);
    }
  }, [side, coin_no, jwt]);

  // === [5] useEffect: 평단가/평가금액/수익률 fetch ===
  useEffect(() => {
    if (memberNo && coin_no) {
      fetch(`http://${getIP()}:9093/deal/get_one_asset/${memberNo}/${coin_no}`, {
        method: "GET",
        headers: { Authorization: jwt },
      })
        .then(res => {
          if (!res.ok) {
            // 4xx / 5xx 응답 처리
            return null;
          }
          return res.json();
        })
        .then(data => {
          if (data) {
            setAvgPrice(data.avg_price ?? null);
            setTotalPrice(data.total_price ?? null);
            setProfitAmount(data.profitAmount ?? null);
            setProfitPercentage(data.profitPercentage ?? null);
          } else {
            // 서버 에러 응답 등
            setAvgPrice(null);
            setTotalPrice(null);
            setProfitAmount(null);
            setProfitPercentage(null);
          }
        })
        .catch(() => {
          setAvgPrice(null);
          setTotalPrice(null);
          setProfitAmount(null);
          setProfitPercentage(null);
        });
    }
  }, [memberNo, coin_no, jwt]);

  // === [6] 수량 비율 버튼 핸들러 ===
  const handlePercent = percent => {
    if (side === 'buy') {
      if (!price || isNaN(price) || !myBalance || isNaN(myBalance)) return;
      const effectivePrice = price * (1 + FEE_RATE);
      const qty = Math.floor(((myBalance * percent) / 100) / effectivePrice);
      setQuantity(qty);
    } else if (side === 'sell') {
      if (!myAmount || isNaN(myAmount)) return;
      const qty = Math.floor((myAmount * percent) / 100);
      setQuantity(qty);
    }
  };

  // === [7] 예약(미체결) 주문 취소 핸들러 ===
  const handleCancel = (dealNo, dealType) => {
    let endpoint = '';
    if (window.confirm('정말 해당 매매주문을 취소하시겠습니까?')) {
      if (dealType === 3) { // 예약매수
        endpoint = `http://${getIP()}:9093/deal/buydeal/cancel/${dealNo}`;
      } else if (dealType === 4) { // 예약매도
        endpoint = `http://${getIP()}:9093/deal/selldeal/cancel/${dealNo}`;
      }
      fetch(endpoint, {
        method: 'POST',
        headers: { Authorization: jwt }
      })
        .then(res => {
          if (res.ok) {
            alert("주문이 취소되었습니다.");
            setPendingList(prev => prev.filter(item => item.deal_no !== dealNo));
          } else {
            throw new Error("주문 취소 실패!");
          }
        })
        .catch(() => alert("거래 취소 중 오류가 발생했습니다."));
    }
  };

  // === [8] 주문 금액/수수료 계산 ===
  const total = type === 'market'
    ? '시가'
    : (price && quantity
      ? calculateTotal(parseFloat(price), parseFloat(quantity), side).toLocaleString()
      : 0);

  const fee = price && quantity
    ? calculateFee(parseFloat(price), parseFloat(quantity))
    : 0;

  // === [9] 주문 submit 핸들러 ===
  const handleSubmit = async e => {
    e.preventDefault();
    const dto = {
      coin: { coin_no: coin_no },
      member: { member_no: memberNo },
      price: type === 'market' ? defaultPrice : parseInt(price, 10),
      cnt: parseInt(quantity, 10),
    };
    try {
      if (side === "buy") {
        fetch(`http://${getIP()}:9093/deal/buydeal`, {
          method: 'POST',
          headers: {
            'Authorization': jwt,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dto)
        }).then(result => result.json())
          .then(data => {
            if (data.deal_no > 0) {
              alert('매수 주문 완료!');
              window.location.reload();
            } else {
              alert('매수 주문 실패. 다시 시도하세요.');
            }
          });
      } else if (side === "sell") {
        fetch(`http://${getIP()}:9093/deal/selldeal`, {
          method: 'POST',
          headers: {
            'Authorization': jwt,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dto)
        }).then(result => result.json())
          .then(data => {
            if (data.deal_no > 0) {
              alert('매도 주문 완료!');
              window.location.reload();
            } else {
              alert('매도 주문 실패. 다시 시도하세요.');
            }
          });
      }
    } catch {
      alert('서버 오류 발생');
    }
  };

  // === [10] 거래내역 리스트 렌더링 (재사용) ===
  const renderDealList = (list, isPending = false) => (
    <ul className="w-full max-h-[330px] overflow-y-auto flex flex-col gap-3">
      {list.length > 0 ? list.map((item, idx) => (
        <li
          key={idx}
          className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 rounded-lg shadow border border-gray-100"
        >
          <div className="flex flex-col text-left">
            <span className={`text-xs font-bold ${item.deal_type === 3 ? 'text-red-500'
                : item.deal_type === 4 ? 'text-blue-500'
                  : item.deal_type === 1 ? 'text-red-700'
                    : item.deal_type === 2 ? 'text-blue-700'
                      : ''
              }`}>
              {item.deal_type === 3
                ? "예약매수"
                : item.deal_type === 4
                  ? "예약매도"
                  : item.deal_type === 1
                    ? "매수"
                    : item.deal_type === 2
                      ? "매도"
                      : ""}
            </span>
            <span className="text-xs text-gray-700 font-mono">
              {item.deal_price.toLocaleString()} <span className="font-normal">누렁</span>
            </span>
            <span className="text-xs text-gray-600">
              수량: <span className="font-mono">{item.deal_cnt}</span>개
            </span>
            {/* 체결된 시간 */}
            {item.deal_date &&
              <span className="text-xxs text-gray-500 font-mono">
                {new Date(item.deal_date).toLocaleString("ko-KR", {
                  year: "2-digit", month: "2-digit", day: "2-digit",
                  hour: "2-digit", minute: "2-digit", second: "2-digit"
                })}
              </span>
            }
          </div>
          {/* 미체결(예약)만 취소 버튼 제공 */}
          {isPending && (
            <button
              className="ml-2 text-red-400 hover:text-red-700 font-bold text-xl"
              title="주문 취소"
              onClick={() => handleCancel(item.deal_no, item.deal_type)}
            >
              ❌
            </button>
          )}
        </li>
      )) : (
        <li className="text-gray-400 py-8 text-center w-full">
          내역이 없습니다.
        </li>
      )}
    </ul>
  );

  // === [11] 컴포넌트 렌더링 ===
  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1E2028] min-w-[300px] min-h-[500px] max-h-[500px] rounded-lg p-4 shadow space-y-4">
      {/* [A] 매수/매도/내역 탭 */}
      <div className="flex space-x-4">
        <button type="button" onClick={() => setSide('buy')} className={`${side === 'buy' ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-[#2A2C36] text-gray-500'} flex-1 py-2 rounded`}>매수</button>
        <button type="button" onClick={() => setSide('sell')} className={`${side === 'sell' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-[#2A2C36] text-gray-500'} flex-1 py-2 rounded`}>매도</button>
        <button type="button" onClick={() => setSide('list')} className={`${side === 'list' ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-[#2A2C36] text-gray-500'} flex-1 py-2 rounded`}>내역</button>
      </div>

      {/* [B] 주문/내역 분기 */}
      {side !== 'list' ? (
        // === 주문 영역 ===
        <div>
          {/* 주문유형(지정가/시장가) */}
          <div className="flex justify-center space-x-2 my-2 rounded">
            <button
              type="button"
              onClick={() => setType('limit')}
              className={`w-full text-sm py-2 rounded
                ${type === 'limit'
                  ? 'bg-gray-300 font-semibold shadow'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
              `}
            >
              지정가
            </button>
            <button
              type="button"
              onClick={() => setType('market')}
              className={`w-full text-sm py-2 rounded
                ${type === 'market'
                  ? 'bg-gray-300 font-semibold shadow'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
               `}
            >
              시장가
            </button>
          </div>

          {/* 잔고/보유수량 표시 */}
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

          {/* 가격 입력(지정가만) */}
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

          {/* 보유코인 정보(평단가, 평가금액, 수익률 등) */}
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

          {/* 수수료 안내 */}
          <div className="border-t border-gray-300 dark:border-gray-600 mt-1"></div>
          <div className='flex justify-between pt-1'>
            <div className='text-right text-xxs text-gray-500'>수수료: 총 주문 금액의 0.05% </div>
            <div className="text-right text-xs text-gray-500">
              예상 수수료: {fee.toLocaleString()} 원
            </div>
          </div>
        </div>
      ) : (
        // === 내역탭 영역 ===
        <div>
          {/* 미체결/체결 소탭 */}
          <div className="flex justify-center space-x-2 mb-4">
            <button
              type="button"
              className={`w-full text-sm py-2 rounded
                ${historyTab === 'pending'
                  ? 'bg-gray-300 font-bold'
                  : 'bg-gray-100 text-gray-500'}`}
              onClick={() => setHistoryTab('pending')}
            >
              미체결
            </button>
            <button
              type="button"
              className={`w-full text-sm py-2 rounded 
                ${historyTab === 'done'
                  ? 'bg-gray-300 font-bold'
                  : 'bg-gray-100 text-gray-500'}`}
              onClick={() => setHistoryTab('done')}
            >
              체결
            </button>
          </div>
          <h5 className="text-lg font-semibold text-center mb-2">
            {historyTab === 'pending' ? "🧾 예약 내역" : "✔️ 체결 내역"}
          </h5>
          {/* 내역 출력 */}
          {historyTab === 'pending'
            ? renderDealList(pendingList, true)
            : renderDealList(doneList, false)}
        </div>
      )}
    </form>
  );
}
