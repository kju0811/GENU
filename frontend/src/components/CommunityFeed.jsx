// CommunityFeed.jsx
import React, { useEffect, useState, useRef } from 'react';
import { getIP } from '../components/Tool';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import CommunityReply from './CommunityReply';
import MoreMenu from "./MoreMenu";

export default function CommunityFeed({ coin_no: propCoinNo }) {
  // URL 또는 props에서 coin_no 추출
  const { coin_no: paramsCoinNo } = useParams();
  const coin_no = propCoinNo || paramsCoinNo;

  // 상태 관리
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [likes, setLikes] = useState([]);
  const [member, setMember] = useState(null);
  const [openReply, setOpenReply] = useState({});
  const [commentCounts, setCommentCounts] = useState({});
  const [showMenu, setShowMenu] = useState({});
  const [editingPostNo, setEditingPostNo] = useState(null);
  const [fixContent, setFixContent] = useState('');
  const [fixFile, setFixFile] = useState(null);
  const [fixFileUrl, setFixFileUrl] = useState('');
  const [fixFileDeleted, setFixFileDeleted] = useState(false);

  const textareaRef = useRef(null);
  const navigate = useNavigate();

  // JWT 디코딩 및 유저 정보
  const jwt = sessionStorage.getItem('jwt');
  let userInfo = null;
  if (jwt) {
    try { userInfo = jwtDecode(jwt); } catch {}
  }
  const member_no = userInfo?.member_no;
  const isAdmin = userInfo?.member_auth === 9 || userInfo?.role === "ADMIN";

  const size = 10;

  // 내 프로필 정보 로드
  useEffect(() => {
    if (!member_no) return;
    fetch(`http://${getIP()}:9093/member/read/${member_no}`)
      .then(res => res.json())
      .then(setMember)
      .catch(() => setMember(null));
  }, [member_no]);

  // 게시글 목록 페이징 조회
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

  // 좋아요 전체 조회
  const fetchLikes = () => {
    fetch(`http://${getIP()}:9093/communitylike/liked`)
      .then(res => res.json())
      .then(setLikes)
      .catch(() => setLikes([]));
  };

  // 댓글 수 조회 (postList 기반)
  const fetchCommentCounts = (postList) => {
    if (!postList || postList.length === 0) return;
    const counts = {};
    Promise.all(
      postList.map(post =>
        fetch(`http://${getIP()}:9093/communityreply/community/${post.communityNo}/count`)
          .then(res => res.ok ? res.json() : 0)
          .then(count => { counts[post.communityNo] = typeof count === "number" ? count : 0; })
          .catch(() => { counts[post.communityNo] = 0; })
      )
    ).then(() => setCommentCounts(counts));
  };

  // 초기/코인 변경 시 초기화
  useEffect(() => {
    setPosts([]);
    setPage(0);
    fetchPosts(0);
    fetchLikes();
  }, [coin_no]);

  // 게시글 변경 시 댓글 카운트 재조회
  useEffect(() => {
    if (posts.length > 0) fetchCommentCounts(posts);
  }, [posts]);

  // 글 등록 (파일 포함 multipart/form-data)
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
      fetchCommentCounts(posts);
    } catch (err) {
      alert('글 등록 실패');
    } finally {
      setIsPosting(false);
    }
  };

  // 좋아요 여부 체크
  const isLiked = (communityNo) => {
    if (!userInfo) return false;
    return likes.some(l => l.member?.member_no === Number(member_no) && l.community?.communityNo === Number(communityNo));
  };

  // 좋아요 등록/취소
  const handleLike = async (communityNo) => {
    if (!userInfo) return alert('로그인 후 이용해주세요');
    try {
      await fetch(`http://${getIP()}:9093/communitylike/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': jwt },
        body: JSON.stringify({ member: { member_no }, community: { communityNo } })
      });
      fetchLikes();
    } catch { }
  };
  const handleUnlike = async (communityNo) => {
    const matchedLike = likes.find(l => l.member?.member_no === Number(member_no) && l.community?.communityNo === Number(communityNo));
    const likeNo = matchedLike?.communitylikeNo;
    if (!likeNo) return alert('좋아요 PK를 찾을 수 없습니다!');
    try {
      await fetch(`http://${getIP()}:9093/communitylike/delete/${likeNo}`, {
        method: 'DELETE',
        headers: { Authorization: jwt }
      });
      fetchLikes();
    } catch { }
  };

  // 게시글별 좋아요/댓글 수
  const getLikeCount = (communityNo) => likes.filter(l => l.community?.communityNo === Number(communityNo)).length;
  const getCommentCount = (communityNo) => commentCounts[communityNo] || 0;

  // 댓글 개수 변경 시 동기화
  const handleCommentCountChange = (communityNo, newCount) => {
    setCommentCounts(prev => ({ ...prev, [communityNo]: newCount }));
  };

  // ... 메뉴 토글
  const handleMenuToggle = (key) => {
    setShowMenu(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // 게시글 수정 진입 - 수정 폼 초기화
  const handleEditPostStart = (post) => {
    setEditingPostNo(post.communityNo);
    setFixContent(post.communityContent);
    setFixFile(null);
    setFixFileDeleted(false);
    setFixFileUrl(post.communityImg ? `http://${getIP()}:9093/home/storage/${post.communityImg}` : '');
    setShowMenu(prev => ({ ...prev, [post.communityNo]: false }));
  };

  // 게시글 수정 완료
  const handleEditPostSave = async (communityNo) => {
    const formData = new FormData();
    // JSON형태로 community 객체를 만들어 Blob으로 추가
    const communityObj = {
      communityContent: fixContent,
      // communityImg: fixFileDeleted ? "" : (fixFileUrl ? fixFileUrl.split('/').pop() : null),
      communityImg: fixFileDeleted ? "" : undefined, // 빈 문자열으로 이미지 삭제 요청, undefined는 변경없음
    };
    formData.append('community', new Blob([JSON.stringify(communityObj)], { type: 'application/json' }));

    if (fixFile) {
      formData.append('file', fixFile);
    }

    try {
      const res = await fetch(`http://${getIP()}:9093/community/${communityNo}`, {
        method: 'PUT',
        headers: { Authorization: jwt }, // content-type은 지정하지 말 것 (multipart)
        body: formData,
      });
      if (!res.ok) throw new Error('수정 실패');

      // 수정 후 초기화 및 다시 리스트 로드
      setEditingPostNo(null);
      setFixContent('');
      setFixFile(null);
      setFixFileUrl('');
      setFixFileDeleted(false);

      fetchPosts(page);
    } catch {
      alert('글 수정 실패');
    }
  };

  // 게시글 삭제
  const handleDeletePost = async (communityNo) => {
    if (!window.confirm("이 글을 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`http://${getIP()}:9093/community/${communityNo}`, {
        method: 'DELETE',
        headers: { Authorization: jwt }
      });
      if (res.ok) {
        setPosts(posts => posts.filter(p => p.communityNo !== communityNo));
        setCommentCounts(prev => {
          const next = { ...prev };
          delete next[communityNo];
          return next;
        });
      } else {
        alert('삭제 실패');
      }
    } catch {
      alert('네트워크 에러');
    }
  };

  // 게시글 메뉴 옵션
  const makePostMenuOptions = (post, isMine, isAdmin) => {
    const opts = [];
    if (isMine) {
      opts.push({ label: "✏️ 수정", onClick: () => handleEditPostStart(post) });
      opts.push({ label: "🗑️ 삭제", onClick: () => handleDeletePost(post.communityNo) });
    } else {
      if (isAdmin) opts.push({ label: "🗑️ 삭제", onClick: () => handleDeletePost(post.communityNo) });
      opts.push({ label: "🚨 신고", onClick: () => alert('게시글 신고') });
      opts.push({ label: "⛔ 차단", onClick: () => alert('작성자 차단') });
    }
    return opts;
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 px-2 w-full">
      {/* 좌측: 글쓰기 + 게시글 리스트 */}
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
                onChange={e => setContent(e.target.value)}
                placeholder={userInfo ? "무엇이든 의견을 남겨보세요!" : "의견을 남기려면 로그인이 필요해요"}
                disabled={!userInfo || isPosting}
              />
              <div className="flex justify-between items-center">
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
          {posts.map(post => {
            const isMine = member_no && post.member?.member_no === member_no;
            const isEditing = editingPostNo === post.communityNo;
            return (
              <div key={post.communityNo} className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 relative group">
                {/* 게시글 ... 메뉴 버튼 */}
                <button
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-700 rounded-full"
                  onClick={() => handleMenuToggle(post.communityNo)}
                  tabIndex={-1}
                >&#8230;</button>
                {showMenu[post.communityNo] && (
                  <MoreMenu
                    options={makePostMenuOptions(post, isMine, isAdmin)}
                    onClose={() => setShowMenu(prev => ({ ...prev, [post.communityNo]: false }))}
                  />
                )}

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

                {/* 수정 중인 경우 수정 폼 출력 */}
                {isEditing ? (
                  <>
                    <textarea
                      className="w-full p-2 border rounded mb-2 resize-none"
                      rows={4}
                      value={fixContent}
                      onChange={e => setFixContent(e.target.value)}
                      autoFocus
                    />

                    {/* 이미지 수정 영역 */}
                    <div className="flex items-center gap-2 mb-2">
                      {/* 기존 이미지 미리보기 및 삭제 버튼 */}
                      {fixFileUrl && !fixFileDeleted && (
                        <div className="relative">
                          <img src={fixFileUrl} alt="기존 이미지" className="w-24 h-24 object-cover rounded" />
                          <button
                            type="button"
                            onClick={() => {
                              setFixFileDeleted(true);
                              setFixFileUrl('');
                            }}
                            className="absolute -top-2 -right-2 bg-white rounded-full p-1 text-xs shadow"
                          >❌</button>
                        </div>
                      )}

                      {/* 새 이미지 선택 input */}
                      <input
                        type="file"
                        accept="image/*"
                        id={`fixFileInput_${post.communityNo}`}
                        hidden
                        onChange={e => {
                          if (e.target.files.length > 0) {
                            setFixFile(e.target.files[0]);
                            setFixFileUrl(URL.createObjectURL(e.target.files[0]));
                            setFixFileDeleted(false);
                          }
                          e.target.value = null;
                        }}
                      />
                      <label
                        htmlFor={`fixFileInput_${post.communityNo}`}
                        className="p-2 border border-gray-300 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer"
                      >🖼️ 이미지 변경</label>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
                        onClick={() => setEditingPostNo(null)}
                      >취소</button>
                      <button
                        className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={() => handleEditPostSave(post.communityNo)}
                      >저장</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-base ml-10 mb-2 whitespace-pre-line">{post.communityContent}</div>
                    {post.communityImg && (
                      <img
                        src={`http://${getIP()}:9093/home/storage/${post.communityImg}`}
                        alt="첨부 이미지"
                        className="ml-10 mt-2 max-h-60 max-w-full rounded"
                      />
                    )}
                  </>
                )}

                {/* 좋아요 / 댓글 버튼 */}
                <div className="flex ml-9 items-center gap-2 mt-2">
                  <button
                    className={
                      "flex flex-row items-center justify-center font-semibold text-sm rounded transition-colors duration-150 w-10 h-10 " +
                      (isLiked(post.communityNo)
                        ? "text-red-600"
                        : "text-gray-400 bg-transparent hover:bg-rose-100")
                    }
                    onClick={() =>
                      isLiked(post.communityNo)
                        ? handleUnlike(post.communityNo)
                        : handleLike(post.communityNo)
                    }
                  >
                    {isLiked(post.communityNo) ? "❤️" : "🤍"}
                    <span className="ml-1">{getLikeCount(post.communityNo)}</span>
                  </button>
                  <button
                    className={
                      "flex items-center justify-center text-sm rounded transition-colors duration-150 w-10 h-10 " +
                      (openReply[post.communityNo]
                        ? "bg-blue-100 text-blue-600"
                        : "bg-transparent text-gray-400 hover:bg-blue-50 hover:text-blue-600")
                    }
                    onClick={() =>
                      setOpenReply(prev => ({
                        ...prev,
                        [post.communityNo]: !prev[post.communityNo],
                      }))
                    }
                    style={{ fontSize: "1.1rem" }}
                  >
                    💬
                    <span className="text-sm">{getCommentCount(post.communityNo)}</span>
                  </button>
                </div>

                {/* 댓글 영역 */}
                {openReply[post.communityNo] && (
                  <CommunityReply
                    communityNo={post.communityNo}
                    onCountChange={newCount => handleCommentCountChange(post.communityNo, newCount)}
                  />
                )}
              </div>
            );
          })}
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

      {/* 우측 코인 정보 (필요시 활성화) */}
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
