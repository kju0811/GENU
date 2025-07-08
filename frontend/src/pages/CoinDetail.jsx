import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getIP } from '../components/Tool';
import OrderBookChart from '../components/OrderBookChart';
import TradeChart from '../components/TradeChart';
import CoinInfo from '../components/CoinInfo';
import RelatedNews from '../components/RelatedNews';
import CommunityFeed from '../components/CommunityFeed';
import OrderForm from '../components/OrderForm';
import CandleStickChart from '../components/CandleStickChart';

export default function CoinDetail() {
  console.log('-> CoinDetail:');
  const { coin_no } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('chart');

  useEffect(() => {
    fetch(`http://${getIP()}:9093/coin/${coin_no}`)
      .then(res => res.json())
      .then(data => {
        setDetail(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err);
        setLoading(false);
      });
  }, [coin_no]);

  if (loading) return <p>Loading...</p>;
  if (error || !detail) return <p>Error loading coin details.</p>;

  // detail 객체에서 기본 정보 추출
  const { coin_name, coin_price, coin_percentage, coin_img } = detail;

  const tabs = [
    { id: 'chart', label: '차트 · 호가' },
    { id: 'info',  label: '종목 정보'   },
    { id: 'news',  label: '뉴스 · 공시' },
    { id: 'community', label: '커뮤니티' }
  ];

  return (
    <div className="container mx-auto p-4">
      {/* Header: 기본 코인 정보 */}
      <header className="flex items-center space-x-4 mb-6">
        <img
          src={`http://${getIP()}:9093/home/storage/${coin_img}`}
          alt={coin_name}
          className="w-12 h-12 rounded-full object-cover"
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
      </header>

      {/* 탭 메뉴 */}
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

      {/* 탭 콘텐츠 */}
      <div>
        {activeTab === 'chart' && (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">CandleStickChart</h3>
              <CandleStickChart coin_no={coin_no} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Trade Chart</h3>
              <TradeChart data={detail.trades} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">주문</h3>
              <OrderForm coin_no={coin_no} />
            </div>
          </div>
        )}
        {activeTab === 'info' && (
          <section>
            <h3 className="text-lg font-semibold mb-2">Coin Information</h3>
            <CoinInfo data={detail.info} />
          </section>
        )}
        {activeTab === 'news' && (
          <section>
            <h3 className="text-lg font-semibold mb-2">Related News</h3>
            <RelatedNews articles={detail.newsList} />
          </section>
        )}
        {activeTab === 'community' && (
          <section>
            <h3 className="text-lg font-semibold mb-2">Community Feed</h3>
            <CommunityFeed posts={detail.communityList} />
          </section>
        )}
      </div>
    </div>
  );
}
