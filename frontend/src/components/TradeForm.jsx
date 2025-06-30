// TradeForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TradeForm = () => {
  const [coinList, setCoinList] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [price, setPrice] = useState('');
  const [cnt, setCnt] = useState('');

  // 1. 코인 목록 불러오기 (백엔드에서 coin list 제공해야 함)
  useEffect(() => {
    axios.get('http://localhost:9093/coin/list') // 이 URL은 백엔드에 맞게 수정
      .then((res) => setCoinList(res.data))
      .catch((err) => console.error('코인 목록 로딩 실패', err));
  }, []);

  // 2. 요청 바디 생성
  const getRequestBody = (type) => ({
    price: parseInt(price),
    cnt: parseInt(cnt),
    type: type, // 1 = 매수, 2 = 매도
    fee: 0,
    coin: selectedCoin,
  });

  // 3. 매수 요청
  const handleBuy = async () => {
    if (!selectedCoin || !price || !cnt) return alert('모든 값을 입력해주세요!');
    try {
      await axios.post('http://localhost:9093/buydeal', getRequestBody(1));
      alert('매수 완료!');
    } catch (err) {
      console.error(err);
      alert('매수 실패!');
    }
  };

  // 4. 매도 요청
  const handleSell = async () => {
    if (!selectedCoin || !price || !cnt) return alert('모든 값을 입력해주세요!');
    try {
      await axios.post('http://localhost:9093/selldeal', getRequestBody(2));
      alert('매도 완료!');
    } catch (err) {
      console.error(err);
      alert('매도 실패!');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
      <h2>코인 거래</h2>

      <div style={{ marginBottom: 10 }}>
        <label>코인 선택: </label>
        <select onChange={(e) => setSelectedCoin(JSON.parse(e.target.value))}>
          <option value="">-- 코인 선택 --</option>
          {coinList.map((coin) => (
            <option key={coin.coin_no} value={JSON.stringify(coin)}>
              {coin.coin_name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>가격: </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="가격"
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>수량: </label>
        <input
          type="number"
          value={cnt}
          onChange={(e) => setCnt(e.target.value)}
          placeholder="수량"
        />
      </div>

      <div>
        <button onClick={handleBuy} style={{ marginRight: 10 }}>매수</button>
        <button onClick={handleSell}>매도</button>
      </div>
    </div>
  );
};

export default TradeForm;
