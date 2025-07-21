import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MyPage() {
  const [member, setMember] = useState(null); // 회원 정보 상태

  // 마운트 시 정보 fetch
  useEffect(() => {
    const jwt = sessionStorage.getItem('jwt');
    fetch("/member/mypage", {
      method: "GET",
      headers: { 'Authorization': sessionStorage.getItem('jwt') },
    })
      .then((res) => {
        if (!res.ok) throw new Error("데이터 로드 실패");
        return res.json();
      })
      .then((data) => {
        setMember(data); // 서버 응답에 따라 .data, .result 등 달라질 수 있음
      })
      .catch((err) => {
        alert("회원 정보 로딩 실패: " + err.message);
      });
  }, []);

  if (!member) {
    return <div className="text-center p-8">로딩중...</div>;
  }

  // member.멤버필드명 으로 표시, 필요에 따라 구조 맞춰서
  return (
    <div className="w-[90%] mx-auto p-4">
      <div className="w-[90%] mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-8">Profile design</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-6 items-stretch">
            <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center gap-1 border h-96">
              <img
                src={member.member_img || "/nurung.png"}
                className="w-20 h-20 rounded-full bg-gray-200"
                alt="프로필"
              />
              <Link className="text-gray-400 text-sm">프로필 사진 변경</Link>
              <div className="text-lg font-semibold">{member.member_nick}</div>
              <div className="text-gray-500 text-xs">{member.memberId}</div>
              <div className="flex gap-2 mt-3">
                <button className="px-4 py-1 bg-blue-50 text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-100 transition">개인 정보</button>
                <button className="px-4 py-1 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition">비밀번호 변경</button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 flex flex-col gap-3 border">
              <div className="flex items-center gap-4">
                <div>
                  <div className="font-semibold">보유 누렁</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">{member.credit ? member.credit.toLocaleString() : "0"} 누렁</div>
            </div>
          </div>
          <div className="flex flex-col gap-6 items-stretch">
            <div className="bg-gray-50 rounded-xl p-6 border flex flex-col gap-3 min-h-[600px]">
              {/* 상세 프로필 등등 */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
