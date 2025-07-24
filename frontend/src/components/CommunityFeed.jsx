import React, { useEffect, useState } from 'react';
import { getIP } from '../components/Tool';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function CommunityFeed({ coin_no: propCoinNo }) {
  const { coin_no: paramsCoinNo } = useParams();
  const coin_no = propCoinNo || paramsCoinNo;

  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [page, setPage] = useState(0);
  const size = 10;

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

  // 게시글 목록 불러오기
  useEffect(() => {
    fetch(`http://${getIP()}:9093/community/coin/${coin_no}?page=${page}&size=${size}`)
      .then(res => res.json())
      .then(data => setPosts(data.content || []))
      .catch(err => console.error("목록 불러오기 실패", err));
  }, [coin_no, page]);

    // 글 작성
    const handleCreate = async () => {
      if (!content.trim()) return;
      try {
        const res = await fetch(`http://${getIP()}:9093/community/create`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt,
          },
          body: JSON.stringify({
            communityContent: content,
            coin: { coin_no: Number(coin_no) },
            member: { member_no: userInfo?.member_no }
          })
        });
        if (!res.ok) throw new Error("등록 실패");
        setContent("");
        // 새로고침 대신 fetch로 목록만 갱신!
        fetch(`http://${getIP()}:9093/community/coin/${coin_no}?page=0&size=10`)
          .then(res => res.json())
          .then(data => setPosts(data.content || []));
      } catch (err) {
        alert("글 등록에 실패했습니다");
      }
    };

    return (
      <div className="min-w-[400px] max-w-[1000px] p-4 space-y-6">
        {/* 글작성 UI */}
        <div className="bg-white dark:bg-gray-900 rounded-md p-4 shadow mb-2">
          <textarea
            className="w-full p-2 rounded border mb-2"
            rows={3}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="무엇이든 의견을 남겨보세요!"
          />
          <div className="flex justify-end">
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleCreate}
            >
              등록
            </button>
          </div>
        </div>
        {/* 게시글 리스트 */}
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.communityNo} className="bg-white dark:bg-gray-900 rounded-lg shadow p-4">
              <div className="flex items-center mb-2">
                <img
                  src={
                    post.member?.member_img
                      ? `http://${getIP()}:9093/home/storage/${post.member.member_img}`
                      : "https://cdn.startupful.io/img/app_logo/no_img.png"
                  }
                  alt=""
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div className="text-sm font-semibold">
                  {post.member?.member_nick}
                </div>
                <div className="ml-2 text-xs text-gray-400">
                  {post.communityDate && post.communityDate.replace('T', ' ').slice(0, 16)}
                </div>
              </div>
              <div className="text-base mb-2 whitespace-pre-line">{post.communityContent}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }