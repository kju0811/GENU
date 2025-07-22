// CoinComponents.js
import React from "react";

const categories = [
  'NFT', '밈 코인', 'AI 코인', '플랫폼 코인', '스테이블 코인', '기모링 코인',
  '게이밍 코인', '의료 코인', '기타 코인'
];

export function Dropdown({ onSelect, showNoneOption = false }) {
  return (
    <ul className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm" style={{ width: '120%' }}>
      {showNoneOption && (
        <li>
          <button type="button" onClick={() => onSelect("선택하지 않음")} className="w-full text-center py-2">선택하지 않음</button>
        </li>
      )}
      {categories.map(cate => (
        <li key={cate}>
          <button type="button" onClick={() => onSelect(cate)} className="w-full text-center py-2">
            {cate}
          </button>
        </li>
      ))}
    </ul>
  );
}
