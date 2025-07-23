import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getIP } from '../components/Tool';
import { jwtDecode } from 'jwt-decode';
import mind from '../ai/Mind';
import CoinLikeList from '../components/CoinLikeList';

const TABS = [
  { key: "info", label: "개인정보" },
  { key: "changeInfo", label: "개인정보 수정" },
  { key: "changePw", label: "비밀번호 변경" },
  { key: "memberMind", label: "심리분석" },
  { key: "coinlikelist", label: "좋아요목록" },
];

export default function MyPage() {
  const [member, setMember] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [imgFile, setImgFile] = useState(null);      // 실제 파일
  const [imgPreview, setImgPreview] = useState(null); // 미리보기 URL
  const [isUploading, setIsUploading] = useState(false);
  const [myNurung, setMyNurung] = useState(0);
  const { getDeal,createmind,mindata,load,list,info } = mind();

  // 예시
  // const { coin_no } = useParams(); // coin_no 파라미터 받아오기
  const [activeTab, setActiveTab] = useState("info");
  const [detail, setDetail] = useState(null);
  const jwt = sessionStorage.getItem('jwt');
  let userInfo = null;
  if (jwt != null) {
    try {
      userInfo = jwtDecode(jwt);
    } catch (err) {}
  }
  const member_no = userInfo?.member_no;
  const filtermember = mindata.find(item => item.member.member_no == member_no)

  // 딜 정보 담기
  useEffect(()=> {
    getDeal()
  },[])

  useEffect(() => {
    if (!member_no) return;
    // 회원 정보 fetch
    fetch(`http://${getIP()}:9093/member/read/${member_no}`, {
      method: 'GET'
    })
      .then(res => res.json())
      .then(data => setMember(data))
      .catch(err => console.error(err));

    // 보유 누렁
    fetch(`http://${getIP()}:9093/pay/my/${member_no}`, {
        method: 'GET',
        headers: { 'Authorization': jwt }
    })
        .then(res => res.json())
        .then(data => setMyNurung(data))
        .catch(err => setMyNurung(0));
  }, [member_no]);

    // 보유 코인
    // useEffect(() => {
    //   const fetchDetail = () => {
    //     fetch(`http://${getIP()}:9093/coin/${coin_no}`)
    //       .then(res => res.json())
    //       .then(data => {
    //         setDetail(data);
    //       })
    //       .catch(err => {
    //         console.error(err);
    //       });
    //   };
    //   fetchDetail();
    // }, [coin_no]);

    if (!member) {
      return <div className="text-center p-8">로딩중...</div>;
    }


  return (
    <div className="bg-white rounded-2xl shadow-lg flex w-full min-h-[700px]">
      {/* Left Sidebar */}
      <aside className="w-60 bg-white border-r rounded-l-2xl flex flex-col items-center py-8">
        {/* Coin thumbnail & info */}
        <div className="flex flex-col items-center mb-10">
          <img
            src='/nurung.png'
            className="w-20 h-20 rounded-full bg-blue-200 mb-4 flex items-center justify-center text-4xl font-bold text-blue-600">
          </img>
          <div className="text-lg font-semibold">{member.member_nick}</div>
          <div className="text-gray-500 text-xs">{member.memberId}</div>
        </div>
        {/* Vertical Tabs */}
        <nav className="flex flex-col w-full gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`w-full text-left px-6 py-3 rounded-lg transition font-medium
                ${activeTab === tab.key
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-blue-100"}
              `}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        {/* Content Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="text-2xl font-bold">
            {TABS.find((t) => t.key === activeTab)?.label}
          </div>
          <div className="text-gray-400 text-sm">| 정보</div>
        </div>
        {/* Tab Panels */}
        {activeTab === "info" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 카드 */}
              <div className="bg-blue-600 rounded-xl text-white p-6 shadow-lg">
                <div className="text-lg font-semibold mb-2">보유금액</div>
                <div className="text-3xl font-bold mb-4">
                {
                  typeof myNurung === 'object'
                    ? (myNurung.message || JSON.stringify(myNurung))
                    : Number(myNurung).toLocaleString()
                } 누렁
              </div>
                <div className="text-xs opacity-80">2025.07.21 15:12 기준</div>
                <div className="mt-6 text-sm flex items-center gap-2">
                  <span className="bg-white bg-opacity-10 px-2 py-1 rounded-lg">전일대비 ▲ 2.1%</span>
                  <span className="bg-white bg-opacity-10 px-2 py-1 rounded-lg">거래량 24,000 BTC</span>
                </div>
              </div>
              {/* 오늘의 이슈 */}
              <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col">
                <div className="font-semibold mb-3 text-gray-700">Today’s Issue</div>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 코인 ETF 관련 호재 뉴스</li>
                  <li>• 채굴 난이도 상승, 네트워크 안정</li>
                  <li>• 주요 거래소 입출금 일시 중단 공지</li>
                </ul>
              </div>
            </div>
            {/* 최근 거래 리스트 (데모) */}
            <div className="mt-10">
              <div className="font-semibold mb-2 text-gray-700">최근 거래</div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between text-md text-black-400 pb-1 border-b mb-2">
                  <span>현재 10% 매도 흐름입니다</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "changeInfo" && (
          <div className="flex flex-col">
            <div className="bg-gray-300 rounded-xl shadow p-8 w-full min-w-[600px] min-h-[500px] flex flex-col">
              <div>
                {/* {detail.coin_info} */}
              </div>
            </div>
          </div>
        )}
        {activeTab === "changePw" && (
          <div className="flex flex-col">
            <div className="bg-gray-300 rounded-xl shadow p-8 w-full min-w-[600px] min-h-[500px] flex flex-col">
              <div>
                {/* {detail.coin_info} */}
              </div>
            </div>
          </div>
        )}
        {activeTab === "memberMind" && (
          <div className="flex flex-col">
            <div>
            {list()} <span className="text-gray-400" style={{marginLeft:'30%',fontSize:'15px'}}>📢 아래 주의사항 한번씩만 읽어주세요</span>
            </div>
            <div className="bg-gray-300 rounded-xl shadow p-8 w-full min-w-[600px] min-h-[500px] flex flex-col">
              <div>
              {filtermember && (
              <span>{mindata[0].mindcontent}</span>
              )}
              </div>  
            </div>
              <button onClick={()=>createmind()}>심리분석 요청하기</button>
              {load()}
              {info()}
          </div>
        )}
        {activeTab === "coinlikelist" && (
          <div className="flex flex-col">
            <CoinLikeList member_no={member_no} />
          </div>
        )}
      </main>
    </div>
  );
}
