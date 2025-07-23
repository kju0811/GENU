// src/components/CoinLikedList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getIP } from "../components/Tool";
import { Link } from 'react-router-dom';

function CoinLikedList({ member_no }) {
  const [likedCoins, setLikedCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!member_no) return;

    const fetchLikedCoins = async () => {
      try {
        const res = await axios.get(`http://${getIP()}:9093/coinlike/findByMemberCoinlikeList`, {
          params: { member_no },
        });
        setLikedCoins(res.data);
      } catch (err) {
        console.error("좋아요한 코인 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedCoins();
  }, [member_no]);

  if (loading) return <p>불러오는 중...</p>;

  const handleCancelLike = async (coin_no) => {
    try {
      const res = await axios.delete(`http://${getIP()}:9093/coinlike/deleteCoinlike/${member_no}/${coin_no}`);

      // 요청이 성공했을 때 (200번대 응답)
      if (res.status >= 200 && res.status < 300) {
        setLikedCoins(prev => prev.filter(item => item.coin.coin_no !== coin_no));
      } else {
        alert("좋아요 취소에 실패했습니다.");
      }
    } catch (error) {
      console.error("좋아요 취소 에러:", error);
      alert("좋아요 취소 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full">
      <h2 className="text-lg font-bold mb-4">❤️ 좋아요한 코인 목록</h2>
      {likedCoins.length === 0 ? (
        <p className="text-gray-500">좋아요한 코인이 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {likedCoins.map(({ coin }) => (
            <li
              key={coin.coin_no}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg shadow"
            >

              {/* 이미지 */}
              <img
                src={`http://${getIP()}:9093/home/storage/${coin.coin_img}`}
                alt={coin.coin_name}
                className="w-20 h-20 rounded-full object-cover bg-gray-200"
                onError={e => e.target.src = '/nurung.png'}
              />
              {/* 이름 */}
              <div className="flex-1 font-bold text-lg">{coin.coin_name}</div>
              {/* 가격 */}
              <div className="flex-1 text-base">{coin.coin_price.toLocaleString()} 누렁</div>
              {/* 등락률 */}
              <div className={`flex-1 text-sm ${coin.coin_percentage >= 0 ? 'text-red-600' : 'text-blue-600'}`}>
                {coin.coin_percentage}%
              </div>
              <Link
                to={`/coin/${coin.coin_no}`}
                className="h-8 px-4 flex items-center bg-blue-100 rounded hover:bg-blue-200 transition"
              >
              상세보기
              </Link>
                            {/* 좋아요 취소 버튼 */}
              <button
                onClick={() => handleCancelLike(coin.coin_no)}
                className="w-8 h-8 flex items-center justify-center rounded bg-red-500 text-white hover:bg-red-600 transition"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>

  );
}

export default CoinLikedList;
