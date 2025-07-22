import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getIP } from '../components/Tool';
import OrderBook from '../components/OrderBook';
import CoinInfo from '../components/CoinInfo';
import RelatedNews from '../components/RelatedNews';
// import CommunityFeed from '../components/CommunityFeed';
import OrderForm from '../components/OrderForm';
import ApexChart from '../components/ApexChart';
import NoticeModal from '../components/NoticeModal'

export default function CoinDetail() {
  const { coin_no } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('chart');
  const [selectedPrice, setSelectedPrice] = useState(null);

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

  const { coin_name, coin_price, coin_percentage, coin_img } = detail;
  const tabs = [
    { id: 'chart', label: '차트 · 호가' },
    { id: 'info',  label: '종목 정보' },
    { id: 'coin',  label: '보유수량' },
    // { id: 'community', label: '커뮤니티' }
  ];

  return (
    <div className="w-[90%] mx-auto p-4">
      {/* 헤더 */}
      <header className="flex items-center space-x-4 mb-6">
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
            {coin_price.toLocaleString()}원 {' '}
            <span className={coin_percentage >= 0 ? 'text-red-600' : 'text-blue-600'}>
              {coin_percentage >= 0 ? `+${coin_percentage}` : coin_percentage}%
            </span>
          </p>
        </div>
        {/* 금액알림 */}
        <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        금액알림
      </button>
      </header>

      {/* 탭 메뉴 */}
      {isModalOpen && <NoticeModal coin_no={coin_no} onClose={() => setIsModalOpen(false)} />}
      <nav className="flex space-x-4 border-b mb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-4 -mb-px font-medium border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div>
        {activeTab === 'chart' && (
          <div className="flex flex-col md:flex-row gap-4">
            {/* 차트 */}
            <div className="w-full md:w-1/2">
              <ApexChart coin_no={coin_no} />
            </div>
            {/* 호가창: 클릭 시 주문 가격을 상위로 전달 */}
            <div className="w-full md:w-1/3">
              <OrderBook
                coin_no={coin_no}
                currentPrice={selectedPrice}
                onSelectPrice={handleSelectPrice}
              />
            </div>
            {/* 주문 폼: defaultPrice로 선택된 가격 전달 */}
            <div className="w-full md:w-1/5">
              <OrderForm
                coin_no={coin_no}
                defaultPrice={selectedPrice}
              />
            </div>
          </div>
        )}

        {activeTab === 'info' && (
          <section>
            <CoinInfo coin_no={coin_no} />
          </section>
        )}

        {activeTab === 'news' && (
          <section>
            <h3 className="text-lg font-semibold mb-2">Related News</h3>
            <RelatedNews coin_no={coin_no} />
          </section>
        )}

        {/* {activeTab === 'community' && (
          <section>
            <h3 className="text-lg font-semibold mb-2">Community Feed</h3>
            <CommunityFeed coin_no={coin_no} />
          </section>
        )} */}
      </div>
    </div>
  );
}
