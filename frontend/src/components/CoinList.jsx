import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { getIP } from "./Tool";
import genuImg from '../images/genu.png';

const PAGE_SIZE = 10;

function CoinList() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(0); // 페이지 번호 (0, 1, 2, ...)

  useEffect(() => {
    fetch(`http://${getIP()}:9093/coin/find_all`, {
      method: 'GET'
    })
    .then(result => result.json())
    .then(data => setData(data))
    .catch(err => console.error(err))
  }, []);

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
    <div className="max-w-7xl w-full mx-auto p-4">
      <div className="flex flex-col gap-4">
        {currentPageData.map((item) => (
          <div
            key={item.coin_no}
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg shadow"
          >
            {/* Avatar */}
            <img
              className="w-12 h-12 rounded-full object-cover bg-gray-200"
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
              <div className="text-sm">등락: {item.coin_percentage}%</div>
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
  );
}

export default CoinList;
