import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIP, getNowDate } from '../components/Tool';
import { Dropdown } from './CoinComponents';

export default function CoinCreate() {
  const [step, setStep] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Step1: 기본정보
  const [name, setName] = useState('');
  const [cate, setCate] = useState('');
  const [price, setPrice] = useState('');
  const [img, setImg] = useState(null);
  const [imgURL, setImgURL] = useState(''); // 이미지 미리보기용

  // Step2: 상세정보
  const [info, setInfo] = useState('');

  // 이미지 프리뷰
  const handleImg = e => {
    const file = e.target.files[0];
    setImg(file);
    if (file) setImgURL(URL.createObjectURL(file));
    else setImgURL('');
  };

  // 스텝 이동
  const handleNext = () => {
    if (name && cate && price && img) setStep(2);
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
    if (img) formData.append('file', img);

    try {
      const res = await fetch(`http://${getIP()}:9093/coin/create`, { method: 'POST', body: formData });
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
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">카테고리</label>
              <button
                type="button"
                onClick={() => setDropdownOpen(prev => !prev)}
                className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 flex justify-between items-center focus:ring-2 focus:ring-indigo-400 transition"
              >
                <span className={cate ? "text-gray-900 dark:text-white" : "text-gray-400"}>{cate || '카테고리를 선택하세요'}</span>
                <svg className={`w-5 h-5 transition-transform ${dropdownOpen ? 'rotate-180' : ''} text-gray-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {/* 카테고리 드롭다운 */}
              {dropdownOpen && (
                <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-auto">
                  <Dropdown onSelect={cate => { setCate(cate); setDropdownOpen(false); }} />
                </ul>
              )}
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
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">코인 이미지 업로드</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImg}
                className="w-full file:rounded-lg file:bg-indigo-50 file:border-0 file:py-2 file:px-4 file:text-indigo-600 file:cursor-pointer"
              />
              {imgURL &&
                <div className="mt-2 flex justify-center">
                  <img src={imgURL} alt="preview" className="w-24 h-24 rounded-full object-cover border-2 border-indigo-400 shadow" />
                </div>
              }
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
