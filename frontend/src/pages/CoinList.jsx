import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { getIP } from '../components/Tool';
import Pagination from 'react-js-pagination';

const PAGE_SIZE = 10;

function CoinList() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
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

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  // 페이지 GLOBALCONTEXT사용
  useEffect(() => {
    sessionStorage.setItem('nextIndex', page);
  }, [page]);

  if (!data) return null;

  // 현재 페이지에 보여줄 데이터 슬라이스
  const startIndex = (page-1) * PAGE_SIZE;
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
              onClick={() => { setSortType('price'); setPage(1); }}
              className={`flex-1 font-semibold ml-3 cursor-pointer select-none ${
                sortType === 'price' ? 'text-blue-600 underline' : ''
              }`}
            >
              현재가
            </div>
            <div
              onClick={() => { setSortType('percentage'); setPage(1); }}
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
              onError={e => e.target.src = '/nurung.png'}
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

        {/* 페이징 */}
        <div className="mt-8 py-5 flex justify-center gap-2">
          <Pagination
            innerClass="flex justify-center mt-4 gap-2"
            itemClass="rounded-lg"
            linkClass="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-200 text-sm rounded-lg"
            activeClass="bg-sky-500 text-white border-sky-500 rounded-lg"
            activePage={page}
            itemsCountPerPage={PAGE_SIZE}
            totalItemsCount={data.length}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </div>
    </main>
  );
}

export default CoinList;
