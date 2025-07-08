import React, { useState, useEffect } from 'react';
import { getIP,enter_chk } from '../components/Tool';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function CoinUpdate() {
  console.log('-> CoinUpdate');
  
  const navigate = useNavigate();
  const { coin_no } = useParams();
  const [data, setData] = useState(null);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [cate, setCate] = useState('');
  const [info, setInfo] = useState('');
  const [file, setFile] = useState(null);

  const nameChange = (e) => { setName(e.target.value); }
  const priceChange = (e) => { setPrice(e.target.value); }
  const cateChange = (e) => { setCate(e.target.value); }
  const infoChange = (e) => { setInfo(e.target.value); }

  const test = () => {
    setName('테스트이름');
    setPrice(5000);
    setCate('테스트카테');
    setInfo('테스트 정보입니다.');
  }

  const cancel = () => {
    navigate(`/coin/${coin_no}`);
  };

  // 초기 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://${getIP()}:9093/coin/${coin_no}`, {
          method: 'GET'
        });
        if (!response.ok) {
          alert('코인 조회에 실패했습니다.\n다시 시도해주세요.');
          return;
        }
        const result = await response.json();
        console.log(result)
        setData(result);

        setName(result.coin_name);
        setPrice(result.coin_price);
        setCate(result.coin_cate);
        setInfo(result.coin_info);
      } catch (err) {
        console.error(err);
        alert('네트워크 오류가 발생했습니다.\n다시 시도해주세요.');
      }
    };
    fetchData();
  }, [coin_no]);

  if (!data) return null;

  // 수정 처리
  const send = (event) => {
    event.preventDefault(); // submit 기능 삭제

    const coin = {
      coin_name: name,
      coin_cate: cate,
      coin_price: price,
      coin_info: info,
      coin_percentage: data.coin_percentage,
    };

    const formData = new FormData();
    formData.append('coin', new Blob([JSON.stringify(coin)], { type: 'application/json' }));
    if (file) formData.append('file', file);

    
    // 먼저 코인 정보를 생성 (텍스트 정보만 POST)
    fetch(`http://${getIP()}:9093/coin/update/${coin_no}`, {
      method: 'POST',
      body: formData,
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }
      // 백엔드가 ResponseEntity.ok().build()로 빈 바디를 반환하므로
      // JSON 파싱 시 에러 방지를 위해 텍스트로 받아 빈 문자열인지 확인
      return response.text();
    })
    .then(text => {
      if (text) {
        // 만약 JSON 데이터가 들어오면 파싱
        return JSON.parse(text);
      }
      // 빈 응답일 때는 적절히 처리 (여기선 그냥 true 반환)
      return true;
    })
    .then(result => {
      // 백엔드가 실제 데이터 반환하지 않으니, result가 true면 성공으로 처리
      navigate(`/coin/${coin_no}`);
    })
    .catch(err => {
      console.error(err);
      alert("코인 수정 중 에러가 발생했습니다.");
    });
  };

  return (
    <>
      <h3>코인 수정</h3>
      <form onSubmit={send} style={{ margin: '10px auto', width: '50%', textAlign: 'left' }}>
        <div className="mb-3 mt-3"> 
          <label className="form-label">코인 이름:</label>
          <input type="text" className="form-control" id="coin_name" placeholder="이름" name="name" autoFocus='autoFocus' 
                  onKeyDown={e => enter_chk(e, 'cate')} onChange={nameChange} value={name} />
        </div>
        <div className="mb-3">
          <label className="form-label">카테고리:</label>
          <input type="text" className="form-control" id="coin_cate" placeholder="카테고리" name="cate" 
                    onKeyDown={e => enter_chk(e, 'price')} onChange={cateChange} value={cate} />
        </div>
        <div className="mb-3">
          <label className="form-label">가격:</label>
          <input type="text" className="form-control" id="coin_price" placeholder="가격" name="price" 
                    onKeyDown={e => enter_chk(e, 'info')} onChange={priceChange} value={price} />
        </div>
        <div className="mb-3">
          <label className="form-label">정보:</label>
          <textarea className="form-control" id="coin_info" placeholder="정보" name="info" 
                    onChange={infoChange} value={info} style={{width: "100%", height: "300px"}} />
        </div>
        {/* 여기에 이미지 추가 */}
        <div className="mb-3">
          <label className="form-label">이미지 파일:</label>
          <input type="file" className="form-control" onChange={(e) => { setFile(e.target.files[0]);}} accept="image/*" />
        </div>

        <div style={{ textAlign: 'center' }}>
          <button type="submit" className="btn btn-primary" style={{ marginRight: '5px' }}>저장</button>
          <button type="button" className="btn btn-secondary" style={{ marginRight: '5px' }} onClick={test}>
            테스트 내용
          </button>
          <button type="button" className="btn btn-light" onClick={cancel}>취소</button>
        </div>
      </form>
    </>
  ) 
}
export default CoinUpdate;