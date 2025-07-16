import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getIP } from "../components/Tool";
import { jwtDecode } from "jwt-decode";
import basic from "../images/profile.png"

export default function NewsRead() {
  const [data, setData] = useState("");
  const [reply,setReply] = useState("");
  const [showReply,setShowReply] = useState([]);
  const [userReply,setUserReply] = useState([]);
  const [user,setUser] = useState([]);
  const [userData,setUserData] = useState([]);
  const [member,setMember] = useState([]);
  const { news_no } = useParams();

  const filteredUserData = userData.filter(reply => reply.news.news_no == news_no);
  const filteredUser = user.filter((_, index) => userData[index]?.news.news_no == news_no);
  const filteredUserReply = userReply.filter((_, index) => userData[index]?.news.news_no == news_no);
  const filteredShowReply = showReply.filter((_, index) => userData[index]?.news.news_no == news_no);

  const jwt = sessionStorage.getItem('jwt');
  let userInfo = null;
  if (jwt != null) {
    try {
      userInfo = jwtDecode(jwt);
      console.log("토큰있음");
    } catch (err) {
      console.error("JWT 디코딩 오류:", err);
    }
  } else {
    console.log("토큰없음");
  }

  const member_no = userInfo?.member_no;

  const createReply=(reply)=> {
    console.log("댓글: ",reply);
    fetch(`http://${getIP()}:9093/newsreply/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': jwt,
      },
      body: JSON.stringify({ 
        "newsreply_content":reply,
        "member":{"member_no" : member_no},
        "news":{ "news_no" : news_no }
      }),
    })
    .then((res) => {
      if (!res.ok) throw new Error('댓글 작성 실패');
      return res.json();
    })
    .then(() => {
      fetchReplies();  // 작성 후 목록 새로고침
      setReply('');
    })
    .catch((err) => console.error(err));
  }

  const fetchReplies = () => {
  fetch(`http://${getIP()}:9093/newsreply/findall`)
    .then(res => res.json())
    .then(data => {
      setShowReply(data.map(item => item.newsreply_content));
      setUserReply(data.map(item => item.member.member_nick));
      setUser(data.map(item => item.member.member_no));
      setUserData(data);
    })
    .catch(console.error);
};

useEffect(() => {
  fetchReplies();
}, []);

useEffect(() => {
  fetch(`http://${getIP()}:9093/member/list`, {
      method: 'GET'
    })
      .then(result => result.json()) // 응답
      .then(result => {
        setMember(result);
      })
    .catch(err => console.error(err))
}, []);

  useEffect(() => {
    fetch(`http://${getIP()}:9093/news/read/${news_no}`, {
      method: 'GET'
    })
      .then(result => result.json()) // 응답
      .then(result => {
        setData(result);
      })
      .catch(err => console.error(err))
  }, [news_no]);

  const deleteNews = () => {
    if (window.confirm("뉴스를 삭제하시겠습니까?")) {
      fetch(`http://${getIP()}:9093/news/delete/${news_no}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': jwt
        },
      })
        .then(response => {
          if (response.ok) {
            alert('뉴스가 성공적으로 삭제 되었습니다');
            const query = `?page=${page}${word ? `&word=${encodeURIComponent(word)}` : ''}`;
            window.location.href = `/ai/newsfind${query}`;
          } else {
            alert('삭제에 실패하였습니다');
          }
        })
    }
  }

  return (
    <div className="w-[90%] mx-auto p-4">

      {/* 기사 */}
      <div className="bg-gray-50 rounded-xl overflow-hidden w-full">
        <div className="flex flex-col p-4 gap-4">
          {/* 제목 & 날짜 */}
          <div className="w-[90%] mx-auto p-4">
            <div className="space-y-2">
              {/* @크기 및 색깔 조절하기 */}
              <span className="text-3xl font-extrabold">{data.title}</span><br/>
              <span className="text-gray-500 dark:text-orange-400">{data.newsrdate}</span>
            </div>
          </div>
          {/* Image */}
          <img
            src={`http://${getIP()}:9093/home/storage/${data.file1}.jpg`}
            className="mx-auto w-2/3 aspect-video bg-gray-200 rounded-lg object-cover"
            alt="NewsImg"
          />
          {/* Content */}
          <div className="w-[90%] mx-auto p-4">
            {/* 요약 내용 */}
            <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 space-y-2">
              <span className="text-gray-500 dark:text-orange-400">
                {data.summary}
                </span>
              {/* @패딩 주기 */}
            </div>
            {/* 본문 내용 */}
            <div className="space-y-2">
              <span>{data.content}</span>
            </div>
            {/* 이전/다음 기사 */}
            <div className="flex items-center gap-3 mt-2">
              <button 
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-500">
                답글
              </button>
              <button 
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-500">
                답글
              </button>
            </div>

          </div>
        </div>
      </div>


      {/* 댓글 */}
      <div className="bg-gray-50 rounded-xl overflow-hidden w-full">
        <div className="w-[90%] mx-auto p-4">
          {/* Comment Section */}
          <div className="space-y-6">
            {/* 본 댓글 */}
            {filteredUser.map((member_no,index) => (
            <div key={index}>
            <div className="border-b dark:border-gray-700 pb-6">
              <div className="flex gap-4">
                {/* Avatar */}
                <img
                  src={
                    (() => {
                      const matchedMember = member.find(
                        (m) => m.member_no === userData[index]?.member?.member_no
                      );
                      return matchedMember?.member_img
                        ? `http://${getIP()}:9093/home/storage/${matchedMember.member_img}`
                        : basic; // 기본 이미지
                    })()
                  }
                  alt="MemberImg"
                  className="w-8 h-8 rounded-full mt-1"
                />

                {/* Comment Content */}
                <div key={index} className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-black dark:text-white">{filteredUserReply[index]}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{filteredUserData[index]?.newsreplyDate}</span>
                  </div>
                  <p className="text-sm text-black dark:text-white mb-3">
                    {filteredShowReply[index]}
                  </p>

                  {/* Action Buttons */}
                  {/* <div className="flex gap-4 items-center"> */}
                    {/* @답글 누를경우 댓글 입력에 그 댓글의 멤버Nick을 (@Nick) 형태로 언급  */}
                    {/* <button 
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-500">
                      답글
                    </button>
                  </div> */}
                  {/* @버튼을 클릭하면 대댓글이 보였다 안 보였다 하도록  */}
                  {/* <button 
                  className="text-xs text-blue-500 dark:text-blue-400 hover:text-indigo-500">
                    답글2개 ⬇️?⬆️
                  </button> */}
                </div>
              </div>
            </div>

            {/* 대댓글 */}
            {/* <div className="border-b dark:border-gray-700 pb-6 ml-6">
              <div className="flex gap-4"> */}
                {/* Vertical Line & MemberImg */}
                {/* <div className="relative">
                  <div className="absolute -left-6 top-4 h-full w-px bg-gray-200 dark:bg-gray-700" />
                  <img
                    src="https://cdn.startupful.io/img/app_logo/no_img.png"
                    alt="MemberImg"
                    className="w-8 h-8 rounded-full mt-1"
                  />
                </div> */}

                {/* Comment Content */}
                {/* <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-black dark:text-white">Emma Chen</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">3h ago</span>
                  </div>
                  <p className="text-sm text-black dark:text-white mb-3">
                    <span className="text-indigo-500">@안기모 </span>
                    안기모씨 맞으신가요?
                  </p> */}

                  {/* Action Buttons */}
                  {/* <div className="flex gap-4 items-center">
                    <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-500">Reply</button>
                    <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-500">Share</button>
                    <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-500">Report</button>
                  </div>
                </div> */}
              {/* </div>
            </div> */}
            </div>
            ))}

            {/* 댓글 입력 */}
            {userInfo?.role == "USER" || userInfo?.role == "ADMIN" ? (
            <div className="flex gap-4 items-start pt-4">
              <img
                src="https://cdn.startupful.io/img/app_logo/no_img.png"
                alt="MemberImg"
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                {/* @텍스트박스 스크롤형태로 변경 */}
                <textarea
                  className="w-full p-3 text-sm bg-gray-50 dark:bg-[#252731] text-black dark:text-white rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Write a comment..."
                  style={{ resize: "none" }}
                  onChange={(e) => setReply(e.target.value)} 
                  value={reply} 
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <button 
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600"
                  onClick={()=> createReply(reply)}
                  >
                    댓글
                  </button>
                </div>
              </div>
            </div>) : <textarea
                        className="w-full p-3 text-sm bg-gray-50 dark:bg-[#252731] text-black dark:text-white rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="로그인 후 이용해주세요"
                        style={{ resize: "none" }}
                        disabled
                        value={reply} 
                        rows={3}
                      />}
          </div>
        </div>
      </div>

    </div>
  );
}
