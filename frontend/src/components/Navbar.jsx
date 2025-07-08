import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import SearchInput from './SearchInput';
import NotificationDropdown from './NotificationList';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4 w-full" aria-label="Main navigation">
      {/* 상단 바: 3단 레이아웃으로 중앙에 검색창 배치 */}
      <div className="relative grid grid-cols-3 items-center gap-4">
        {/* 좌측: 로고 */}
        <div className="col-start-1 flex items-center">
          <Link to="/" className="flex items-center" aria-label="홈으로 이동">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span className="ml-2 text-3xl font-bold text-orange-300">GENU</span>
          </Link>
        </div>

        {/* 중앙: 검색창 */}
        <div className="col-start-2 flex justify-center">
          <div className="w-full max-w-md">
            <SearchInput />
          </div>
        </div>

        {/* 우측: 알림 + 프로필 */}
        <div className="col-start-3 flex justify-end items-center gap-4">
          <NotificationDropdown />
          <ProfileDropdown />
        </div>
      </div>

      {/* 하단 탭 메뉴: 중앙 정렬 및 스크롤 지원 */}
      <div className="flex justify-center overflow-x-auto whitespace-nowrap gap-6 mt-3 border-t pt-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `px-3 py-1 rounded-xl font-medium transition ${
              isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-blue-600'
            }`
          }
        >
          홈
        </NavLink>
        <NavLink
          to="/ai/news"
          className={({ isActive }) =>
            `px-3 py-1 rounded-xl font-medium transition ${
              isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-blue-600'
            }`
          }
        >
          기사
        </NavLink>
        <NavLink
          to="/community"
          aria-label="커뮤니티"
          className={({ isActive }) =>
            `px-3 py-1 rounded-xl font-medium transition ${
              isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-blue-600'
            }`
          }
        >
          커뮤니티
        </NavLink>
        <NavLink
          to="/portfolio"
          aria-label="내 자산"
          className={({ isActive }) =>
            `px-3 py-1 rounded-xl font-medium transition ${
              isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-blue-600'
            }`
          }
        >
          내 자산
        </NavLink>
      </div>
    </nav>
  );
}
