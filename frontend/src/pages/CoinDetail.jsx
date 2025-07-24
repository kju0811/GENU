import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, useParams } from 'react-router-dom';
import { getIP } from '../components/Tool';
import OrderTab from "../components/OrderTab";
import CoinInfo from "../components/CoinInfo";
// import RelatedNews from "../components/RelatedNews";
import CommunityFeed from "../components/CommunityFeed";
import NoticeModal from '../components/NoticeModal'

import { useLikeToggle } from '../components/useLikeToggle';

export default function CoinDetail() {
  const { coin_no } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('order');
  const [selectedPrice, setSelectedPrice] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // useLikeToggle 훅 사용
  const { liked, toggleLike } = useLikeToggle(coin_no);

  // CoinDetail.jsx (요청 확인용)
  const handleSelectPrice = price => {
    console.log('Parent received price:', price);
    setSelectedPrice(price);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // 1) 데이터를 가져오는 함수로 분리
    const fetchDetail = () => {
      fetch(`http://${getIP()}:9093/coin/${coin_no}`)
        .then(res => res.json())
        .then(data => {
          setDetail(data);
          setLoading(false);
          setSelectedPrice(data.coin_price);
        })
        .catch(err => {
          console.error(err);
          setError(err);
          setLoading(false);
        });
    };

    fetchDetail();                         // 마운트 직후 1회 호출

    // const intervalId = setInterval(fetchDetail, 60000);  // 폴링방식채택 (소켓사용?몰루)
    // return () => clearInterval(intervalId); // 언마운트 시 타이머 해제
  }, [coin_no]);

  if (loading) return <p>Loading...</p>;
  if (error || !detail) return <p>Error loading coin details.</p>;

  const handleTab = tabId => {
    navigate(`/coin/${coin_no}/${tabId}`);
  };

  const { coin_name, coin_price, coin_percentage, coin_img } = detail;

  const currentTab = location.pathname.split('/').pop();
  const tabs = [
    { id: 'order', label: '차트 · 호가' },
    { id: 'info', label: '종목 정보' },
    { id: 'coin', label: '보유수량' },
    { id: 'community', label: '커뮤니티' }
  ];

  return (
    <div className="w-[100%] mx-auto p-4 bg-gray-100">
      <div className="w-[90%] mx-auto p-4">
        {/* 헤더 */}
        <header className="flex items-center justify-between mb-6">
          {/* 헤더 좌측 */}
          <div className="flex flex-row items-center gap-4">
            <img
              src={`http://${getIP()}:9093/home/storage/${coin_img}`}
              alt={coin_name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {coin_name}
              </h1>
              <p className="text-lg text-gray-800 dark:text-gray-200">
                {coin_price.toLocaleString()}누렁 {' '}
                <span className={coin_percentage >= 0 ? 'text-red-600' : 'text-blue-600'}>
                  {coin_percentage >= 0 ? `+${coin_percentage}` : coin_percentage}%
                </span>
              </p>
            </div>
          </div>
          {/* 헤더 우측 */}
          <div className="flex space-x-2">
            {/* 좋아요 버튼 - liked 상태에 따라 스타일과 텍스트 변경 */}
            <button
              onClick={toggleLike}
              className={`mb-4 px-4 py-2 rounded ${liked
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-rose-100 text-gray-700 hover:bg-rose-300'
                }`}
            >
              {liked ? '❤️' : '🤍'}
            </button>
            {/* 금액알림 */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              금액알림
            </button>
          </div>
        </header>

        {/* 탭 메뉴 */}
        {isModalOpen && <NoticeModal coin_no={coin_no} onClose={() => setIsModalOpen(false)} />}
        <nav className="flex space-x-4 border-b mb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTab(tab.id)}
              className={`py-2 px-4 -mb-px font-medium border-b-2 transition-all ${currentTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* 탭 내용 */}
        <Outlet context={{ coin_price, coin_no }} />
      </div>
    </div>
  );
}
