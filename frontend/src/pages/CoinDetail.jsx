import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getIP } from '../components/Tool';
import OrderBookChart from '../components/OrderBookChart';
import TradeChart from '../components/TradeChart';
import CoinInfo from '../components/CoinInfo';
import RelatedNews from '../components/RelatedNews';
import CommunityFeed from '../components/CommunityFeed';
import OrderForm from '../components/OrderForm';

/**
 * CoinDetail 페이지
 * - 탭 메뉴로 차트·호가, 코인 정보, 뉴스, 커뮤니티 섹션을 전환합니다.
 * - 스크롤 없이 필요한 정보만 교체하여 보여줍니다.
 */
export default function CoinDetail() {
  const { coin_no } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('chart'); // 'chart','info','news','community'

  useEffect(() => {
    fetch(`http://${getIP()}:9093/coin/detail/${coin_no}`)
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

  const { orderBook, trades, info, newsList, communityList } = detail; // TODO: 데이터 구조 확인

  const tabs = [
    { id: 'chart', label: '차트 · 호가' },
    { id: 'info',  label: '종목 정보'   },
    { id: 'news',  label: '뉴스 · 공시' },
    { id: 'community', label: '커뮤니티' }
  ];

  return (
    <div className="container mx-auto p-4">
      {/* 탭 메뉴 */}
      <nav className="flex space-x-4 border-b mb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-4 -mb-px font-medium border-b-2 transition-all 
              ${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* 탭 콘텐츠 */}
      <div>
        {activeTab === 'chart' && (
          <div className="grid grid-cols-3 gap-4">
            {/* 왼쪽: 호가창 */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Order Book</h3>
              <OrderBookChart data={orderBook} />
            </div>
            {/* 중앙: 거래 차트 */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Trade Chart</h3>
              <TradeChart data={trades} />
            </div>
            {/* 우측: 주문 폼 */}
            <div>
              <h3 className="text-lg font-semibold mb-2">주문</h3>
              <OrderForm coin_no={coin_no} />
            </div>
          </div>
        )}

        {activeTab === 'info' && (
          <section>
            <h3 className="text-lg font-semibold mb-2">Coin Information</h3>
            <CoinInfo data={info} />
          </section>
        )}

        {activeTab === 'news' && (
          <section>
            <h3 className="text-lg font-semibold mb-2">Related News</h3>
            <RelatedNews articles={newsList} />
          </section>
        )}

        {activeTab === 'community' && (
          <section>
            <h3 className="text-lg font-semibold mb-2">Community Feed</h3>
            <CommunityFeed posts={communityList} />
          </section>
        )}
      </div>
    </div>
  );
}
