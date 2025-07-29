// CommunityReply.jsx

import React, { useState, useEffect } from 'react';
import { getIP } from './Tool';
import { jwtDecode } from 'jwt-decode';
import MoreMenu from "./MoreMenu";
import basic from "../images/profile.png";

// 한 페이지에 보여줄 댓글 수
const REPLIES_PAGE_SIZE = 10;

export default function CommunityReply({ communityNo, onCountChange }) {
  const [replies, setReplies] = useState([]);
  const [replyContent, setReplyContent] = useState('');
  const [editingReplyNo, setEditingReplyNo] = useState(null);
  const [fixReply, setFixReply] = useState('');
  const [myProfile, setMyProfile] = useState(null);
  const [showMenu, setShowMenu] = useState({});
  const [replyPage, setReplyPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);

  // JWT, 유저 정보
  const jwt = sessionStorage.getItem('jwt');
  let userInfo = null;
  if (jwt) { try { userInfo = jwtDecode(jwt); } catch { } }
  const member_no = userInfo?.member_no;
  const isAdmin = userInfo?.role === "ADMIN" || userInfo?.member_auth === 9;

  // 내 프로필 정보
  useEffect(() => {
    if (!member_no) return;
    fetch(`http://${getIP()}:9093/member/read/${member_no}`)
      .then(res => res.json())
      .then(setMyProfile)
      .catch(() => setMyProfile(null));
  }, [member_no]);

  // 댓글 불러오기(ASC, 페이징)
  const fetchReplies = (page = 0) => {
    fetch(`http://${getIP()}:9093/communityreply/community/${communityNo}?page=${page}&size=${REPLIES_PAGE_SIZE}`)
      .then(res => res.json())
      .then(data => {
        if (page === 0) setReplies(data.content || []);
        else setReplies(prev => [...prev, ...(data.content || [])]);
        setIsLastPage(data.last);
        if (onCountChange) onCountChange(data.totalElements);
      })
      .catch(() => {
        setReplies([]);
        setIsLastPage(true);
        if (onCountChange) onCountChange(0);
      });
  };
  useEffect(() => {
    setReplyPage(0);
    fetchReplies(0);
  }, [communityNo]);

  // 댓글 등록
  const handleCreateReply = async () => {
    if (!replyContent.trim()) return;
    try {
      const res = await fetch(`http://${getIP()}:9093/communityreply/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': jwt },
        body: JSON.stringify({
          communityReplyContent: replyContent,
          member: { member_no },
          community: { communityNo }
        })
      });
      if (!res.ok) throw new Error('등록 실패');
      setReplyContent('');
      setReplyPage(0);
      fetchReplies(0);
    } catch {
      alert('댓글 등록 실패');
    }
  };

  // 댓글 삭제
  const handleDeleteReply = (replyNo) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    fetch(`http://${getIP()}:9093/communityreply/delete/${replyNo}`, {
      method: 'DELETE',
      headers: { 'Authorization': jwt }
    }).then(res => {
      if (res.ok) {
        setReplyPage(0);
        fetchReplies(0);
      }
      else alert("삭제에 실패했습니다");
    });
  };

  // 댓글 수정 진입
  const handleEditStart = (replyNo, originContent) => {
    setEditingReplyNo(replyNo);
    setFixReply(originContent);
    setShowMenu(prev => ({ ...prev, [replyNo]: false }));
  };

  // 댓글 수정 완료
  const handleEditReply = (replyNo) => {
    fetch(`http://${getIP()}:9093/communityreply/update/${replyNo}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': jwt },
      body: JSON.stringify({ communityReplyContent: fixReply })
    }).then(res => {
      if (res.ok) {
        setEditingReplyNo(null);
        setFixReply('');
        fetchReplies(replyPage);
      } else {
        alert('수정에 실패하였습니다');
      }
    });
  };

  // ... 메뉴 옵션
  const makeMenuOptions = (reply, isMine, isReplyAdmin) => {
    let opts = [];
    if (isMine) {
      opts.push({ label: "✏️ 수정", onClick: () => handleEditStart(reply.communityReplyNo, reply.communityReplyContent) });
      opts.push({ label: "🗑️ 삭제", onClick: () => handleDeleteReply(reply.communityReplyNo) });
    } else {
      opts.push({ label: "🚨 신고", onClick: () => alert('댓글 신고') });
      opts.push({ label: "⛔ 차단", onClick: () => alert('댓글 차단') });
      if (isAdmin) {
        opts.push({ label: "🗑️ 삭제", onClick: () => handleDeleteReply(reply.communityReplyNo) });
      }
    }
    return opts;
  };

  // 더보기 (페이징)
  const handleMoreReplies = () => {
    const nextPage = replyPage + 1;
    setReplyPage(nextPage);
    fetchReplies(nextPage);
  };

  return (
    <div className="mt-3 space-y-3">
      {/* 댓글 목록 */}
      {replies.length === 0 && <div className="text-gray-400 text-sm">아직 댓글이 없습니다.</div>}
      {replies.map(reply => {
        const isMine = member_no && reply.member?.member_no === member_no;
        const isReplyAdmin = reply.member?.role === "ADMIN" || reply.member?.member_grade === 9;
        const replyImg = reply.member?.member_img
          ? `http://${getIP()}:9093/home/storage/${reply.member.member_img}`
          : basic;
        const isEditing = editingReplyNo === reply.communityReplyNo;
        return (
          <div key={reply.communityReplyNo} className="flex items-start bg-gray-100 p-2 ml-9 rounded relative group">
            {/* 프로필 */}
            <img src={replyImg} alt="프로필" className="w-8 h-8 rounded-full mr-2 object-cover" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">{reply.member?.member_nick}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-400">{reply.communityReplyDate?.replace('T', ' ').slice(0, 16)}</span>
                {isReplyAdmin && (
                  <span className="ml-2 text-xs text-blue-400">(관리자)</span>
                )}
              </div>
              {/* 수정폼 or 일반 내용 */}
              {isEditing ? (
                <div>
                  <textarea
                    className="w-full p-2 border rounded bg-white"
                    rows={2}
                    value={fixReply}
                    onChange={e => setFixReply(e.target.value)}
                    autoFocus
                  />
                  <div className="flex justify-end gap-2 mt-1">
                    <button className="text-xs text-gray-500" onClick={() => setEditingReplyNo(null)}>취소</button>
                    <button className="text-xs bg-blue-500 text-white rounded px-2 py-1"
                      onClick={() => handleEditReply(reply.communityReplyNo)}
                    >수정</button>
                  </div>
                </div>
              ) : (
                <div className="mt-1">{reply.communityReplyContent}</div>
              )}
            </div>
            {/* ... 메뉴 (수정 중 아닐 때만) */}
            {!isEditing && (
              <>
                <button
                  className="ml-2 p-2 text-gray-400 hover:text-gray-700 rounded-full absolute bottom-0 right-0"
                  onClick={() => setShowMenu(prev => ({
                    ...prev,
                    [reply.communityReplyNo]: !prev[reply.communityReplyNo]
                  }))}
                  tabIndex={-1}
                >&#8230;</button>
                {showMenu[reply.communityReplyNo] && (
                  <MoreMenu
                    options={makeMenuOptions(reply, isMine, isReplyAdmin)}
                    onClose={() => setShowMenu(prev => ({ ...prev, [reply.communityReplyNo]: false }))}
                  />
                )}
              </>
            )}
          </div>
        )
      })}
      {/* 더보기 버튼 */}
      {!isLastPage && replies.length > 0 && (
        <div className="text-center">
          <button
            className="px-4 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            onClick={handleMoreReplies}
          >더보기</button>
        </div>
      )}

      {/* 댓글 입력 */}
      {userInfo ? (
        <div className="flex items-start gap-2 pt-2">
          <img src={myProfile?.member_img
            ? `http://${getIP()}:9093/home/storage/${myProfile.member_img}`
            : basic}
            alt="내 프로필"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1">
            <textarea
              className="w-full p-2 border rounded bg-white"
              rows={2}
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              placeholder="댓글을 입력하세요"
            />
            <div className="flex justify-end mt-1">
              <button
                onClick={handleCreateReply}
                className="text-sm px-3 py-1 bg-blue-600 text-white rounded"
              >
                댓글 등록
              </button>
            </div>
          </div>
        </div>
      ) : (
        <textarea
          className="w-full p-2 border rounded bg-white mt-2"
          rows={2}
          placeholder="로그인 후 이용해주세요"
          disabled
        />
      )}
    </div>
  );
}
