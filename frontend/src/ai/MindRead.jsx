import React, { useState, useEffect } from 'react';
import { getIP } from '../components/Tool';
import { useParams, useNavigate } from 'react-router-dom';
import load from "../images/로딩.gif";

export default function MindRead() {
  const { mindno } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://${getIP()}:9093/mind/read/${mindno}`)
      .then(res => {
        if (!res.ok) throw new Error("데이터 조회 실패");
        return res.json();
      })
      .then(result => setData(result))
      .catch(err => console.error("심리 분석 불러오기 오류:", err))
      .finally(() => setLoading(false));
  }, [mindno]);

  if (loading) {
    return (
      <div className="text-center mt-20">
        <img src={load} alt="로딩 중" className="mx-auto w-16" />
        <p className="mt-2 text-gray-500">분석 결과를 불러오는 중...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-red-500 mt-10">해당 분석 결과를 찾을 수 없습니다.</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow mt-10">
      {/* 뒤로가기 */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-indigo-500 hover:underline text-sm"
        >
          ← 목록으로 돌아가기
        </button>
      </div>

      {/* 헤더 */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-indigo-600 mb-2">🧠 AI 심리 분석 결과</h2>
        <p className="text-sm text-gray-500">{data.minddate}</p>
      </div>

      {/* 내용 */}
      <div className="border-l-4 border-indigo-400 pl-4">
        <p className="whitespace-pre-line text-gray-800 text-base leading-relaxed">
          {data.mindcontent}
        </p>
      </div>
    </div>
  );
}
