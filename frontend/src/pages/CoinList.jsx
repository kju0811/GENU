import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getIP } from '../components/Tool';

/**
 * CoinList 페이지
 * - 백엔드에서 코인 목록을 조회 후 리스트로 렌더링합니다.
 */
export default function CoinList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://${getIP()}:9093/coin/coinlist`, {
      method: 'GET'
    })
      .then(res => res.json())
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading coins...</p>;
  if (error) return <p>Error loading coins.</p>;

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <h2 className="text-lg font-semibold mb-3">Crypto Coins</h2>
      <ul className="bg-white dark:bg-[#1E2028] rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
        {data.map((coin) => (
          <li
            key={coin.coin_no}
            className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#2A2C36] transition-colors"
          >
            <Link to={`/coin/${coin.coin_no}`} className="flex items-center space-x-3">
              <img
                src={coin.coin_img}
                alt={coin.coin_name}
                className="h-8 w-8 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {coin.coin_name} ({coin.coin_symbol})
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{coin.coin_category}</p>
              </div>
            </Link>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{coin.coin_price}</p>
              <p
                className={`text-xs font-medium ${
                  coin.coin_percentage.startsWith('-')
                    ? 'text-red-500'
                    : 'text-green-500'
                }`}
              >
                {coin.coin_percentage}%
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
