import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import Login from '../components/Login'; // 로그인 모달 컴포넌트

// 기본 메뉴 항목 배열
const defaultMenu = [
  { id: 'dashboard', label: 'Dashboard', to: '/dashboard' },
  { id: 'analytics', label: 'Analytics', to: '/analytics', badge: 'New' },
  { id: 'signout', label: 'Sign out', to: '/logout', danger: true }
];

// 개별 메뉴 아이템 컴포넌트 (메모화)
const MenuItem = memo(({ item }) => (
  <Link
    to={item.to}
    className={`flex items-center px-4 py-2 text-sm ${
      item.danger
        ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
        : 'hover:bg-gray-100 dark:hover:bg-[#2A2C36]'
    } rounded-md`}
  >
    {item.label}
    {item.badge && (
      <span className="ml-auto bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300 text-xs px-2 py-0.5 rounded-full">
        {item.badge}
      </span>
    )}
  </Link>
));

export default function ProfileDropdown({
  user = { name: 'James Lee', avatar: 'https://cdn.startupful.io/img/app_logo/no_img.png' },
  menuItems = defaultMenu
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false); // 로그인 모달 열림 상태
  const dropdownRef = useRef(null);

  // 드롭다운 토글
  const toggleOpen = useCallback(() => setIsOpen(prev => !prev), []);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* 프로필 버튼 */}
      <button
        onClick={toggleOpen}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="flex items-center gap-3 px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E2028] rounded-lg shadow hover:shadow-md transition-all"
      >
        <img
          src={user.avatar}
          alt={`${user.name} profile`}
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</span>
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 z-50 bg-white dark:bg-[#1E2028] rounded-lg shadow-lg p-2 space-y-1">
          {/* 로그인 모달 트리거 */}
          <button
            onClick={() => setLoginOpen(true)}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#2A2C36] rounded-md"
          >
            로그인
          </button>
          <div className="border-t border-gray-200 dark:border-gray-700" />
          {/* 기본 메뉴 아이템 렌더링 */}
          {menuItems.map(item => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Login 모달 표시 */}
      <Login isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
