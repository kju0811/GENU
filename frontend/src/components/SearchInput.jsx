import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getIP } from "../components/Tool";

/**
 * SearchInput 컴포넌트
 * - 사용자가 입력한 검색어를 기반으로 자동완성 결과를 표시합니다.
 * - 최근 검색어 기록 및 결과 없음을 핸들링합니다.
 */
export default function SearchInput() {
  /**
   * 입력값 관리
   */
  const [input, setInput] = useState('');
  /**
   * 필터링된 결과 목록
   */
  const [results, setResults] = useState([]);
  /**
   * 드롭다운 노출 여부
   */
  const [showDropdown, setShowDropdown] = useState(false);
  /**
   * 검색 로딩 상태
   */
  const [loading, setLoading] = useState(false);
  /**
   * 최근 검색어 목록 (최대 3개)
   */
  const [recentSearches, setRecentSearches] = useState([]);
  /**
   * 검색 결과 없음 표시 플래그
   */
  const [noResults, setNoResults] = useState(false);

  // 입력 필드 및 전체 컨테이너에 대한 참조 (외부 클릭 감지용)
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  /**
   * 외부 클릭 시 드롭다운 닫기
   */
  useEffect(() => {
    const handleClickOutside = event => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  /**
   * 입력값 변경 시: 디바운스(300ms) 후 데이터 필터링
   */
useEffect(() => {
  if (input === '') {
    setResults([]);
    setNoResults(false);
    return;
  }

  const timer = setTimeout(() => {
    setLoading(true);

    const url = `http://${getIP()}:9093/coin/find_by_name_or_info?keyword=${encodeURIComponent(input)}`;

    fetch(url, {
      method: 'GET'
    })
      .then(res => res.json())
      .then(data => {
        setResults(data); // ← 백엔드 응답 데이터로 검색 결과 설정
        setNoResults(data.length === 0);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        setResults([]);
        setNoResults(true);
      });
  }, 300);

  return () => clearTimeout(timer);
}, [input]);


  /**
   * 검색 결과 선택 시 호출
   * - 입력값 업데이트
   * - 드롭다운 닫기
   * - 최근 검색어 기록에 추가
   */
  const selectResult = name => {
    setInput(name);
    setShowDropdown(false);
    if (!recentSearches.includes(name)) {
      setRecentSearches(prev => [name, ...prev.slice(0, 2)]);
    }
  };

  /**
   * 입력 필드 클리어 버튼 클릭 시 호출
   * - 입력값 초기화, 결과 및 상태 초기화
   * - 입력 필드에 포커스 유지
   */
  const clearInput = () => {
    setInput('');
    setResults([]);
    setNoResults(false);
    setShowDropdown(false);
    inputRef.current.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-lg">
      {/* 검색 입력 필드 및 아이콘, 클리어 버튼, 로딩 스피너 */}
      <div className="relative shadow-sm rounded-lg">
        {/* 검색어 입력 */}
        <input
          type="text"
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          className="w-full h-10 bg-white dark:bg-[#1E2028] border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-10 text-sm text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          placeholder="Search..."
          autoComplete="off"
        />
        {/* 검색 아이콘 */}
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {/* 돋보기 SVG */}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        {/* 클리어 버튼 (input이 있을 때만 표시) */}
        {input && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={clearInput}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400"
          >
            {/* X 아이콘 */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        {/* 로딩 스피너 */}
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="animate-spin h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </span>
        )}
      </div>

      {/* 드롭다운: 최근 검색어 또는 검색 결과 표시 */}
      {showDropdown && (input || recentSearches.length > 0) && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-[#1E2028] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          {/* 최근 검색어 섹션 */}
          {recentSearches.length > 0 && (
            <>
              <div className="p-2 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
                Recent Searches
              </div>
              <ul className="max-h-32 overflow-auto">
                {recentSearches.map((search, index) => (
                  <li key={index}>
                    <button
                      onClick={() => selectResult(search)}
                      className="w-full text-left px-3 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                    >
                      {/* 시계 아이콘 */}
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {search}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-200 dark:border-gray-700"></div>
            </>
          )}

          {/* 검색 결과 섹션 */}
          <div className="p-2 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
            Search Results
          </div>
          {noResults ? (
            // 결과 없음 표시
            <div className="py-8 text-center">
              <svg className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No results found</p>
            </div>
          ) : (
            <ul className="max-h-64 overflow-auto pb-1">
              {/* 필터링된 결과 리스트 */}
              {results.map(result => (
                <li key={result.coin_no}>
                  <Link
                    to={`/coin/${result.coin_no}`}
                    onClick={() => selectResult(result.coin_name)} // recentSearches 기록 등은 그대로 유지
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between group"
                  >
                    {/* 아이콘 및 결과 텍스트 영역 */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10">
                        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-black dark:text-white">{result.coin_name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{result.coin_cate}</div>
                      </div>
                    </div>
                    {/* 우측 매칭률 및 화살표 (호버 시 표시) */}
                    <div className="hidden group-hover:flex items-center gap-2">
                      <span className="text-xs text-gray-400">{result.popularity}% match</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}