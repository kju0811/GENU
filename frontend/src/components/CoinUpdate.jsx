import React, { useState, useEffect } from 'react';
import { getIP, enter_chk } from '../components/Tool';
import { useNavigate, useParams } from 'react-router-dom';
import { CoinCategory } from './CoinCategory';

function CoinUpdate() {
  // 1. 라우팅 등 최상단 훅
  const navigate = useNavigate();
  const { coin_no } = useParams();

  // 2. 상태 선언부 (최상단)
  const [data, setData] = useState(null);
  const [name, setName] = useState('');
  const [cate, setCate] = useState('');
  const [info, setInfo] = useState('');
  const [file, setFile] = useState(null);

  // 3. 이벤트 핸들러 함수 (상태 변화/액션 처리)
  const handleNameChange = (e) => setName(e.target.value);
  const handleInfoChange = (e) => setInfo(e.target.value);
  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleCancel = () => navigate(`/coin/${coin_no}`);

  // 4. 데이터 로드 (useEffect 등 사이드이펙트)
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

  // 5. 로딩 처리
  if (!data) return null;

  // 6. 폼 제출 (핸들러)
  const handleSubmit = (e) => {
    e.preventDefault();

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
        if (!response.ok) throw new Error(`서버 응답 오류: ${response.status}`);
        return response.text();
      })
      .then(text => {
        if (text) JSON.parse(text);
        navigate(`/coin/${coin_no}`);
      })
      .catch(err => {
        console.error(err);
        alert("코인 수정 중 에러가 발생했습니다.");
      });
  };

  // 7. 렌더링 (JSX)
  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-10">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">코인 수정</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 코인 이름 */}
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
            onChange={handleNameChange}
            value={name}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {/* 카테고리 */}
        <div>
          <label htmlFor="coin_cate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            카테고리
          </label>
          <CoinCategory value={cate} onSelect={setCate} />
        </div>
        {/* 정보 */}
        <div>
          <label htmlFor="coin_info" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            정보
          </label>
          <textarea
            id="coin_info"
            name="info"
            placeholder="정보"
            onChange={handleInfoChange}
            value={info}
            rows={8}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {/* 이미지 파일 */}
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            이미지 파일
          </label>
          <input
            id="file"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-gray-700 dark:text-gray-300"
          />
        </div>
        {/* 버튼 */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition"
          >
            저장
          </button>
          <button
            type="button"
            onClick={handleCancel}
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
