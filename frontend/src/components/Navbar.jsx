import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import SearchInput from './SearchInput';
import NotificationDropdown from './NotificationList';
import { jwtDecode } from 'jwt-decode';

const navTabs = [
  { id: "home", label: "홈", to: "/" },
  { id: "coinlist", label: "코인 리스트", to: "/coinlist" },
  { id: "newsfind", label: "기사", to: "/ai/newsfind" },
  { id: "calendar", label: "캘린더", to: "/calendar" },
  { id: "announce", label: "공지사항", to: "/announce_find" },
];

const adminTab = [
  { label: "코인 생성하기", to: "/coin/create" },
  { label: "기사 생성하기", to: "/ai/news" },
  { label: "공지사항 생성하기", to: "/announce" },
  { label: "회원 목록", to: "/member" }
];

export default function Navbar() {
  const jwt = sessionStorage.getItem('jwt');
  const [adminOpen, setAdminOpen] = useState(false);
  const adminRef = useRef();

  let userInfo = null;
  if (jwt) {
    try {
      userInfo = jwtDecode(jwt);
    } catch (e) {
      userInfo = null;
    }
  }

  useEffect(() => {
    const handler = (e) => {
      if (adminRef.current && !adminRef.current.contains(e.target)) {
        setAdminOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="bg-gradient-to-t from-white to-gray-100 shadow-md p-4 w-full" aria-label="Main navigation">
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
          {jwt ? (<NotificationDropdown />) : null}
          <ProfileDropdown />
        </div>
      </div>

      {/* 하단 탭 메뉴: 중앙 정렬 및 스크롤 지원 */}
      <div className="flex justify-center overflow-visible whitespace-nowrap gap-6 mt-3 border-t pt-2">
        {navTabs.map((tab) => (
          <NavLink
            key={tab.id}
            to={tab.to}
            className={({ isActive }) =>
              [
                "px-3 py-1 font-medium transition-all duration-200",
                isActive
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "hover:text-blue-600 text-gray-700"
              ].join(' ')
            }
          >
            {tab.label}
          </NavLink>
        ))}

        {userInfo?.role === "ADMIN" && (
          <div className="relative" ref={adminRef}>
            <div
              className="px-3 py-1 font-medium hover:text-blue-600 text-gray-700 border-b-2 border-transparent transition-all duration-200 cursor-pointer"
              onClick={() => setAdminOpen((o) => !o)}
              role="button"
              tabIndex={0}
            >
              관리자 <span className="ml-1">&#x25BC;</span>
            </div>
            {adminOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 min-w-[150px] z-50 bg-white dark:bg-[#1E2028] rounded-lg shadow-lg p-2">
                {adminTab.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className="block px-4 py-2 text-sm ..."
                    onClick={() => setAdminOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
