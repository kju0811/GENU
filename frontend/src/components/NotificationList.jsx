import React, { useEffect, useRef, useState, useCallback, memo } from 'react';

/**
 * 더미 알림 데이터 (시각적 확인용, 나중에 삭제)
 */
const dummyNotifications = [
  { id: 1, title: 'New Feature Available', contents: 'Check out our latest updates and improvements', rdate: '2 minutes ago', img: 'https://i.ibb.co/99rtT6H1/image.jpg', bgColor: 'bg-blue-100' },
  { id: 2, title: 'Task Completed', contents: 'Project milestone successfully achieved', rdate: '1 hour ago', img: 'https://i.ibb.co/99rtT6H1/image.jpg', bgColor: 'bg-green-100' },
  { id: 3, title: 'Server Alert', contents: 'High CPU usage detected', rdate: '5 hours ago', img: 'https://i.ibb.co/99rtT6H1/image.jpg', bgColor: 'bg-red-100' },
  // ... 추가 항목이 많아질 경우 스크롤 생성
];

/**
 * NotificationItem 컴포넌트
 * - 단일 알림 데이터를 표시합니다.
 * - React.memo로 감싸 재렌더링 최적화
 */
const NotificationItem = memo(({ item }) => (
  <li className="p-3 rounded-lg shadow-sm flex items-start space-x-3 bg-white dark:bg-[#2A2C36]">
    <div className="flex-shrink-0">
      <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${item.bgColor}`}>
        <img src={item.img} alt={`${item.title} icon`} className="w-5 h-5" />
      </span>
    </div>
    <div className="flex-1">
      <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
      <p className="text-gray-500 text-sm dark:text-gray-400">{item.contents}</p>
      <span className="text-xs text-gray-400 mt-1 block">{item.rdate}</span>
    </div>
  </li>
));

/**
 * NotificationDropdown 컴포넌트
 * - 버튼 클릭 시 드롭다운을 통해 알림 목록 표시
 * - 알림 항목이 많을 경우 스크롤 가능
 */
export default function NotificationDropdown({ notifications = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleOpen = useCallback(() => setIsOpen(prev => !prev), []);

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

  // props 알림 없으면 더미 사용
  const data = notifications.length > 0 ? notifications : dummyNotifications;
  const displayCount = data.length > 9 ? '9+' : data.length;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button onClick={toggleOpen} className="flex items-center gap-3 px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E2028] rounded-lg shadow hover:shadow-md transition-all">
        <div className="relative inline-block">
          <img src="https://cdn.startupful.io/img/app_logo/no_img.png" alt="User profile" className="w-10 h-10 rounded-full object-cover" />
          {data.length > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 bg-red-500 rounded-full text-xs text-white border-2 border-white px-1">{displayCount}</span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 z-50 bg-white dark:bg-[#1E2028] rounded-lg shadow-lg p-4">
          {data.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">No notifications</p>
          ) : (
            <ul className="space-y-3 max-h-64 overflow-auto">  {/* max-h-64 및 overflow-auto로 스크롤 */}
              {data.map(item => <NotificationItem key={item.id} item={item} />)}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
