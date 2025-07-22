import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { getIP } from '../components/Tool';
import genuImg from '../images/genu.png';

const PAGE_SIZE = 10;

function CoinList() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(0); // 페이지 번호 (0, 1, 2, ...)
  const [sortType, setSortType] = useState('price'); // 'price' 또는 'percentage' 순으로 정렬

  useEffect(() => {
    const url = sortType === 'price'
        ? `http://${getIP()}:9093/coin/find_price_desc`
        : `http://${getIP()}:9093/coin/find_percentage_desc`;
    fetch(url, {
      method: 'GET' 
    })
      .then(result => result.json())
      .then(data => setData(data))
      .catch(err => console.error(err));
  }, [sortType]);

  // 페이지 GLOBALCONTEXT사용
  useEffect(() => {
    sessionStorage.setItem('nextIndex', page);
  }, [page]);

  if (!data) return null;

  // 현재 페이지에 보여줄 데이터 슬라이스
  const startIndex = page * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentPageData = data.slice(startIndex, endIndex);

  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  

  return (
    <main className="w-[90%] mx-auto p-4">
    <div className="max-w-7xl w-full mx-auto p-4">
      <div className="flex flex-col gap-4">

        {/* 컬럼명(헤더) */}
        <div className="flex items-center gap-4 px-4 pb-2 text-gray-500 text-sm border-b">
          <div className="w-24"></div> {/* 이미지 칸 */}
          <div className="flex-1 font-semibold">종목</div>
          <div
              onClick={() => { setSortType('price'); setPage(0); }}
              className={`flex-1 font-semibold ml-3 cursor-pointer select-none ${
                sortType === 'price' ? 'text-blue-600 underline' : ''
              }`}
            >
              현재가
            </div>
            <div
              onClick={() => { setSortType('percentage'); setPage(0); }}
              className={`flex-1 font-semibold cursor-pointer select-none ${
                sortType === 'percentage' ? 'text-blue-600 underline' : ''
              }`}
            >
              등락률
            </div>
          <div className="w-24"></div> {/* 상세보기 버튼 칸 */}
        </div>

        {/* 리스트 */}
        {currentPageData.map((item) => (
          <div
            key={item.coin_no}
            className="flex flex-col md:flex-row items-center gap-4 p-4 bg-gray-50 rounded-lg shadow"
          >
            {/* 이미지 */}
            <img
              className="w-20 h-20 rounded-full object-cover bg-gray-200"
              src={`http://${getIP()}:9093/home/storage/${item.coin_img}`}
              alt={item.coin_name}
              onError={e => e.target.src = genuImg}
            />
            {/* Content */}
            <div className="flex-1 flex flex-col gap-2">
              <div className="font-bold text-lg">{item.coin_name}</div>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="text-base">{item.coin_price.toLocaleString()} 누렁</div>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className={`text-sm ${item.coin_percentage >= 0 ? 'text-red-600' : 'text-blue-600'}`}>
                {item.coin_percentage}%
              </div>
            </div>
            <Link
              to={`/coin/${item.coin_no}`}
              className="h-8 px-4 flex items-center bg-blue-100 rounded hover:bg-blue-200 transition"
            >
              상세 보기
            </Link>
          </div>
        ))}

        {/* 페이징 버튼 */}
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100"
          >
            이전
          </button>
          <span className="px-4 py-1">{page + 1} / {totalPages}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page + 1 >= totalPages}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100"
          >
            다음
          </button>
        </div>
      </div>
    </div>
    </main>
  );
}

export default CoinList;
