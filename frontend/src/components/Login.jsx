import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGlobal } from '../components/GlobalContext';
import { getIP } from '../components/Tool';

// 포커스 이동
function enter_chk(event, nextTag){
  if(event.keyCode === 13){ // 엔터키
    document.getElementById(nextTag).focus();
  }
}

// name=값; max-age=초; path=/
function setCookie(name, value, days) {
  const maxAge = days ? days * 24 * 60 * 60 : ''; 
  document.cookie = `${name}=${encodeURIComponent(value)};max-age=${maxAge};path=/`; }

// name=…; (여기서 name=이름이 없다면 빈 문자열 반환)
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(?:^|; )'+name+'=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : ''; }

// 쿠키 만료시켜서 삭제
function deleteCookie(name){ document.cookie = `${name}=;max-age=0;path=/`; }


/**
 * Login 컴포넌트 (UI 전용)
 * - Google, Kakao 소셜 로그인 버튼 기능은 추후 API 연동
 * @param {boolean} isOpen 모달 열림 상태
 * @param {() => void} onClose 모달 닫기 핸들러
 */
export default function Login({ isOpen, onClose }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [saveId, setSaveId] = useState(false);
  const [showPswd, setShowPswd] = useState(false);
  const { sw, setSw } = useGlobal();

    // 우선 저장된 아이디 load
    useEffect(() => {
      const storedId = getCookie('savedId');
      if(storedId){ setId(storedId); setSaveId(true); }
    }, []);

  // 아이디 기억하기
  const idChange = (e) => { setId(e.target.value); if(saveId){ setCookie('savedId', e.target.value, 7); } };
  const saveIdChange = (e) => { setSaveId(e.target.checked); e.target.checked ? setCookie('savedId', id, 7) : deleteCookie('savedId'); };

  // async 동기 통신 설정
  const send = async (event) => {
    event.preventDefault();
  
    try {
      const res = await fetch(`http://${getIP()}:9093/member/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId: id, memberPw: password }),
        credentials: 'include',
      });
  
      if (!res.ok) {
        alert('로그인에 실패했습니다.');
        return;
      }
  
      // 1) 헤더에서 토큰을 꺼냄
      const authHeader = res.headers.get('Authorization');
      if (!authHeader) {
        alert('서버에서 토큰을 받지 못했습니다.');
        return;
      }
  
      // 2) “Bearer ” 앞부분을 제외한 실제 토큰만 떼어도 되고, 필요한 형태로 저장하세요.
      const token = authHeader; // 이미 "Bearer eyJ..." 형태라면 그대로 써도 됩니다.
      // const token = authHeader.substring(7); // 순수 토큰만 필요하면 이렇게
  
      // 3) 로그인 성공 처리
      sessionStorage.setItem('jwt', token);
      setSw(true);
      onClose();
  
    } catch (err) {
      console.error(err);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  const test = () => { setId('admin'); setPassword('1234'); };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-sm mx-4 p-6">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">×</button>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-4">Sign In</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">Welcome back! Please enter your details</p>
        {/* 소셜 로그인 버튼 */}
        <div className="space-y-3 mb-6">
          <button className="w-full py-2 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-100">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYMMskKN9Ql1Ep4wG_vEW01t98DUBVXeXE8A&s" 
                 alt="Google" 
                 className="w-5 h-5 mr-2" /> Continue with Google
          </button>
          <button className="w-full py-2 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-100">
            <img src="https://images-eds-ssl.xboxlive.com/image?url=4rt9.lXDC4H_93laV1_eHHFT949fUipzkiFOBH3fAiZZUCdYojwUyX2aTonS1aIwMrx6NUIsHfUHSLzjGJFxxtZdWw6g4UwahLJywNYpykrE4ox0FBSnIc7culudXXPOT48oqy.15P4Xx4m193BKJ0ujsiUCiX_bGCXlpmoh0cs-&format=source" 
                 alt="Kakao" 
                 className="w-5 h-5 mr-2" /> Continue with Kakao
          </button>
        </div>
        {/* 구분선 */}
        <div className="flex items-center mb-6">
          <hr className="flex-1 border-gray-300" />
          <span className="px-2 text-gray-400">or</span>
          <hr className="flex-1 border-gray-300" />
        </div>
        {/* 이메일 로그인 폼 */}
        <form onSubmit={send} className="space-y-4">
          <div >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              onKeyDown={e=>enter_chk(e,'passwd')} 
              onChange={idChange} 
              value={id}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
              placeholder="Enter your email"
              autoFocus
              required
            />
          </div>
          {/* 비밀번호 입력 + 토글 아이콘 */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
                id="passwd"
                type={showPswd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                required
                // minLength={8}
                // maxLength={12}
            />
            <div
              style={{ userSelect: 'none' }}
                className="absolute bottom-2 right-2 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
                onMouseDown={() => setShowPswd(true)}
                onMouseUp={() => setShowPswd(false)}
                onMouseLeave={() => setShowPswd(false)}
            >
                {/* 기본 이모지 또는 SVG 아이콘 사용 */}
                {showPswd ? '🙉' : '🙈'}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center">
              <input type="checkbox" checked={saveId} className="form-checkbox h-4 w-4 text-indigo-600" 
                     onChange={saveIdChange} />
              <span className="ml-2 text-gray-700 dark:text-gray-300">아이디 기억하기</span>
            </label>
            <Link to="/forgotPassword" 
                  onClick={onClose}
                  className="text-indigo-600 hover:underline">비밀번호를 잊어버리셨나요?</Link>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            로그인
          </button>
          <button
            type="button"
            className="w-full py-2 bg-pink-600 text-white rounded-md hover:bg-indigo-700 transition"
            onClick={test}>
            테스트 관리자
          </button>
        </form>
        {/* 회원가입 링크 */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          처음이신가요? {' '}
          <Link to="/signup" 
                onClick={onClose}
                className="text-indigo-600 hover:underline">회원가입하러가기</Link>
        </p>
      </div>
    </div>
  );
}