import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { getIP } from '../components/Tool';
import Pagination from 'react-js-pagination';

const PAGE_SIZE = 10;

function CoinList() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [sortType, setSortType] = useState('price');
  const navigate = useNavigate();

  useEffect(() => {
    const url = sortType === 'price'
      ? `http://${getIP()}:9093/coin/find_price_desc`
      : `http://${getIP()}:9093/coin/find_percentage_desc`;
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error(err));
  }, [sortType]);

  useEffect(() => {
    sessionStorage.setItem('nextIndex', page);
  }, [page]);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  if (!data) return null;

  const startIndex = (page - 1) * PAGE_SIZE;
  const currentPageData = data.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <main className="w-[90%] mx-auto p-4">
      <div className="max-w-6xl w-full mx-auto p-4">
        <div className="flex flex-col gap-4">

          {/* 정렬 드롭다운 */}
          <div className="flex justify-end items-center">
            <label htmlFor="sortSelect" className="mr-2 text-sm font-medium text-gray-600">정렬 기준:</label>
            <select
              id="sortSelect"
              value={sortType}
              onChange={(e) => { setSortType(e.target.value); setPage(1); }}
              className="px-3 py-2 border rounded-md text-sm bg-white shadow-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option value="price">현재가 순</option>
              <option value="percentage">등락률 순</option>
            </select>
          </div>

          {/* 컬럼 헤더 */}
          <div className="hidden md:flex items-center gap-2 px-4 pb-2 text-gray-500 text-sm border-b font-semibold">
            <div className="w-6 text-center"></div> {/* 시퀀스 헤더 */}
            <div className="w-12"></div>
            <div className="flex-1 font-semibold">종목</div>
            <div className="flex-1 font-semibold text-center">현재가</div>
            <div className="flex-1 font-semibold text-center">등락률</div>
          </div>
          {/* 리스트 */}
          {currentPageData.map((item, index) => (
            <div
              key={item.coin_no}
              onClick={() => navigate(`/coin/${item.coin_no}`)}
              className="flex items-center gap-2 p-3 bg-white hover:bg-gray-50 rounded-lg shadow cursor-pointer text-sm"
            >

              {/* 시퀀스 번호 */}
              <div className="w-6 text-center text-gray-500">
                {(page - 1) * PAGE_SIZE + index + 1}
              </div>
              <img
                className="w-10 h-10 rounded-full object-cover bg-gray-200"
                src={`http://${getIP()}:9093/home/storage/${item.coin_img}`}
                alt={item.coin_name}
                onError={e => e.target.src = '/nurung.png'}
              />
              <div className="flex-1 font-medium text-gray-800">{item.coin_name}</div>
              <div className="flex-1 text-center">{item.coin_price.toLocaleString()} 누렁</div>
              <div
                className={`flex-1 text-center ${item.coin_percentage > 0
                    ? 'text-red-600'
                    : item.coin_percentage < 0
                      ? 'text-blue-600'
                      : 'text-gray-600'
                  }`}
              >
                {item.coin_percentage}%
              </div>

            </div>
          ))}

          {/* 페이징 */}
          <div className="mt-6 py-5 flex justify-center gap-2">
            <Pagination
              innerClass="flex justify-center mt-4 gap-2"
              itemClass="rounded-lg"
              linkClass="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-200 text-xs"
              activeClass="bg-sky-500 text-white border-sky-500"
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
