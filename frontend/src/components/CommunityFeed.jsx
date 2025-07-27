import React, { useEffect, useState } from 'react';
import { getIP } from '../components/Tool';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function CommunityFeed({ coin_no: propCoinNo }) {
  // ▶ URL 또는 props에서 coin_no 추출
  const { coin_no: paramsCoinNo } = useParams();
  const coin_no = propCoinNo || paramsCoinNo;

  // ▶ 상태 관리
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPosting, setIsPosting] = useState(false);

  // ▶ JWT 디코드
  const jwt = sessionStorage.getItem('jwt');
  let userInfo = null;

  if (jwt) {
    try {
      userInfo = jwtDecode(jwt);
    } catch (err) {
      console.error('JWT 디코딩 오류:', err);
    }
  }

  const size = 10;

  // 📌 게시글 불러오기 (초기/더보기)
  const fetchPosts = (targetPage) => {
    console.log("📡현재 페이지: ", targetPage);

    fetch(`http://${getIP()}:9093/community/coin/${coin_no}?page=${targetPage}&size=${size}`)
      .then(res => res.json())
      .then(data => {
        const newPosts = data.content || [];
        setPosts(prev => targetPage === 0 ? newPosts : [...prev, ...newPosts]);
        setIsLastPage(data.last);
      })
      .catch(err => console.error('목록 불러오기 실패', err));
  };

  // 🔄 페이지 변경 시 호출
  useEffect(() => {
    setPage(0);
    fetchPosts(0);
  }, [coin_no]);

  // ✍ 글 등록
  const handleCreate = async () => {
    if (!content.trim()) {
      alert('글을 입력해주세요');
      return;
    }

    setIsPosting(true);
    const formData = new FormData();
    const communityObj = {
      communityContent: content,
      coin: { coin_no: Number(coin_no) },
      member: { member_no: userInfo?.member_no },
    };

    formData.append('community', new Blob([JSON.stringify(communityObj)], { type: 'application/json' }));
    if (selectedFile) formData.append('file', selectedFile);

    try {
      const res = await fetch(`http://${getIP()}:9093/community/create`, {
        method: 'POST',
        headers: { Authorization: jwt },
        body: formData,
      });

      if (!res.ok) throw new Error('등록 실패');

      // 초기화 후 새로 불러오기
      setContent('');
      setSelectedFile(null);
      setPage(0);
      fetchPosts(0);
    } catch (err) {
      alert('글 등록 실패');
      console.error(err);
    }
  };

  const handleFocusInput = () => {
    if (!userInfo) {
      textareaRef.current && textareaRef.current.blur();
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 px-2 w-full">
      {/* ▶ 왼쪽: 글쓰기 + 게시글 */}
      <div className="w-full md:w-[70%] space-y-6">
        
        {/* ✍ 글쓰기 영역 */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 p-4 shadow rounded-md">
          <img>
          </img>
          <textarea
            className="w-full p-2 rounded border mb-2"
            rows={3}
            value={content}
            onFocus={handleFocusInput}
            onChange={(e) => setContent(e.target.value)}
            placeholder={userInfo ? "무엇이든 의견을 남겨보세요!" : "로그인 후 이용 가능"}
            disabled={!userInfo || isPosting}
          />

          <div className="flex justify-between items-center">
            {/* 이미지 업로드 */}
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                hidden
                id="fileInput"
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    setSelectedFile(e.target.files[0]);
                    e.target.value = null;
                  }
                }}
              />
              <label
                htmlFor="fileInput"
                className="p-1 border border-gray-300 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer"
              >
                🖼️
              </label>

              {/* 이미지 미리보기 */}
              {selectedFile && (
                <div className="relative mt-2">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="미리보기"
                    className="max-w-32 max-h-24 object-contain rounded shadow"
                  />
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 text-xs shadow"
                  >
                    ❌
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              등록
            </button>
          </div>
        </div>

        {/* 📰 게시글 리스트 */}
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.communityNo} className="bg-white dark:bg-gray-900 rounded-lg shadow p-4">
              <div className="flex items-center mb-2">
                <img
                  src={post.member?.member_img
                    ? `http://${getIP()}:9093/home/storage/${post.member.member_img}`
                    : "https://cdn.startupful.io/img/app_logo/no_img.png"}
                  alt="프로필"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div className="text-sm font-semibold">{post.member?.member_nick}</div>
                <div className="ml-2 text-xs text-gray-400">
                  {post.communityDate?.replace('T', ' ').slice(0, 16)}
                </div>
              </div>

              <div className="text-base mb-2 whitespace-pre-line">{post.communityContent}</div>

              {post.communityImg && (
                <img
                  src={`http://${getIP()}:9093/home/storage/${post.communityImg}`}
                  alt="첨부 이미지"
                  className="mt-2 max-h-60 max-w-full rounded"
                />
              )}
            </div>
          ))}

          {/* 👇 더보기 버튼 */}
          {!isLastPage && (
            <div className="text-center">
              <button
                className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                onClick={() => {
                  const nextPage = page + 1;
                  setPage(nextPage);
                  fetchPosts(nextPage);
                }}
              >
                더보기
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ▶ 오른쪽: 코인 정보 박스 */}
      <div className="hidden lg:block w-full lg:w-[30%] bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow h-fit">
        <h2 className="text-lg font-bold mb-2">📊 현재 코인 정보</h2>
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <p>코인 번호: {coin_no}</p>
          <p>예상 수익률: +12.3%</p>
          <p>AI 분석 등급: ⭐️⭐️⭐️⭐️</p>
        </div>
      </div>
    </div>
  );
}
