import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getIP } from '../components/Tool';

const TABS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "info", label: "Info" },
];

export default function CoinInfo() {
  const { coin_no } = useParams(); // coin_no 파라미터 받아오기
  const [activeTab, setActiveTab] = useState("dashboard");
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    const fetchDetail = () => {
      fetch(`http://${getIP()}:9093/coin/${coin_no}`)
        .then(res => res.json())
        .then(data => {
          setDetail(data);
        })
        .catch(err => {
          console.error(err);
        });
    };
    fetchDetail();
  }, [coin_no]);

  if (!detail) return <div>Loading...</div>;
  const coin_price = detail.coin_price || 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg flex w-full min-h-[700px]">
      {/* Left Sidebar */}
      <aside className="w-60 bg-white border-r rounded-l-2xl flex flex-col items-center py-8">
        {/* Coin thumbnail & info */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-full bg-blue-200 mb-4 flex items-center justify-center text-4xl font-bold text-blue-600">
            ₿
          </div>
          <div className="text-xl font-bold">{detail.coin_name}</div>
          <div className="text-sm text-gray-400 mb-2">코인 번호: {coin_no}</div>
        </div>
        {/* Vertical Tabs */}
        <nav className="flex flex-col w-full gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`w-full text-left px-6 py-3 rounded-lg transition font-medium
                ${activeTab === tab.key
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-blue-100"}
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
              {/* 카드 */}
              <div className="bg-blue-600 rounded-xl text-white p-6 shadow-lg">
                <div className="text-lg font-semibold mb-2">현재가</div>
                <div
                  className="text-3xl font-bold mb-4">
                  {coin_price.toLocaleString()}원 {' '}
                </div>
                <div className="text-xs opacity-80">2025.07.21 15:12 기준</div>
                <div className="mt-6 text-sm flex items-center gap-2">
                  <span className="bg-white bg-opacity-10 px-2 py-1 rounded-lg">전일대비 ▲ 2.1%</span>
                  <span className="bg-white bg-opacity-10 px-2 py-1 rounded-lg">거래량 24,000 BTC</span>
                </div>
              </div>
              {/* 오늘의 이슈 */}
              <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col">
                <div className="font-semibold mb-3 text-gray-700">Today’s Issue</div>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 코인 ETF 관련 호재 뉴스</li>
                  <li>• 채굴 난이도 상승, 네트워크 안정</li>
                  <li>• 주요 거래소 입출금 일시 중단 공지</li>
                </ul>
              </div>
            </div>
            {/* 최근 거래 리스트 (데모) */}
            <div className="mt-10">
              <div className="font-semibold mb-2 text-gray-700">최근 거래</div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between text-md text-black-400 pb-1 border-b mb-2">
                  <span>현재 10% 매도 흐름입니다</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "info" && (
          <div className="flex flex-col">
            <div className="bg-gray-300 rounded-xl shadow p-8 w-full min-w-[600px] min-h-[500px] flex flex-col">
              <div>
                {detail.coin_info}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
