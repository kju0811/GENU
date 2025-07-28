import React, { useEffect, useState, useRef } from 'react';
import { getIP } from '../components/Tool';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

/**
 * CommunityFeed
 * - 특정 코인 커뮤니티 피드(글 작성/조회/좋아요)
 * - 무한스크롤(더보기), 이미지 업로드, 글 등록, 좋아요/취소
 */
export default function CommunityFeed({ coin_no: propCoinNo }) {
  // [1] coin_no 추출 (props 우선, 없으면 URL)
  const { coin_no: paramsCoinNo } = useParams();
  const coin_no = propCoinNo || paramsCoinNo;

  // [2] 상태 관리
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [likes, setLikes] = useState([]);
  const [member, setMember] = useState(null);

  const textareaRef = useRef(null);

  // [3] JWT/로그인 회원 정보
  const jwt = sessionStorage.getItem('jwt');
  let userInfo = null;
  if (jwt) {
    try { userInfo = jwtDecode(jwt); } catch {}
  }
  const member_no = userInfo?.member_no;
  const size = 10; // 페이지당 게시글 수

  // [4] 내 프로필 정보(글쓰기용)
  useEffect(() => {
    if (!member_no) return;
    fetch(`http://${getIP()}:9093/member/read/${member_no}`)
      .then(res => res.json())
      .then(setMember)
      .catch(() => setMember(null));
  }, [member_no]);

  // [5] 커뮤니티 글 목록(페이지네이션)
  const fetchPosts = (targetPage) => {
    fetch(`http://${getIP()}:9093/community/coin/${coin_no}?page=${targetPage}&size=${size}`)
      .then(res => res.json())
      .then(data => {
        const newPosts = data.content || [];
        setPosts(prev => targetPage === 0 ? newPosts : [...prev, ...newPosts]);
        setIsLastPage(data.last);
      })
      .catch(() => {});
  };

  // [6] 좋아요 내역 전체 조회 (내가 누른 PK 찾기 용)
  const fetchLikes = () => {
    fetch(`http://${getIP()}:9093/communitylike/liked`)
      .then(res => res.json())
      .then(setLikes)
      .catch(() => setLikes([]));
  };

  // [7] 코인 변경 시 초기화
  useEffect(() => {
    setPosts([]);
    setPage(0);
    fetchPosts(0);
    fetchLikes();
    // eslint-disable-next-line
  }, [coin_no]);

  // [8] 글 등록
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
      member: { member_no },
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
      setContent('');
      setSelectedFile(null);
      setPage(0);
      fetchPosts(0);
    } catch (err) {
      alert('글 등록 실패');
    } finally {
      setIsPosting(false);
    }
  };

  // [9] 좋아요 여부 체크 (현재 로그인 유저가 이 글 좋아요 눌렀는지)
  const isLiked = (communityNo) => {
    if (!userInfo) return false;
    return likes.some(
      l => l.member?.member_no === Number(member_no) && l.community?.communityNo === Number(communityNo)
    );
  };

  // [10] 좋아요 등록
  const handleLike = async (communityNo) => {
    if (!userInfo) return alert('로그인 후 이용해주세요');
    try {
      await fetch(`http://${getIP()}:9093/communitylike/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': jwt
        },
        body: JSON.stringify({
          member: { member_no },
          community: { communityNo: communityNo }
        })
      });
      fetchLikes();
    } catch {}
  };

  // [11] 좋아요 취소 (매번 최신 likes에서 PK 찾아서 실행)
  const handleUnlike = async (communityNo) => {
    const matchedLike = likes.find(
      l => l.member?.member_no === Number(member_no) && l.community?.communityNo === Number(communityNo)
    );
    const likeNo = matchedLike?.communitylikeNo; // <-- **여기 camelCase 주의!**
    if (!likeNo) {
      alert('좋아요 PK를 찾을 수 없습니다!');
      return;
    }
    try {
      await fetch(`http://${getIP()}:9093/communitylike/delete/${likeNo}`, {
        method: 'DELETE',
        headers: { 'Authorization': jwt }
      });
      fetchLikes();
    } catch {}
  };

  // [12] 각 게시글 좋아요 개수
  const getLikeCount = (communityNo) =>
    likes.filter(l => l.community?.communityNo === Number(communityNo)).length;

  // [13] 비로그인 시 textarea 포커스 해제
  const handleFocusInput = () => {
    if (!userInfo) textareaRef.current?.blur();
  };

  // [14] 렌더링
  return (
    <div className="flex flex-col md:flex-row gap-6 px-2 w-full">
      {/* 왼쪽: 글쓰기 + 게시글 */}
      <div className="w-full md:w-[70%] space-y-6">
        {/* 글쓰기 영역 */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 p-4 shadow rounded-md">
          <div className="flex items-start gap-4">
            <img
              src={member?.member_img ? `http://${getIP()}:9093/home/storage/${member.member_img}` : "/nurung.png"}
              alt="프로필"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                className="w-full p-2 rounded border mb-2 bg-gray-50 resize-none"
                rows={3}
                value={content}
                onFocus={handleFocusInput}
                onChange={e => setContent(e.target.value)}
                placeholder={userInfo ? "무엇이든 의견을 남겨보세요!" : "의견을 남기려면 로그인이 필요해요"}
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
                    onChange={e => {
                      if (e.target.files.length > 0) setSelectedFile(e.target.files[0]);
                      e.target.value = null;
                    }}
                  />
                  <label
                    htmlFor="fileInput"
                    className="p-1 border border-gray-300 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer"
                  >🖼️</label>
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
                      >❌</button>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleCreate}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={isPosting}
                >
                  등록
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 게시글 리스트 */}
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
              {/* 좋아요 버튼 */}
              <div className="flex items-center gap-2 mt-2">
                {isLiked(post.communityNo) ? (
                  <button
                    className="flex items-center gap-1 bg-rose-100 text-pink-600 font-semibold"
                    onClick={() => handleUnlike(post.communityNo)}
                  >
                    ❤️
                    {getLikeCount(post.communityNo)}
                  </button>
                ) : (
                  <button
                    className="flex items-center gap-1 text-gray-400 font-semibold"
                    onClick={() => handleLike(post.communityNo)}
                  >
                    🤍
                    {getLikeCount(post.communityNo)}
                  </button>
                )}
              </div>
            </div>
          ))}
          {/* 더보기 버튼 */}
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

      {/* 오른쪽: 코인 정보 박스 */}
      {/* <div className="hidden lg:block w-full lg:w-[30%] bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow h-fit">
        <h2 className="text-lg font-bold mb-2">📊 현재 코인 정보</h2>
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <p>코인 번호: {coin_no}</p>
          <p>예상 수익률: +12.3%</p>
          <p>AI 분석 등급: ⭐️⭐️⭐️⭐️</p>
        </div>
      </div> */}
    </div>
  );
}
