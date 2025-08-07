import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIP, getNowDate } from '../components/Tool';
import ImageUpload from '../components/ImageUpload';
import SMSModal from '../components/SMSModal';

export default function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPswd, setShowPswd] = useState(false);

  // Step1: Account Info
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [agree, setAgree] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Step2: Profile Info
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [tel1, setTel1] = useState('');
  const [tel2, setTel2] = useState('');
  const [tel3, setTel3] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [nick, setNick] = useState('');
  const [file, setFile] = useState(null);

  // Step1 input refs
  const emailRef = useRef(null);
  const pwRef = useRef(null);
  const pwcRef = useRef(null);
  const agreeRef = useRef(null);

  // Step2 input refs
  const nameRef = useRef(null);
  const birthRef = useRef(null);
  const tel1Ref = useRef(null);
  const tel2Ref = useRef(null);
  const tel3Ref = useRef(null);
  const zipRef = useRef(null);
  const addr1Ref = useRef(null);
  const addr2Ref = useRef(null);
  const nickRef = useRef(null);
  const imgRef = useRef(null);

  // Daum Postcode 동적 로딩
  useEffect(() => {
    if (!window.daum?.Postcode) {
      const script = document.createElement("script");
      script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const openDaumPostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setZipcode(data.zonecode);
        setAddress1(data.roadAddress || data.jibunAddress);
        addr2Ref.current?.focus();
      }
    }).open();
  };

  const handleNext = () => {
    if (!id || !password || !confirmPw || password !== confirmPw || !agree) {
      alert('이메일, 비밀번호 일치 및 약관 동의가 필요합니다.');
      return;
    }
    setStep(2);
    setTimeout(() => nameRef.current?.focus(), 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedBirth = birth.replace(/-/g, '');

    const member = {
      memberId: id,
      memberPw: password,
      member_name: name,
      member_tel: `${tel1}-${tel2}-${tel3}`,
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
    if (file) formData.append('file', file);

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


  // 스타일 공통 변수로 선언 (가독성↑, 재사용)
  const inputClass =
    "w-full rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white dark:bg-gray-700 p-3 transition placeholder-gray-400";
  const inputClassShort =
    "rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white dark:bg-gray-700 p-3 text-center transition placeholder-gray-400";

  return (
    <div className="w-[90%] mx-auto p-4">
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-10">
          {/* Progress */}
          <div className="flex justify-between items-center mb-8">
            {['계정정보', '회원정보', '가입성공'].map((label, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className={`w-9 h-9 flex items-center justify-center rounded-full mb-2 text-base font-bold transition-colors duration-500
                  ${step - 1 >= i ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
                  {i + 1}
                </div>
                <span className={`text-xs md:text-sm font-semibold ${step - 1 >= i ? 'text-indigo-600' : 'text-gray-500 dark:text-gray-400'}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Step1: Account */}
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
                  className={inputClass}
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
                  className={inputClass + " pr-10"}
                  required
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
                  className={inputClass}
                  required
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
                  className="mr-2 rounded border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  required
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleNext();
                    }
                  }}
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm">가격 알림 SMS 수신 동의(필수)</span>
                  <span
                    role="button"
                    tabIndex={0}
                    className="text-xs underline text-indigo-500 hover:text-indigo-700 cursor-pointer px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                    onClick={() => setModalOpen(true)}
                  >
                    더보기
                  </span>
                </div>

              </div>
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >다음으로</button>
            </form>
          )}

          {/* Step2: Profile */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
              <div>
                <label className="block text-sm">이름*</label>
                <input ref={nameRef} type="text" value={name} onChange={e => setName(e.target.value)}
                  className={inputClass}
                  required
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); birthRef.current?.focus(); } }}
                />
              </div>
              <div>
                <label className="block text-sm">생년월일*</label>
                <input
                  ref={birthRef}
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  value={birth}
                  placeholder="YYYYMMDD 예: 20000101"
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/[^0-9]/g, '').slice(0, 8);
                    setBirth(cleaned);
                  }}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-sm">핸드폰번호*</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={3}
                    value={tel1}
                    onChange={e => {
                      const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
                      setTel1(v);
                      if (v.length === 3) tel2Ref.current?.focus();
                    }}
                    className={inputClassShort + " w-16"}
                    ref={tel1Ref}
                    required
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onKeyDown={e => {
                      if (e.key === 'Enter') { e.preventDefault(); tel2Ref.current?.focus(); }
                    }}
                  />
                  <span className="self-center">-</span>
                  <input
                    type="text"
                    maxLength={4}
                    value={tel2}
                    onChange={e => {
                      const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                      setTel2(v);
                      if (v.length === 4) tel3Ref.current?.focus();
                    }}
                    className={inputClassShort + " w-20"}
                    ref={tel2Ref}
                    required
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onKeyDown={e => {
                      if (e.key === 'Enter') { e.preventDefault(); tel3Ref.current?.focus(); }
                    }}
                  />
                  <span className="self-center">-</span>
                  <input
                    type="text"
                    maxLength={4}
                    value={tel3}
                    onChange={e => {
                      const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                      setTel3(v);
                    }}
                    className={inputClassShort + " w-20"}
                    ref={tel3Ref}
                    required
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onKeyDown={e => {
                      if (e.key === 'Enter') { e.preventDefault(); zipRef.current?.focus(); }
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm">주소</label>
                <div className="flex space-x-2">
                  <input
                    ref={zipRef}
                    type="text"
                    value={zipcode}
                    onChange={e => setZipcode(e.target.value)}
                    placeholder="우편번호"
                    className={inputClass + " w-1/4"}
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={openDaumPostcode}
                    className="px-3 py-2 bg-indigo-100 text-xs text-indigo-800 rounded hover:bg-indigo-200 transition"
                  >우편번호 찾기</button>
                </div>
                <input
                  ref={addr1Ref}
                  type="text"
                  value={address1}
                  onChange={e => setAddress1(e.target.value)}
                  placeholder="주소"
                  className={inputClass + " mt-2"}
                  readOnly
                />
                <input
                  ref={addr2Ref}
                  type="text"
                  value={address2}
                  onChange={e => setAddress2(e.target.value)}
                  placeholder="상세주소"
                  className={inputClass + " mt-2"}
                />
              </div>
              <div>
                <label className="block text-sm">닉네임*</label>
                <input ref={nickRef} type="text" value={nick} onChange={e => setNick(e.target.value)}
                  className={inputClass}
                  required
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); imgRef.current?.focus(); } }}
                />
              </div>
              <div>
                <label className="block text-sm">프로필 이미지</label>
                <ImageUpload
                  value={file}
                  onChange={setFile}
                  // originUrl={기존이미지 있으면 주소}
                  // previewSize={96}
                  label="이미지 업로드"
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
              <p className="text-lg font-bold text-amber-500">가입 기념 1000만누렁 지급!</p>
              <button onClick={() => navigate('/')} className="px-6 py-2 bg-indigo-600 text-white rounded">홈으로 가기</button>
            </div>
          )}
        </div>
      </div>
      <SMSModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}