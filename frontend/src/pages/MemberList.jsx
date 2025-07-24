// src/pages/MemberList.jsx
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getIP } from '../components/Tool'
import { jwtDecode } from 'jwt-decode'

export default function MemberList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [members, setMembers]           = useState([])
  const [totalPages, setTotalPages]     = useState(0)
  const [loading, setLoading]           = useState(false)
  const jwt = sessionStorage.getItem('jwt');
  const size = 10  // 한 페이지당 아이템 수 고정
  // 1-based로 읽어서, 백엔드는 0-based로 변환
  const queryKw   = searchParams.get('kw')   || ''
  const queryPage = parseInt(searchParams.get('page'), 10) || 1
  const pageIndex = queryPage - 1

  const gradeMap = {
  1: "관리자",
  10: "일반 유저",
  20: "정지 유저",
  30: "탈퇴 유저",
};

  // Controlled input: URL이 바뀌면 이 값도 동기화
  const [inputKw, setInputKw] = useState(queryKw)
  useEffect(() => {
    setInputKw(queryKw)
  }, [queryKw])

  const changeGrade =(member_no,grade,name)=> {
      const check = window.confirm(`${name}의 등급을 변경하시겠습니까?`)
      if (check) {
      fetch(`http://${getIP()}:9093/member/update/grade`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': jwt,
        },
        body: JSON.stringify({ member_no,grade }),
      })
      .then((result) => {
        if(result.ok){
          alert("등급이 변경 되었습니다")
          window.location.reload();
        }
      })
    }
    }

  // URL 쿼리가 바뀔 때마다 멤버 리스트 재조회
  useEffect(() => {
    setLoading(true)

    // search vs page 엔드포인트 선택
    const endpoint = queryKw ? '/member/search' : '/member/page'
    const params   = new URLSearchParams()
    if (queryKw)   params.append('kw', queryKw)
                 params.append('page', pageIndex)
                 params.append('size', size)

    fetch(`http://${getIP()}:9093${endpoint}?${params}`, {
      headers: {
        Authorization: jwt
      }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        setMembers(data.content)
        setTotalPages(data.totalPages)
      })
      .catch(console.error)
      .finally(() => setLoading(false))

  }, [queryKw, pageIndex])

  // 검색 버튼 → URL만 갱신(page=1 으로)
  const onSearch = () => {
    const next = {}
    if (inputKw.trim()) next.kw = inputKw.trim()
    next.page = 1
    setSearchParams(next)
  }

  const onSearchCancel = () => {
   const newParams = new URLSearchParams(searchParams);
   newParams.delete("kw");
   setSearchParams(newParams);
  }

  // 페이지 버튼 → URL만 갱신
  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return
    const next = {}
    if (queryKw) next.kw   = queryKw
    next.page = p
    setSearchParams(next)
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">회원 목록</h1>

      {/* 검색 바 */}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={inputKw}
          onChange={e => setInputKw(e.target.value)}
          className="flex-1 border rounded-l px-3 py-2 focus:outline-none"
        />
        <button
          onClick={()=>onSearch()}
          className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700"
        >
          검색
        </button>
        <button
          onClick={()=>onSearchCancel()}
          className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700"
        >
          검색 취소
        </button>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">아이디</th>
              <th className="px-4 py-2 border">이름</th>
              <th className="px-4 py-2 border">전화번호</th>
              <th className="px-4 py-2 border">가입일</th>
              <th className="px-4 py-2 border">등급</th>
              <th className="px-4 py-2 border">닉네임</th>
              <th className="px-4 py-2 border">등급관리</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4">로딩 중…</td>
              </tr>
            ) : members.length > 0 ? (
              members.map((m, idx) => (
                <tr key={m.member_no} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">
                    {pageIndex * size + idx + 1}
                  </td>
                  <td className="px-4 py-2 border">{m.memberId}</td>
                  <td className="px-4 py-2 border">{m.member_name}</td>
                  <td className="px-4 py-2 border">{m.member_tel}</td>
                  <td className="px-4 py-2 border">{m.memberDate}</td>
                  <td className="px-4 py-2 border">{gradeMap[m.member_grade]}</td>
                  <td className="px-4 py-2 border">{m.member_nick}</td>
                  <td className="px-4 py-2 border">
                    <div className="dropdown">
                      <div tabIndex={0} role="button" className="btn btn-sm">
                        등급 선택
                      </div>
                      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 p-2 shadow" >
                        <li><a onClick={() => changeGrade(m.member_no, 1,m.member_name)}>관리자</a></li>
                        <li><a onClick={() => changeGrade(m.member_no, 10,m.member_name)}>일반유저</a></li>
                        <li><a onClick={() => changeGrade(m.member_no, 20,m.member_name)}>정지</a></li>
                        <li><a onClick={() => changeGrade(m.member_no, 30,m.member_name)}>탈퇴</a></li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">조회 결과가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 페이징 */}
      <div className="flex justify-center items-center space-x-2 mt-4">
        <button
          onClick={() => goToPage(queryPage - 1)}
          disabled={queryPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          &lt; 이전
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => goToPage(i + 1)}
            className={`
              px-3 py-1 border rounded 
              ${i + 1 === queryPage ? 'bg-blue-600 text-white' : ''}
            `}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => goToPage(queryPage + 1)}
          disabled={queryPage === totalPages || totalPages === 0}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          다음 &gt;
        </button>
      </div>
    </div>
  )
}
