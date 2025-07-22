import React, { useState, useEffect, useRef } from 'react';
import { getIP } from './Tool';
import { jwtDecode } from 'jwt-decode';

export default function NoticeModal({ coin_no, onClose }) {
  const [noticePrice, setNoticePrice] = useState('');
  const [myNoticeList, setMyNoticeList] = useState([]);
  const jwt = sessionStorage.getItem("jwt");
  const modalRef = useRef();
  let [memberNo, setMemberNo] = useState(null);

  useEffect(() => {
    try {
      const decoded = jwtDecode(jwt);
      setMemberNo(decoded.member_no);
      fetch(`http://${getIP()}:9093/notice/member/${decoded.member_no}/coin/${coin_no}`, {
        method: 'GET',
        headers: { 'Authorization': jwt }
      })
        .then(result => result.json())
        .then(setMyNoticeList)
        .catch(err => console.error(err))
    } catch (err) {
      console.error("Invalid token:", err.message);
    }
  }, [jwt, coin_no]); // coin_no 변경 시도 반영

  // 외부 클릭 감지
  useEffect(() => {
    const handler = e => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [onClose]);

  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    const notice = {
      coin: { "coin_no": coin_no },
      member: { "member_no": memberNo },
      notice_price: parseInt(noticePrice),
    };
    try {
      const response = await fetch(`http://${getIP()}:9093/notice/create`, {
        method: 'POST',
        headers: {
          'Authorization': jwt,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notice)
      });
      if (response.ok) {
        const result = await response.json();
        setMyNoticeList(prev => [
          ...prev,
          {
            notice_no: result.notice_no,
            notice_price: notice.notice_price
          }
        ]);
        setNoticePrice('');
        alert('알림이 등록되었습니다.');
      } else {
        alert('숫자만 입력해주세요');
      }
    } catch (err) {
      console.error(err);
      alert('서버 오류');
    }
  };

  const handleDelete = async (notice_no) => {
    try {
      const response = await fetch(`http://${getIP()}:9093/notice/${notice_no}`, {
        method: 'DELETE',
        headers: {
          'Authorization': jwt,
        },
      });
      if (response.ok) {
        alert('삭제되었습니다.');
        setMyNoticeList(prev => prev.filter(item => item.notice_no !== notice_no));
      } else {
        alert('삭제 실패');
      }
    } catch (err) {
      console.error(err);
      alert('서버 오류');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 min-w-[700px] max-w-[800px] w-full min-h-[550px] max-h-[550px]" ref={modalRef}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold">금액 알림 등록</span>
          <button onClick={onClose} className="text-gray-400 text-2xl font-bold hover:text-red-400 px-2">×</button>
        </div>
        <div className="flex flex-col md:flex-row gap-8 h-[400px]">
          {/* 알림가 등록 (왼쪽, 세로 중앙) */}
          <form
            onSubmit={handleNoticeSubmit}
            className="flex flex-col justify-center gap-4 w-full md:w-1/2 h-full"
          >
            <div className="font-semibold text-gray-600 mb-2">알림가 등록</div>
            <input
              // type="number"
              placeholder="알림 금액(숫자)"
              value={noticePrice}
              onChange={e => setNoticePrice(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-200"
              required
            />
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              등록
            </button>
          </form>
          {/* 알림가 목록 (오른쪽, 스크롤 고정) */}
          <div className="w-full md:w-1/2 h-full flex flex-col">
            <div className="mb-2 text-base font-semibold text-gray-600">내 알림 목록</div>
            <ul className="text-base flex-1 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-100 max-h-full">
              {myNoticeList.length === 0 && (
                <li className="text-gray-400 text-center py-3">등록된 알림이 없습니다.</li>
              )}
              {myNoticeList.map(item => (
                <li key={item.notice_no}
                  className="border border-gray-200 p-2 rounded flex justify-between items-center bg-gray-50 hover:bg-blue-50 transition">
                  <span>알림 금액: <span className="font-semibold text-blue-700">{item.notice_price.toLocaleString()}</span> 원</span>
                  <button
                    onClick={() => handleDelete(item.notice_no)}
                    className="text-red-500 hover:text-red-700 ml-3 text-lg"
                    title="알림 삭제"
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
