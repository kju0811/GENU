import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Login 컴포넌트 (UI 전용)
 * - Google, Kakao 소셜 로그인 버튼 기능은 추후 API 연동
 * @param {boolean} isOpen 모달 열림 상태
 * @param {() => void} onClose 모달 닫기 핸들러
 */
export default function Login({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPswd, setShowPswd] = useState(false);
  const [remember, setRemember] = useState(false);

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
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
              required
            />
          </div>
          {/* 비밀번호 입력 + 토글 아이콘 */}
          <div className="relative">
            <input
                type={showPswd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                required
                minLength={8}
                maxLength={12}
            />
            <div
                className="absolute inset-y-0 right-2 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
                onMouseDown={() => setShowPswd(true)}
                onMouseUp={() => setShowPswd(false)}
                onMouseLeave={() => setShowPswd(false)}
            >
                {/* 기본 이모지 또는 SVG 아이콘 사용 */}
                {showPswd ? '🙈' : '👁️'}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="form-checkbox h-4 w-4 text-indigo-600" />
              <span className="ml-2 text-gray-700 dark:text-gray-300">아이디 기억하기</span> {/* 기능구현 x */}
            </label>
            <Link to="/forgot-password" 
                  onClick={onClose}
                  className="text-indigo-600 hover:underline">비밀번호를 잊어버리셨나요?</Link>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Sign in
          </button>
        </form>
        {/* 회원가입 링크 */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          New user?{' '}
          <Link to="/signup" 
                onClick={onClose}
                className="text-indigo-600 hover:underline">회원가입하러가기</Link>
        </p>
      </div>
    </div>
  );
}
