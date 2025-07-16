import React, { useState, useEffect } from 'react';
import { getIP } from './Tool';
import { jwtDecode } from 'jwt-decode';

export default function NoticeModal({ coin_no, onClose }) {
  const [noticePrice, setNoticePrice] = useState('');
  const [myNoticeList, setMyNoticeList] = useState([]); 
  let [memberNo, setMemberNo] = useState(null);
  const jwt = sessionStorage.getItem("jwt");
  // const token = localStorage.getItem('token');

  useEffect(() => {
    try {
      const decoded = jwtDecode(jwt);
      console.log(decoded);
      const decodedMemberNo = decoded.member_no;
      setMemberNo(decoded.member_no);

      console.log("member_no -> ", decodedMemberNo);
      fetch(`http://${getIP()}:9093/notice/member/${decodedMemberNo}/coin/${coin_no}`, {
        method: 'GET',
        headers : { 'Authorization' : jwt }

      })
      .then(result => result.json())
      .then(data => {
        console.log("알림기록date -> ", data)
        setMyNoticeList(data);

      })
      .catch(err => console.error(err))

    } catch (err) {
      console.error("Invalid token:", err.message);
    }
  }, [jwt])

  const handleNoticeSubmit = async (e) => {
    e.preventDefault();

    const notice = {
      coin: {"coin_no": coin_no},
      member: {"member_no": memberNo},
      notice_price: parseInt(noticePrice),
    }

    try {
      const response = await fetch(`http://${getIP()}:9093/notice/create`, {
        method: 'POST',
        headers: { 
          'Authorization' : jwt ,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notice)
      });
      if (response.ok) {
        alert('알림이 등록되었습니다.');
        setNoticePrice('');
        onClose();
      } else {
        alert('등록 실패');
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
        // 프론트 리스트에서도 삭제
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
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">금액 알림 등록</h2>
        <form onSubmit={handleNoticeSubmit}>
          <input
            type="number"
            placeholder="알림 받을 금액"
            value={noticePrice}
            onChange={(e) => setNoticePrice(e.target.value)}
            className="w-full border px-3 py-2 mb-4 rounded"
            required
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              등록
            </button>
          </div>
        </form>
        <ul className="text-sm space-y-1 max-h-32 overflow-y-auto">
          {myNoticeList.map((item, index) => (
            <li key={index} className="border p-2 rounded bg-gray-50 flex justify-between items-center">
              <span>알림 금액: {item.notice_price.toLocaleString()}원</span>
              <button
                onClick={() => handleDelete(item.notice_no)}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
