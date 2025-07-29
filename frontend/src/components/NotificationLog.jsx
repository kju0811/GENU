import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import { getIP } from "./Tool";

function NotificationLog() {
  const [data, setData] = useState([]);
  const jwt = sessionStorage.getItem("jwt");
  const { member_no } = useParams();

  // 알림 삭제 함수
  const handleDelete = async (notification_no) => {
    if (!window.confirm("정말 이 알림을 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`http://${getIP()}:9093/notification/${notification_no}`, {
        method: "DELETE",
        headers: { 'Authorization': jwt }
      });

      if (!res.ok) throw new Error("삭제 실패");

      // 삭제 성공 시 화면에서 해당 알림 제거
      setData(prev => prev.filter(item => item.notification_no !== notification_no));
    } catch (err) {
      console.error(err);
      alert("알림 삭제 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetch(`http://${getIP()}:9093/notification/find_by_MemberNotification/${member_no}`, {
      method: 'GET',
      headers: { 'Authorization': jwt }
    })
      .then(result => result.json())
      .then(data => {
        setData(data);
      })
      .catch(err => console.error(err));
  }, [jwt, member_no]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">알림 기록</h1>

      {data.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">알림 기록이 없습니다.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">번호</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">제목</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">내용</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">날짜</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">삭제</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((item) => (
                <tr key={item.notification_no} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.notification_no}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400 font-semibold">
                    <Link to={`/notification/${item.notification_no}`} className="hover:underline">
                      {item.notification_nametype}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.notification_text}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(item.notification_date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleDelete(item.notification_no)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                      aria-label="알림 삭제"
                      title="알림 삭제"
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default NotificationLog;
