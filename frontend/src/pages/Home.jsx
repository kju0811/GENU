// src/pages/Home.jsx
import React from 'react';
import CoinList from '../components/CoinList';
// import Calendar from '../components/Calendar';
// import NewsFeed from '../components/NewsFeed';

/**
 * Home 페이지
 * - 메인 레이아웃: 좌측 코인 리스트, 우측 캘린더 + 뉴스 피드
 */
export default function Home() {
  return (
    <main className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 왼쪽: 코인 리스트 (col-span-2) */}
        {/* <section className="col-span-1 md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-4"> */}
          <CoinList limit={10} />
          {/* TODO: CoinList 내에 페이지네이션 기능 추가 예정 */}
        {/* </section> */}

        {/* 오른쪽: 세로 스택(캘린더, 뉴스 피드) */}
        <div className="grid grid-rows-2 gap-4">
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">캘린더</h2>
            {/* <Calendar /> */}
          </section>
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">뉴스 피드</h2>
            {/* <NewsFeed limit={5} /> */}
          </section>
        </div>
      </div>
    </main>
  );
}
