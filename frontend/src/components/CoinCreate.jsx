import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIP, getNowDate } from '../components/Tool';
import { Dropdown } from './coinComponents';

const cateList = ['유틸리티', '디파이', '메타버스', 'NFT', '게임', '기타'];

export default function CoinCreate() {
  const [step, setStep] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Step1: 기본정보
  const [name, setName] = useState('');
  const [cate, setCate] = useState('');
  const [price, setPrice] = useState('');
  const [img, setImg] = useState(null);
  const [imgURL, setImgURL] = useState('');

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
      if (result.coin_no > 0) navigate(`/coin/${result.coin_no}`);
      else alert('등록 실패. 다시 시도하세요.');
    } catch (err) {
      alert('서버 오류 발생');
    }
  };

  return (
    <div className="min-w-[700px] min-h-[800px] w-full h-full my-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="relative w-full max-w-xl mx-auto p-8 rounded-3xl shadow-2xl bg-white/80 dark:bg-gray-800/70 backdrop-blur-2xl border border-gray-200 dark:border-gray-700">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex-1 flex items-center">
            <div className={`rounded-full w-9 h-9 flex items-center justify-center text-lg font-bold ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>1</div>
            <span className={`mx-2 h-1 w-12 rounded bg-gradient-to-r ${step === 2 ? 'from-indigo-600 to-green-400' : 'from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-700'}`}></span>
            <div className={`rounded-full w-9 h-9 flex items-center justify-center text-lg font-bold ${step === 2 ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>2</div>
          </div>
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500">{step === 1 ? '기본정보 입력' : '상세정보 입력'}</span>
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            {/* 이름 */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">코인 이름</label>
              <input type="text" className="w-full rounded-xl border-none bg-white/80 dark:bg-gray-700/80 p-3 shadow-inner focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                placeholder="예: 제누코인" value={name} onChange={e => setName(e.target.value)} autoFocus />
            </div>
            {/* 카테고리 */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">카테고리</label>
              <button type="button" onClick={() => setDropdownOpen(prev => !prev)}
                className="w-full rounded-xl bg-white/80 dark:bg-gray-700/80 p-3 flex justify-between items-center shadow-inner border border-gray-200 dark:border-gray-700 hover:ring-2 hover:ring-indigo-400 transition">
                <span className={cate ? "text-gray-900 dark:text-white" : "text-gray-400"}>{cate || '카테고리를 선택하세요'}</span>
                <svg className={`w-6 h-6 transition-transform ${dropdownOpen ? 'rotate-180' : ''} text-gray-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {/* 카테고리 드롭다운 */}
              {dropdownOpen && (
                <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-auto">
                  <Dropdown onSelect={cate => {
                    setCate(cate);
                    setDropdownOpen(false);
                  }} />
                </ul>
              )}
            </div>
            {/* 가격 */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">시작 가격</label>
              <input type="number" className="w-full rounded-xl border-none bg-white/80 dark:bg-gray-700/80 p-3 shadow-inner focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                placeholder="50000" value={price} onChange={e => setPrice(e.target.value)} />
            </div>
            {/* 이미지 */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">코인 이미지 업로드</label>
              <input type="file" accept="image/*" onChange={handleImg} className="w-full file:rounded-xl file:bg-indigo-50 file:border-0 file:py-2 file:px-4 file:text-indigo-600 file:cursor-pointer" />
              {/* 썸네일 */}
              {imgURL &&
                <div className="mt-2">
                  <img src={imgURL} 
                  alt="preview" 
                  className="w-24 h-24 rounded-full object-cover" />
                </div>
              }
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={handleNext}
                className="px-8 py-3 font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow transition">
                상세정보 입력
              </button>
            </div>
          </div>
        )}

        {/* 상세정보 */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">상세 정보</label>
              <textarea className="w-full h-44 rounded-xl border-none bg-white/80 dark:bg-gray-700/80 p-3 shadow-inner focus:ring-2 focus:ring-green-500 focus:outline-none transition resize-none"
                placeholder="코인에 대한 자세한 설명을 입력하세요." value={info} onChange={e => setInfo(e.target.value)} required />
            </div>
            <div className="flex justify-between space-x-4">
              <button type="button" onClick={() => setStep(1)}
                className="px-7 py-3 font-semibold rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow">
                이전으로
              </button>
              <button type="submit"
                className="px-7 py-3 font-semibold rounded-xl bg-green-500 hover:bg-green-600 text-white shadow transition">
                등록하기
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
