import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import Login from '../components/Login';
import { useGlobal } from '../components/GlobalContext';
import { getIP } from '../components/Tool';

// 기본 메뉴 항목 배열에서 signout 아이템은 action만 담고 to 는 비워둡니다
const defaultMenu = [
  { id: 'dashboard', label: 'Dashboard', to: '/dashboard' },
  { id: 'analytics', label: 'Analytics', to: '/analytics', badge: 'New' },
  { id: 'signout',   label: '로그아웃',   to: '/member/logout', danger: true },
];

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
  const { sw, setSw } = useGlobal();
  const [isOpen, setIsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleOpen = useCallback(() => setIsOpen(v => !v), []);

  useEffect(() => {
    const handler = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, []);

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    try {
      const res = await fetch(`http://${getIP()}:9093/member/logout`, {
        method: 'GET',
        headers: { 'Authorization': sessionStorage.getItem('jwt') },
      });
      const json = await res.json();
      if (json.logout) {
        setSw(false);
        // sessionStorage.removeItem('sw'); // 굳이?
        sessionStorage.removeItem('jwt');
      } else {
        alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err) {
      console.error(err);
      alert('로그아웃 중 오류가 발생했습니다.');
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={toggleOpen}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="flex items-center gap-3 px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E2028] rounded-lg shadow hover:shadow-md transition-all"
      >
        <img
          src={user.avatar}
          alt={`${user.name} 프로필`}
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 z-50 bg-white dark:bg-[#1E2028] rounded-lg shadow-lg p-2 space-y-1">
          {!sw && (
            <button
              onClick={() => setLoginOpen(true)}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#2A2C36] rounded-md"
            >
              로그인
            </button>
          )}

          {sw && (
            <>
              <div className="border-t border-gray-200 dark:border-gray-700" />
              {menuItems.map(item =>
                item.id === 'signout' ? (
                  <button
                    key={item.id}
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                  >
                    {item.label}
                  </button>
                ) : (
                  <MenuItem key={item.id} item={item} />
                )
              )}
            </>
          )}
        </div>
      )}

      <Login isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
