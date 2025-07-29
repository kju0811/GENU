import React, { useEffect, useRef, useState, useCallback } from 'react';
import { getIP } from "../components/Tool";
import { jwtDecode } from 'jwt-decode';
import bell from "../images/bell.png";
import { useNavigate, Link } from 'react-router-dom';

export default function NotificationDropdown({ notifications: initialNotifications = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleOpen = useCallback(() => setIsOpen(prev => !prev), []);
  const jwt = sessionStorage.getItem("jwt");
  const [notifications, setNotifications] = useState(initialNotifications);

  // JWT에서 memberNo 추출
  const [memberNo, setMemberNo] = useState(null);
  useEffect(() => {
    try {
      if (jwt) {
        const decoded = jwtDecode(jwt);
        setMemberNo(decoded.member_no);
      }
    } catch (err) {
      console.error("Invalid token:", err.message);
    }
  }, [jwt]);

  // memberNo가 있을 때만 알림 불러오기
  useEffect(() => {
    if (!memberNo) return;
    if (typeof jwt === 'string' && jwt.length > 0) {
      fetch(`http://${getIP()}:9093/notification/find_by_readtype0/${memberNo}`, {
        method: 'GET',
        headers: { 'Authorization': jwt }
      })
        .then(result => result.json())
        .then(data => {
          setNotifications(data);
        })
        .catch(err => console.error(err))
    }
  }, [jwt, memberNo]);

  // 알림 클릭 처리
  const handleNotificationClick = async (notificationNo) => {
    try {
      const res = await fetch(`http://${getIP()}:9093/notification/clickNotification/${notificationNo}`, {
        method: 'POST',
        headers: { 'Authorization': jwt }
      });

      if (!res.ok) {
        throw new Error("알림 읽음 처리 실패");
      }

      const data = await res.json();
      const { notification_nametype, notification_targetno } = data;
      setIsOpen(false);
      setNotifications(prev => prev.filter(n => n.notification_no !== notificationNo));

      if (notification_nametype === "금액알림") {
        navigate(`/coin/${notification_targetno}`);
      } else if (notification_nametype === "뉴스알림") {
        navigate(`/ai/read/${notification_targetno}`);
      } else {
        navigate(`/notification/${notificationNo}`);
      }

    } catch (error) {
      console.error("알림 처리 실패:", error);
    }
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const data = notifications.length > 0 ? notifications : [];
  const displayCount = data.length > 9 ? '9+' : data.length;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button onClick={toggleOpen} className="flex items-center gap-3 px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E2028] rounded-lg shadow hover:shadow-md transition-all">
        <div className="relative inline-block">
          <img
            src={bell}
            alt="알림(notice)"
            className="w-10 h-10 rounded-full object-cover"
          />
          {data.length > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 bg-red-500 rounded-full text-xs text-white border-2 border-white px-1">{displayCount}</span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 z-50 bg-white dark:bg-[#1E2028] rounded-lg shadow-lg p-4">
          {data.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400">현재 알림이 없습니다.</p>
          )}

          {data.length > 0 && (
            <ul className="space-y-3 max-h-64 overflow-auto">
              {data.map(item => (
                <li key={item.notification_no} className="p-3 rounded-lg shadow-sm flex items-start space-x-3 bg-white dark:bg-[#2A2C36] hover:bg-gray-100 dark:hover:bg-[#2e303a] transition">
                  <div onClick={() => handleNotificationClick(item.notification_no)} className="flex w-full space-x-3 cursor-pointer">
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${item.bgColor}`}>
                        <img src={item.img} alt={`${item.title} icon`} className="w-5 h-5" />
                      </span>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900 dark:text-white">{item.notification_nametype}</p>
                      <p className="text-gray-500 text-sm dark:text-gray-400">{item.notification_text}</p>
                      <span className="text-xs text-gray-400 mt-1 block">{item.notification_date}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-2 border-t pt-2 text-center">
            <Link
              to={memberNo ? `/notification/find_by_MemberNotification/${memberNo}` : '/notification/log'}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              이전 알림내역 보기
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
