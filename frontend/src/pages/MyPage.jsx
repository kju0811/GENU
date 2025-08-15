import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { getIP } from '../components/Tool';
import { jwtDecode } from 'jwt-decode';
import ProfileImageEdit from '../components/ProfileImageEdit';

const TABS = [
  { key: "portfolio", label: "내 자산" },
  { key: "balancelist", label: "자산내역" },
  { key: "memberupdate", label: "개인정보 수정" },
  { key: "changepw", label: "비밀번호 변경" },
  { key: "membermind", label: "심리분석" },
  { key: "coinlikelist", label: "좋아요목록" },
];

export default function MyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [member, setMember] = useState(null);
  const [attendanceCnt, setAttendanceCnt] = useState(null);

  const jwt = sessionStorage.getItem('jwt');
  let userInfo = null;
  if (jwt) {
    try { userInfo = jwtDecode(jwt); } catch { }
  }
  const member_no = userInfo?.member_no;

  const currentTab = location.pathname.split('/').pop();

  useEffect(() => {
    if (!member_no) return;
    fetch(`http://${getIP()}:9093/member/read/${member_no}`)
      .then(res => res.json())
      .then(data => setMember(data))
      .catch(err => setMember(null));

    fetch(`http://${getIP()}:9093/attendance/attendanceCnt/${member_no}`, {
      headers: {
        Authorization: jwt
      }
    })
      .then(res => res.json())
      .then(setAttendanceCnt)
      .catch(() => setAttendanceCnt(null));
  }, [member_no]);

  if (!member) {
    return <div className="text-center p-8">로딩중...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg flex w-full min-h-[700px]">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r rounded-l-2xl flex flex-col items-center py-8">
        <div className="flex flex-col items-center mb-10">
          <img
            src={member?.member_img
              ? `http://${getIP()}:9093/home/storage/${member.member_img}`
              : "/nurung.png"}
            alt="프로필"
            className="rounded-full object-cover border-2 border-blue-300"
            style={{ width: 160, height: 160, cursor: "pointer" }}
            onClick={() => setModalOpen(true)}
          />
          <div className="text-lg font-semibold mt-3">{member.member_nick}</div>
          <div className="text-gray-500 text-xs">{member.memberId}</div>
          <div className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full mt-1 mb-1 font-semibold shadow-sm">
            출석일수: {attendanceCnt}일
          </div>
        </div>
        <nav className="flex flex-col w-full gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`w-full text-left px-6 py-3 rounded-lg transition font-medium
                ${currentTab === tab.key
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-blue-100"}`}
              onClick={() => navigate(`/mypage/${tab.key}`)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="mb-8 flex items-center gap-4">
          <div className="text-2xl font-bold">
            {TABS.find((t) => t.key === currentTab)?.label}
          </div>
          <div className="text-gray-400 text-sm">| 정보</div>
        </div>
        <Outlet context={{ member_no, jwt }} />
      </main>

      <ProfileImageEdit
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        memberNo={member_no}
        originUrl={member?.member_img ? `http://${getIP()}:9093/home/storage/${member.member_img}` : "/nurung.png"}
        onSuccess={newFileName => {
          setMember(prev => ({
            ...prev,
            member_img: newFileName,
          }));
        }}
      />
    </div>
  );
}
