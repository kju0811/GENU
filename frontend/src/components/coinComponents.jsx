import React, { useState, useRef, useEffect } from "react";

const categories = [
  "NFT", "밈 코인", "AI 코인", "플랫폼 코인", "스테이블 코인",
  "기모링 코인", "게이밍 코인", "의료 코인", "기타 코인"
];

export function Dropdown({ value, onSelect, showNoneOption = false }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (selected) => {
    onSelect(selected);
    setOpen(false);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 flex justify-between items-center focus:ring-2 focus:ring-indigo-400 transition"
      >
        <span className={value ? "text-gray-900 dark:text-white" : "text-gray-400"}>
          {value || "카테고리를 선택하세요"}
        </span>
        <svg
          className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""} text-gray-400`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-auto">
          {showNoneOption && (
            <li>
              <button
                type="button"
                onClick={() => handleSelect("선택하지 않음")}
                className="w-full text-left px-4 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-800"
              >
                선택하지 않음
              </button>
            </li>
          )}
          {categories.map((cate) => (
            <li key={cate}>
              <button
                type="button"
                onClick={() => handleSelect(cate)}
                className="w-full text-left px-4 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-800"
              >
                {cate}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
