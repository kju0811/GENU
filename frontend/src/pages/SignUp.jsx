import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIP, getNowDate } from '../components/Tool';

export default function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPswd, setShowPswd] = useState(false);

  // Step1: Account Info
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [agree, setAgree] = useState(false);

  // Step2: Profile Info
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [tel, setTel] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [nick, setNick] = useState('');
  const [avatar, setAvatar] = useState(null);

  // Step1 input refs
  const emailRef = useRef(null);
  const pwRef = useRef(null);
  const pwcRef = useRef(null);
  const agreeRef = useRef(null);

  // Step2 input refs
  const nameRef = useRef(null);
  const birthRef = useRef(null);
  const telRef = useRef(null);
  const zipRef = useRef(null);
  const addr1Ref = useRef(null);
  const addr2Ref = useRef(null);
  const nickRef = useRef(null);
  const avatarRef = useRef(null);

  // Move to Step2 after validating Step1
  const handleNext = () => {
    if (!id || !password || !confirmPw || password !== confirmPw || !agree) {
      alert('이메일, 비밀번호 일치 및 약관 동의가 필요합니다.');
      return;
    }
    setStep(2);
    setTimeout(() => nameRef.current?.focus(), 100); // Step2 진입 시 이름란 포커스
  };

  // Final submit with FormData
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedBirth = birth.replace(/-/g, '');

    const member = {
      memberId: id,
      memberPw: password,
      member_name: name,
      member_tel: tel,
      memberBirth: formattedBirth,
      zipcode,
      address1,
      address2,
      member_grade: 10,
      member_nick: nick
    };

    const formData = new FormData();
    formData.append('member', new Blob([JSON.stringify(member)], {
      type: 'application/json'
    }));
    if (avatar) formData.append('file', avatar);

    try {
      const res = await fetch(`http://${getIP()}:9093/member/create`, {
        method: 'POST',
        body: formData
      });
      const result = await res.json();
      if (result.member_no) {
        setStep(3);
      } else {
        alert('회원가입 실패: 다시 시도해주세요.');
      }
    } catch (err) {
      console.error(err);
      alert('서버 오류 발생');
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-10">
        {/* Progress */}
        <div className="flex justify-between items-center mb-8">
          {['계정정보', '회원정보', '가입성공'].map((label, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className={`w-9 h-9 flex items-center justify-center rounded-full mb-2 text-base font-bold
                ${step - 1 >= i ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
                {i + 1}
              </div>
              <span className={`text-xs md:text-sm font-semibold ${step - 1 >= i ? 'text-indigo-600' : 'text-gray-500 dark:text-gray-400'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: Account */}
        {step === 1 && (
          <form
            onSubmit={e => {
              e.preventDefault();
              handleNext();
            }}
            className="space-y-4"
            autoComplete="off"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">이메일</label>
              <input
                ref={emailRef}
                type="email"
                value={id}
                onChange={e => setId(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="your@email.com"
                required
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    pwRef.current?.focus();
                  }
                }}
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">비밀번호</label>
              <input
                ref={pwRef}
                type={showPswd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                required
                // minLength={8}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    pwcRef.current?.focus();
                  }
                }}
              />
              <div
                style={{ userSelect: 'none' }}
                className="absolute bottom-2 right-2 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
                onMouseDown={() => setShowPswd(true)}
                onMouseUp={() => setShowPswd(false)}
                onMouseLeave={() => setShowPswd(false)}
              >
                {showPswd ? '🙉' : '🙈'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">비밀번호 확인</label>
              <input
                ref={pwcRef}
                type="password"
                value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)}
                className="w-full border rounded p-2"
                required
                // minLength={8}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    agreeRef.current?.focus();
                  }
                }}
              />
            </div>
            <div className="flex items-center">
              <input
                ref={agreeRef}
                type="checkbox"
                checked={agree}
                onChange={e => setAgree(e.target.checked)}
                className="mr-2"
                required
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    // 약관 체크박스에서 엔터 시 바로 다음 단계로!
                    handleNext();
                  }
                }}
              />
              <span className="text-sm">약관에 동의합니다</span>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >다음으로</button>
          </form>
        )}

        {/* Step 2: Profile */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div>
              <label className="block text-sm">이름*</label>
              <input ref={nameRef} type="text" value={name} onChange={e => setName(e.target.value)}
                className="w-full border rounded p-2" required
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); birthRef.current?.focus(); } }}
              />
            </div>
            <div>
              <label className="block text-sm">생년월일*</label>
              <input ref={birthRef} type="date" value={birth} onChange={e => setBirth(e.target.value)}
                className="w-full border rounded p-2" required
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); telRef.current?.focus(); } }}
              />
            </div>
            <div>
              <label className="block text-sm">핸드폰번호*</label>
              <input ref={telRef} type="tel" value={tel} onChange={e => setTel(e.target.value)}
                className="w-full border rounded p-2" required
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); zipRef.current?.focus(); } }}
              />
            </div>
            <div>
              <label className="block text-sm">주소</label>
              <div className="flex space-x-2">
                <input ref={zipRef} type="text" value={zipcode} onChange={e => setZipcode(e.target.value)}
                  placeholder="우편번호" className="border rounded p-2 w-1/4"
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addr1Ref.current?.focus(); } }}
                />
                <input ref={addr1Ref} type="text" value={address1} onChange={e => setAddress1(e.target.value)}
                  placeholder="주소" className="border rounded p-2 flex-1"
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addr2Ref.current?.focus(); } }}
                />
              </div>
              <input ref={addr2Ref} type="text" value={address2} onChange={e => setAddress2(e.target.value)}
                placeholder="상세주소" className="mt-2 border rounded p-2 w-full"
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); nickRef.current?.focus(); } }}
              />
            </div>
            <div>
              <label className="block text-sm">닉네임*</label>
              <input ref={nickRef} type="text" value={nick} onChange={e => setNick(e.target.value)}
                className="w-full border rounded p-2" required
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); avatarRef.current?.focus(); } }}
              />
            </div>
            <div>
              <label className="block text-sm">프로필 이미지</label>
              <input ref={avatarRef} type="file" accept="image/*"
                onChange={e => setAvatar(e.target.files[0])} className="w-full"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    // 마지막 input: Submit로 이동 (form submit)
                    // handleSubmit()은 자동 호출됨
                  }
                }}
              />
            </div>
            <div className="flex justify-between">
              <button type="button" onClick={() => setStep(1)} className="px-4 py-2 bg-gray-200 rounded">이전으로</button>
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">계정생성</button>
            </div>
          </form>
        )}

        {/* Step 3: Complete */}
        {step === 3 && (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">회원가입 완료!</h3>
            <p className="text-gray-600">계정이 성공적으로 생성되었습니다.</p>
            <button onClick={() => navigate('/')} className="px-6 py-2 bg-indigo-600 text-white rounded">홈으로 가기</button>
          </div>
        )}
      </div>
    </div>
  );
}
