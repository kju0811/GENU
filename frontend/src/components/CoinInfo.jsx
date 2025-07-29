import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getIP } from '../components/Tool';

const TABS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "info", label: "Info" },
];

export default function CoinInfo() {
  const { coin_no } = useParams();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [detail, setDetail] = useState(null);

  // 체결강도/순매수량 상태
  const [strengthInfo, setStrengthInfo] = useState({
    buy: 0,
    sell: 0,
    netBuy: 0,
    strength: 0.0,
  });

  useEffect(() => {
    fetch(`http://${getIP()}:9093/coin/${coin_no}`)
      .then(res => res.json())
      .then(data => setDetail(data))
      .catch(console.error);
  }, [coin_no]);

  useEffect(() => {
    fetch(`http://${getIP()}:9093/deal/coin-strength/${coin_no}`)
      .then(res => res.json())
      .then(data => {
        setStrengthInfo({
          buy: data.buy || 0,
          sell: data.sell || 0,
          netBuy: data.netBuy || 0,
          strength: data.strength || 0.0,
        });
      })
      .catch(() => {
        setStrengthInfo({
          buy: 0,
          sell: 0,
          netBuy: 0,
          strength: 0.0,
        });
      });
  }, [coin_no]);

  if (!detail) return <div>Loading...</div>;

  const coin_price = detail.coin_price || 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg flex w-full min-h-[700px]">
      {/* Left Sidebar */}
      <aside className="w-60 bg-white border-r rounded-l-2xl flex flex-col items-center py-8">
        {/* 코인 썸네일 + 이름 + 번호 */}
        <div className="flex flex-col items-center mb-10">
          <img
            src={`http://${getIP()}:9093/home/storage/${detail.coin_img}`}
            alt={detail.coin_name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="text-xl font-bold">{detail.coin_name}</div>
        </div>

        {/* 탭 버튼 */}
        <nav className="flex flex-col w-full gap-1 px-6">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`w-full text-left py-3 rounded-lg transition font-medium
                ${activeTab === tab.key ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-blue-100"}
              `}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        {/* Content Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="text-2xl font-bold">
            {TABS.find((t) => t.key === activeTab)?.label}
          </div>
          <div className="text-gray-400 text-sm">| 정보</div>
        </div>

        {/* Tab Panels */}
        {activeTab === "dashboard" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 현재가 카드 */}
              <div className="bg-blue-600 rounded-xl text-white p-6 shadow-lg">
                <div className="text-lg font-semibold mb-2">현재가</div>
                <div className="text-3xl font-bold mb-4">
                  {coin_price.toLocaleString()}원{' '}
                </div>
                <div className="text-xs opacity-80">2025.07.21 15:12 기준</div>
                <div className="mt-6 text-sm flex items-center gap-2">
                  <span className="bg-white bg-opacity-10 px-2 py-1 rounded-lg">거래량 24,000 누렁</span>
                </div>
              </div>

              {/* 오늘의 이슈 카드 */}
              <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col">
                <div className="font-semibold mb-3 text-gray-700">Today’s Issue</div>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 코인 ETF 관련 호재 뉴스</li>
                  <li>• 채굴 난이도 상승, 네트워크 안정</li>
                  <li>• 주요 거래소 입출금 일시 중단 공지</li>
                </ul>
              </div>
            </div>

            {/* 최근 거래 흐름 영역 */}
            <div className="mt-10">
              <div className="font-semibold mb-2 text-gray-700">최근 거래</div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between text-md text-black-400 pb-1 border-b mb-2">
                  <span>현재 매수 강도: {strengthInfo.strength}%</span>
                  <span>순매수량: {strengthInfo.netBuy.toLocaleString()} 누렁</span>
                </div>
                <div>
                  <span>총 매수량: {strengthInfo.buy.toLocaleString()} 누렁</span><br />
                  <span>총 매도량: {strengthInfo.sell.toLocaleString()} 누렁</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "info" && (
          <div className="flex flex-col">
            <div className="bg-gray-200 rounded-xl shadow p-8 w-full min-w-[600px] min-h-[500px] flex flex-col">
              <div className='text-xl'>
                {detail.coin_info}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
