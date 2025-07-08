import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIP, getNowDate } from '../components/Tool';

/**
 * CoinCreate 페이지 컴포넌트
 */
export default function CoinCreate() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [cate, setCate] = useState('');
  const [price, setPrice] = useState('');
  const [img, setImg] = useState(null);
  const [info, setInfo] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const categories = [
    'NFT', '밈 코인', 'AI 코인', '플랫폼 코인', '스테이블 코인', '기모링 코인',
    '게이밍 코인', '의료 코인', '기타 코인'
  ];

  const handleNext = () => {
    if (name && cate && price && img) {
      setStep(2);
    } else {
      alert('모든 기본 정보를 입력하고 이미지를 업로드하세요.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 서버가 기대하는 형식: 'coin' JSON 블랍과 'file' multipart
    const coin = {
      coin_name: name,
      coin_cate: cate,
      coin_price: Number(price),
      coin_info: info,
      coin_percentage: 0,
      created_at: getNowDate()
    };

    const formData = new FormData();
    formData.append(
      'coin',
      new Blob([JSON.stringify(coin)], { type: 'application/json' })
    );
    if (img) {
      formData.append('file', img);
    }

    try {
      const res = await fetch(`http://${getIP()}:9093/coin/create`, {
        method: 'POST',
        body: formData
      });
      const result = await res.json();
      if (result.coin_no > 0) {
        navigate(`/coin/${result.coin_no}`);
      } else {
        alert('등록 실패. 다시 시도하세요.');
      }
    } catch (err) {
      console.error(err);
      alert('서버 오류 발생');
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">새로운 코인 등록</h2>

      {/* Step 1: 기본 정보 */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">코인 이름</label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="예: 제누코인"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">카테고리</label>
            <button
              type="button"
              onClick={() => setDropdownOpen(prev => !prev)}
              className="mt-1 w-full text-left rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 flex justify-between items-center focus:ring-indigo-500 focus:border-indigo-500"
            >
              <span>{cate || '카테고리를 선택하세요'}</span>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
            </button>
            {dropdownOpen && (
              <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-auto">
                {categories.map(cat => (
                  <li key={cat}>
                    <button
                      type="button"
                      onClick={() => { setCate(cat); setDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">시작 가격</label>
            <input
              type="number"
              className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="50000"
              value={price}
              onChange={e => setPrice(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">코인 이미지 업로드</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setImg(e.target.files[0])}
              className="mt-1"
              required
            />
            {img && <p className="mt-2 text-sm text-green-600">{img.name} 선택됨</p>}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              상세정보 입력
            </button>
          </div>
        </div>
      )}

      {/* Step 2: 상세 정보 입력 */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">상세 정보</label>
            <textarea
              className="mt-1 w-full h-40 rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="코인에 대한 자세한 설명을 입력하세요."
              value={info}
              onChange={e => setInfo(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between space-x-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              이전으로
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              등록하기
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
