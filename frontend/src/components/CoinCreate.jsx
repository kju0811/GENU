import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIP, getNowDate } from '../components/Tool';

/**
 * CreateCoin 컴포넌트
 * - 모달 창으로 CoinCreate 폼을 표시합니다.
 * @param {{ isOpen: boolean, onClose: () => void }} props
 */
export default function CoinCreate({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [info, setInfo] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const categories = ['DeFi','NFT','Stablecoin','Exchange Token','Utility Token','Gaming','Governance'];

  const handleNext = () => {
    if (name && category && price && imageFile) setStep(2);
    else alert('모든 기본 정보를 입력하고 이미지를 업로드하세요.');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('coin_name', name);
    formData.append('coin_cate', category);
    formData.append('coin_price', price);
    formData.append('coin_img', imageFile);
    formData.append('coin_info', info);
    formData.append('coin_percentage', 0);
    formData.append('created_at', getNowDate());

    try {
      const res = await fetch(`http://${getIP()}:9093/coin/create`, { method: 'POST', body: formData });
      const result = await res.json();
      if (result.coin_no > 0) {
        onClose();
        navigate(`/coin/${result.coin_no}`);
      } else alert('등록 실패. 다시 시도하세요.');
    } catch (err) {
      console.error(err);
      alert('서버 오류 발생');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      {/* 모달 컨테이너 */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-3xl mx-4 overflow-auto max-h-full">
        {/* 헤더 */}
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">새로운 코인 등록</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            ×
          </button>
        </div>
        <div className="p-6 space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              {/* 코인 이름 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">코인 이름</label>
                <input type="text" className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3" placeholder="비트코인" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              {/* 카테고리 드롭다운 */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">카테고리</label>
                <button type="button" onClick={() => setDropdownOpen(prev => !prev)} className="mt-1 w-full text-left rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 flex justify-between items-center">
                  <span>{category || '카테고리를 선택하세요'}</span>
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                </button>
                {dropdownOpen && (
                  <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-auto">
                    {categories.map(cat => (
                      <li key={cat}><button type="button" onClick={() => {setCategory(cat); setDropdownOpen(false);}} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">{cat}</button></li>
                    ))}
                  </ul>
                )}
              </div>
              {/* 시작 가격 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">시작 가격</label>
                <input type="number" className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3" placeholder="50000" value={price} onChange={e => setPrice(e.target.value)} required />
              </div>
              {/* 이미지 업로드 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">코인 이미지 업로드</label>
                <input type="file" accept="image/*" className="mt-1" onChange={e => setImageFile(e.target.files[0])} required />
                {imageFile && <p className="mt-2 text-sm text-green-600">{imageFile.name} 선택됨</p>}
              </div>
              <div className="flex justify-end">
                <button onClick={handleNext} className="px-6 py-3 bg-indigo-600 text-white rounded-md">상세정보 입력</button>
              </div>
            </div>
          )}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">상세 정보</label>
                <textarea className="mt-1 w-full h-40 rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3" placeholder="코인에 대한 설명" value={info} onChange={e => setInfo(e.target.value)} required />
              </div>
              <div className="flex justify-between">
                <button type="button" onClick={() => setStep(1)} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md">이전으로</button>
                <button type="submit" className="px-6 py-3 bg-green-600 text-white rounded-md">등록하기</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}