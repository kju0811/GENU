import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Login from '../components/Login';
import { useGlobal } from '../components/GlobalContext';
import { getIP } from '../components/Tool';
import { jwtDecode } from 'jwt-decode';
import basic from "../images/profile.png"

const defaultMenu = [
  { id: 'mypage', label: '마이페이지', to: '/mypage' },
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
  </Link>
));
  
export default function ProfileDropdown({ menuItems = defaultMenu}) {
  const { sw, setSw } = useGlobal();
  const [isOpen, setIsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const dropdownRef = useRef(null); 
  const [member,setMember] = useState([]);
  const navigate = useNavigate();
  const { setClose } = useGlobal();

  const toggleOpen = useCallback(() => setIsOpen(v => !v), []);

  const jwt = sessionStorage.getItem('jwt');
  let userInfo = null;
  if (jwt != null) {
    try {
      userInfo = jwtDecode(jwt);
    } catch (err) {
      console.error("JWT 디코딩 오류:", err);
    }
  }
  const member_no = userInfo?.member_no;
  const img = member.member_img;
  const nick = member.member_nick;
  const name = member.member_name;

 // 1. 사용자 정보 fetch
useEffect(() => {
  if (member_no != null) {
    fetch(`http://${getIP()}:9093/member/read/${member_no}`, {
      method: 'GET'
    })
      .then(res => res.json())
      .then(data => setMember(data))
      .catch(err => console.error(err));
  }
}, [userInfo?.member_no]);

// 외부 클릭 감지
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
        sessionStorage.removeItem('bot');
        sessionStorage.removeItem('user');
        setClose(true);
        navigate('/');
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
      {jwt != null ?(
      // 로그인 하기전
      <button
        onClick={toggleOpen}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="flex items-center gap-3 px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E2028] rounded-lg shadow hover:shadow-md transition-all"
      >
        <img
          src={img ? (`http://${getIP()}:9093/home/storage/${img}`) : `${basic}`}
          alt={`${name} 프로필`}
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="text-sm font-medium text-gray-900 dark:text-white">{nick} 님</span>
      </button> ) : 
      // 로그인 한 후 프로필
      <button
      onClick={() => setLoginOpen(true)}
      aria-haspopup="true"
      aria-expanded={isOpen}
      className="flex items-center gap-3 px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E2028] rounded-lg shadow hover:shadow-md transition-all"
       > <span className="text-sm font-medium text-gray-900 dark:text-white">로그인이 필요합니다</span> </button> 
      }

    {isOpen && (
      <div className="absolute right-0 mt-3 w-64 z-50 bg-white dark:bg-[#1E2028] rounded-lg shadow-lg p-2 space-y-1">
        {jwt && (
          <>
            <div className="border-t border-gray-200 dark:border-gray-700" />
            {menuItems.map(item => {
              // ADMIN만 코인생성 메뉴 노출
              if (item.id === "coincreate" && userInfo?.role !== "ADMIN") {
                return null;
              }
              if (item.id === 'signout') {
                return (
                  <button
                    key={item.id}
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                  >
                    {item.label}
                  </button>
                );
              }
              return <MenuItem key={item.id} item={item} />;
            })}
          </>
        )}
      </div>
    )}

      <Login isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
