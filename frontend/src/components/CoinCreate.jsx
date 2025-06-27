import React, { useState, useContext,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {getIP, getNowDate, enter_chk} from '../components/Tool';

function CoinCreate() {
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

  const navigator = useNavigate(); // useNavigate Hook 사용, redirect 기능

  // submit 처리
  const send = (event) => {
    event.preventDefault(); // submit 기능 삭제

    const coin = {
      coin_name: name,
      coin_cate: cate,
      coin_price: price,
      coin_info: info,
      coin_percentage: 0.0,
    };

    const formData = new FormData();
    formData.append('coin', new Blob([JSON.stringify(coin)], { type: 'application/json' }));
    if (file) formData.append('file', file);

    
  // 먼저 코인 정보를 생성 (텍스트 정보만 POST)
  fetch(`http://${getIP()}:9093/coin/create`, {
    method: 'POST',
    body: formData,
  })
  .then(result => result.json())
  .then(result => {
    if (result.coin_no > 0 && file) {
      // 이미지가 있을 경우, coin_no를 포함해 이미지 업로드 요청
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      //uploadFormData.append("coin_no", result.coin_no);

      return fetch(`http://${getIP()}:9093/home/coin_img_upload`, {
        method: "POST",
        body: uploadFormData
      }).then(() => result); // 이미지 업로드 후 리턴
    } else {
      return result;
    }
  })
  .then(result => {
    if (result.coin_no > 0) {
      navigator('/coin/find_all');
    } else {
      alert('코인 등록에 실패했습니다. \n 다시 시도해주세요.');
    }
  })
  .catch(err => {
    console.error(err);
    alert("에러 발생");
  });
};

  return (
    <>
      <h3>새로운 코인 등록</h3>
      <form onSubmit={send} style={{margin: '10px auto', width: '50%', textAlign: 'left'}}>
        {/* mb-3: margin bottom 16x, mt-3: margin top 16px */}
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

        <div style={{textAlign: 'center'}}>
          <button id='btnSend' type="submit" className="btn btn-primary" style={{marginRight: '10px'}}>등록</button>  
          <button id='btnTest' type="button" className="btn btn-primary" onClick={test}>테스트 내용</button>
        </div>
      </form>
    </>
  )
}

export default CoinCreate;