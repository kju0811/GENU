import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getIP } from '../components/Tool';
import axios from 'axios';

import { Link } from 'react-router-dom';
import CandleStickChart from "./CandleStickChart";

function CoinRead() {
  console.log('-> CoinRead');
  const navigate = useNavigate();
  const { coin_no } = useParams();

  const [data, setData] = useState(null);
  const [price, setPrice] = useState('');
  const [cnt, setCnt] = useState('');

  useEffect(() => {
    fetch(`http://${getIP()}:9093/coin/${coin_no}`, {
      method: 'GET'
    })
    .then(result => result.json())
    .then(data => {
      console.log("data -> ", data);
      setData(data);
    })
    .catch(err => console.error(err));
  }, [coin_no]);

  if (!data) return <div>Loading...</div>;

  const goBack = () => {
    navigate("/coin/find_all");
  };

  const update = () => {
    navigate(`/coin/update/${coin_no}`);
  };

  const getRequestBody = (type) => ({
    price: parseInt(price),
    cnt: parseInt(cnt),
    type: type,
    fee: 0,
    coin: data // 코인 전체 객체
  });

  const handleBuy = async () => {
    if (!price || !cnt) return alert("가격과 수량을 입력해주세요.");
    try {
      await axios.post(`http://${getIP()}:9093/buydeal`, getRequestBody(1));
      alert('매수 완료!');
      setPrice('');
      setCnt('');
    } catch (err) {
      console.error(err);
      alert('매수 실패!');
    }
  };

  const handleSell = async () => {
    if (!price || !cnt) return alert("가격과 수량을 입력해주세요.");
    try {
      await axios.post(`http://${getIP()}:9093/selldeal`, getRequestBody(2));
      alert('매도 완료!');
      setPrice('');
      setCnt('');
    } catch (err) {
      console.error(err);
      alert('매도 실패!');
    }
  };

  return (
    <>
      <img
        src={`http://${getIP()}:9093/home/storage/${data.coin_img}`}
        alt="home"
        style={{ maxWidth: '30%', height: 'auto', marginTop: '16px' }}
      />
      <h4>{data.coin_name}</h4>
      <div>
        정보 : {data.coin_info}
      </div>
      <div>
        카테고리 : {data.coin_cate}
      </div>
      <div>
        현재가 : {data.coin_price} 누렁 <br />{data.coin_percentage}%
      </div>

      <hr />

      <h5>거래하기</h5>
      <div>
        <label>가격: </label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>
      <div>
        <label>수량: </label>
        <input type="number" value={cnt} onChange={(e) => setCnt(e.target.value)} />
      </div>

      <div style={{ marginTop: '10px' }}>
        <button onClick={handleBuy} className="btn btn-success" style={{ marginRight: '10px' }}>매수</button>
        <button onClick={handleSell} className="btn btn-danger">매도</button>
      </div>

      <br />
      <button onClick={goBack} className="btn btn-sm btn-primary">목록</button>
      <button onClick={update} className="btn btn-sm btn-primary">코인 수정</button>

      <div style={{ marginTop: '20px' }}>
        <CandleStickChart coin_no={data.coin_no} days={30} />
      </div>
    </>
  );
}

export default CoinRead;
