import React, { useEffect, useState } from 'react';
import { getIP } from '../components/Tool';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Pagination from 'react-js-pagination';

export default function Mindfind() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const size = 6;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);

  const jwt = sessionStorage.getItem('jwt');
  let userInfo = null;
  if (jwt) {
    try {
      userInfo = jwtDecode(jwt);
    } catch (err) {
      console.error('JWT 디코딩 오류:', err);
    }
  }

  const member_no = userInfo?.member_no;

  useEffect(() => {
    const pageParam = parseInt(searchParams.get('page')) || 1;
    setPage(pageParam);

    fetch(`http://${getIP()}:9093/mind/find_all`)
      .then(res => res.json())
      .then(result => {
        setData(result);
      })
      .catch(err => console.error(err));
  }, []);

  const userMindData = data.filter(item => item.member?.member_no === member_no);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
    setSearchParams({ page: pageNumber });
  };

  const indexOfLast = page * size;
  const indexOfFirst = indexOfLast - size;
  const currentItems = userMindData.slice(indexOfFirst, indexOfLast);

  return (
    <div className="px-4 sm:px-8 lg:px-16 py-6 relative">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/mypage/memberMind')}
          className="text-indigo-600 hover:underline text-sm"
        >
          ← MyPage로 돌아가기
        </button>
        <div
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="relative text-sm text-gray-500 cursor-pointer"
        >
          💡심리 분석 등급표 보기
          {showTooltip && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-sm z-50 text-left">
              <h3 className="font-bold text-red-600 mb-2">📊 심리 분석 등급표</h3>
              <ul className="space-y-2">
                <li><span className="text-red-500">🤑 S등급</span>: 초공격형 (자산 70% 이상 집중 매수)</li>
                <li><span className="text-orange-500">⚔️ A등급</span>: 공격형 (40~70% 단기 투입)</li>
                <li><span className="text-yellow-500">⚖️ B등급</span>: 적극형 (20~40% 분할 매수)</li>
                <li><span className="text-green-500">🌱 C등급</span>: 안정추구형 (10~20% 분산 매수)</li>
                <li><span className="text-blue-500">🧊 D등급</span>: 보수형 (매수 거의 없음)</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {!jwt ? (
        <div className="text-center mt-20 text-gray-500">로그인 후 이용해주세요.</div>
      ) : userMindData.length === 0 ? (
        <div className="text-center mt-20 text-gray-500">심리 분석 결과가 없습니다.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((item) => (
              <article
                key={item.mindno}
                onClick={() => navigate(`/mindread/${item.mindno}`)}
                className="cursor-pointer rounded-xl overflow-hidden bg-gray-50 dark:bg-[#252731] transition-transform hover:scale-[1.02] shadow p-5 flex flex-col justify-between"
              >
                <div className="text-sm text-gray-400 mb-2 flex justify-between items-center">
                  <span className="px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-500">분석</span>
                  <span>{item.minddate}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 whitespace-pre-line">
                  {item.mindcontent.length > 150
                    ? `${item.mindcontent.slice(0, 150)}...`
                    : item.mindcontent}
                </p>
                <div className="flex justify-end items-center text-sm text-indigo-600 font-medium">
                  🧠 AI 심리 분석 결과
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 py-5 flex justify-center gap-2">
            <Pagination
              innerClass="flex justify-center mt-4 gap-2"
              itemClass="rounded-lg"
              linkClass="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-200 text-sm rounded-lg"
              activeClass="bg-sky-500 text-white border-sky-500 rounded-lg"
              activePage={page}
              itemsCountPerPage={size}
              totalItemsCount={userMindData.length}
              pageRangeDisplayed={5}
              onChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}