import React, { useEffect, useState } from "react";
import { getIP } from "../components/Tool";
import { Link, useOutletContext } from 'react-router-dom';

export default function CoinLikedList() {
  const [likedCoins, setLikedCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const { member_no, jwt } = useOutletContext();

  useEffect(() => {
    if (!member_no) return;

    const fetchLikedCoins = async () => {
      try {
        const res = await fetch(`http://${getIP()}:9093/coinlike/findByMemberCoinlikeList?member_no=${member_no}`, {
          headers: { Authorization: jwt }
        });

        if (!res.ok) throw new Error(`HTTP 오류: ${res.status}`);
        const data = await res.json();
        setLikedCoins(data);
      } catch (err) {
        console.error("좋아요한 코인 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedCoins();
  }, [member_no, jwt]);

  const handleCancelLike = async (coin_no) => {
    try {
      const res = await fetch(`http://${getIP()}:9093/coinlike/deleteCoinlike/${member_no}/${coin_no}`, {
        method: 'DELETE',
        headers: { Authorization: jwt } // ✅ 삭제 요청에도 JWT 포함
      });

      if (res.ok) {
        setLikedCoins(prev => prev.filter(item => item.coin.coin_no !== coin_no));
      } else {
        alert("좋아요 취소에 실패했습니다.");
      }
    } catch (error) {
      console.error("좋아요 취소 에러:", error);
      alert("좋아요 취소 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <p>불러오는 중...</p>;

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
              <img
                src={`http://${getIP()}:9093/home/storage/${coin.coin_img}`}
                alt={coin.coin_name}
                className="w-20 h-20 rounded-full object-cover bg-gray-200"
                onError={e => e.target.src = '/nurung.png'}
              />
              <div className="flex-1 font-bold text-lg">{coin.coin_name}</div>
              <div className="flex-1 text-base">{coin.coin_price.toLocaleString()} 누렁</div>
              <div className={`flex-1 text-sm ${coin.coin_percentage >= 0 ? 'text-red-600' : 'text-blue-600'}`}>
                {coin.coin_percentage}%
              </div>
              <Link
                to={`/coin/${coin.coin_no}`}
                className="h-8 px-4 flex items-center bg-blue-100 rounded hover:bg-blue-200 transition"
              >
                상세보기
              </Link>
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