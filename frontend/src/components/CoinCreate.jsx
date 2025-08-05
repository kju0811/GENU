import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIP, getNowDate } from '../components/Tool';
import { CoinCategory } from './CoinCategory';
import ImageUpload from './ImageUpload';

export default function CoinCreate() {
  const [step, setStep] = useState(1);
  const [cateOpen, setCateOpen] = useState(false);
  const navigate = useNavigate();

  // Step1: 기본정보
  const [name, setName] = useState('');
  const [cate, setCate] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);

  // Step2: 상세정보
  const [info, setInfo] = useState('');

  // 스텝 이동
  const handleNext = () => {
    if (name && cate && price && file) setStep(2);
    else alert('모든 기본 정보를 입력하고 이미지를 업로드하세요.');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const coin = {
      coin_name: name,
      coin_cate: cate,
      coin_price: Number(price),
      coin_info: info,
      coin_percentage: 0,
      created_at: getNowDate()
    };
    const formData = new FormData();
    formData.append('coin', new Blob([JSON.stringify(coin)], { type: 'application/json' }));
    if (file) formData.append('file', file);

    const jwt = sessionStorage.getItem("jwt");

    try {
      const res = await fetch(`http://${getIP()}:9093/coin/create`, { 
        method: 'POST', 
        body: formData,
        headers: {
          Authorization: jwt,
        }, 
      });
      const result = await res.json();
      if (result.coin_no > 0) {
        alert('코인생성이 완료되었습니다.');
        navigate(`/coin/${result.coin_no}`);
      } else alert('등록 실패. 다시 시도하세요.');
    } catch (err) {
      alert('서버 오류 발생');
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-10">

        {/* Progress Bar + 단계명 */}
        <div className="flex justify-between items-center mb-10">
          {['기본정보', '상세정보'].map((label, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className={`
                w-9 h-9 flex items-center justify-center rounded-full mb-2 text-base font-bold transition-colors duration-500
                ${step - 1 >= i
                  ? (i === 2 ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white')
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}
              `}>
                {i + 1}
              </div>
              <span className={`text-xs md:text-sm font-semibold
                ${step - 1 >= i
                  ? (i === 2 ? 'text-green-600' : 'text-indigo-600')
                  : 'text-gray-500 dark:text-gray-400'}
              `}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: 기본정보 */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            {/* 이름 */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">코인 이름</label>
              <input
                type="text"
                className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 font-medium
                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-indigo-50 dark:focus:bg-gray-900 transition placeholder-gray-400"
                placeholder="예: 제누코인"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
              />
            </div>
            {/* 카테고리 */}
            <div className="relative">
              {/* 카테고리 드롭다운 */}
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">카테고리</label>
                <CoinCategory value={cate} onSelect={setCate} />
              </div>
            </div>
            {/* 가격 */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">시작 가격</label>
              <input
                type="number"
                className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 font-medium
                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-indigo-50 dark:focus:bg-gray-900 transition placeholder-gray-400"
                placeholder="50000"
                value={price}
                onChange={e => setPrice(e.target.value)}
              />
            </div>
            {/* 이미지 */}
            <div>
              <ImageUpload
                value={file}
                onChange={setFile}
                // originUrl={기존이미지 있으면 주소}
                // previewSize={96}
                label="이미지 업로드"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow transition"
              >
                상세정보 입력
              </button>
            </div>
          </div>
        )}

        {/* Step2: 상세 정보 */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">상세 정보</label>
              <textarea
                className="w-full h-44 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 font-medium
                focus:ring-2 focus:ring-green-500 focus:border-green-50 dark:focus:bg-gray-900 transition placeholder-gray-400 resize-none"
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
                className="px-7 py-3 font-semibold rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow"
              >
                이전으로
              </button>
              <button
                type="submit"
                className="px-7 py-3 font-semibold rounded-lg bg-green-500 hover:bg-green-600 text-white shadow transition"
              >
                등록하기
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
