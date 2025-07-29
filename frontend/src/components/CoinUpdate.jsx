import React, { useState, useEffect } from 'react';
import { getIP, enter_chk } from '../components/Tool';
import { useNavigate, useParams } from 'react-router-dom';
import { Dropdown } from './CoinComponents';

function CoinUpdate() {
  const navigate = useNavigate();
  const { coin_no } = useParams();
  const [data, setData] = useState(null);

  const [name, setName] = useState('');
  const [cate, setCate] = useState('');
  const [info, setInfo] = useState('');
  const [file, setFile] = useState(null);

  const nameChange = (e) => { setName(e.target.value); };
  const cateChange = (e) => { setCate(e.target.value); };
  const infoChange = (e) => { setInfo(e.target.value); };

  const cancel = () => {
    navigate(`/coin/${coin_no}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://${getIP()}:9093/coin/${coin_no}`, { method: 'GET' });
        if (!response.ok) {
          alert('코인 조회에 실패했습니다.\n다시 시도해주세요.');
          return;
        }
        const result = await response.json();
        setData(result);
        setName(result.coin_name);
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

  const send = (event) => {
    event.preventDefault();

    const coin = {
      coin_name: name,
      coin_cate: cate,
      coin_info: info,
      coin_percentage: data.coin_percentage,
    };

    const formData = new FormData();
    formData.append('coin', new Blob([JSON.stringify(coin)], { type: 'application/json' }));
    if (file) formData.append('file', file);

    fetch(`http://${getIP()}:9093/coin/update/${coin_no}`, {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`서버 응답 오류: ${response.status}`);
        }
        return response.text();
      })
      .then(text => {
        if (text) return JSON.parse(text);
        return true;
      })
      .then(() => {
        navigate(`/coin/${coin_no}`);
      })
      .catch(err => {
        console.error(err);
        alert("코인 수정 중 에러가 발생했습니다.");
      });
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-10">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">코인 수정</h3>
      <form onSubmit={send} className="space-y-6">
        <div>
          <label htmlFor="coin_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            코인 이름
          </label>
          <input
            id="coin_name"
            name="name"
            type="text"
            autoFocus
            placeholder="이름"
            onKeyDown={e => enter_chk(e, 'cate')}
            onChange={nameChange}
            value={name}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="coin_cate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            카테고리
          </label>
          <Dropdown value={cate} onSelect={setCate} />
        </div>

        <div>
          <label htmlFor="coin_info" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            정보
          </label>
          <textarea
            id="coin_info"
            name="info"
            placeholder="정보"
            onChange={infoChange}
            value={info}
            rows={8}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            이미지 파일
          </label>
          <input
            id="file"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full text-gray-700 dark:text-gray-300"
          />
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition"
          >
            저장
          </button>
          <button
            type="button"
            onClick={cancel}
            className="px-6 py-2 border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default CoinUpdate;
