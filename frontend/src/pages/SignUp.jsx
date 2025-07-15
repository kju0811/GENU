import React, { useState } from 'react';
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

  // Move to Step2 after validating Step1
  const handleNext = () => {
    if (!id || !password || !confirmPw || password !== confirmPw || !agree) {
      alert('이메일, 비밀번호 일치 및 약관 동의가 필요합니다.');
      return;
    }
    setStep(2);
  };

  // Final submit with FormData
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Birth: ", birth);
    const formattedBirth = birth.replace(/-/g, '');
    console.log("formattedBirth: ", formattedBirth);

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
    <div className="w-full min-h-screen bg-white dark:bg-[#1E2028] text-black dark:text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {/* Progress */}
        <div className="flex justify-between mb-6">
          {['Account','Profile','Complete'].map((label, i) => (
            <div key={i} className="flex-1 text-center">
              <div className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center mb-1 \
                ${step-1 >= i ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                {i+1}
              </div>
              <span className={`${step-1 >= i ? 'text-indigo-600' : 'text-gray-500 dark:text-gray-400'} text-xs`}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: Account */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                value={id}
                onChange={e => setId(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <input
                type={showPswd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                required
                minLength={8}
              />
              <span
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onMouseDown={() => setShowPswd(true)}
                onMouseUp={() => setShowPswd(false)}
                onMouseLeave={() => setShowPswd(false)}
              >{showPswd ? '🙉' : '🙈'}</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
              <input
                type="password"
                value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)}
                className="w-full border rounded p-2"
                required
                minLength={8}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={agree}
                onChange={e => setAgree(e.target.checked)}
                className="mr-2"
                required
              />
              <span className="text-sm">약관에 동의합니다</span>
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >Next</button>
          </div>
        )}

        {/* Step 2: Profile */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm">Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border rounded p-2" required />
            </div>
            <div><label className="block text-sm">Birth</label>
              <input type="date" value={birth} onChange={e => setBirth(e.target.value)} className="w-full border rounded p-2" required />
            </div>
            <div><label className="block text-sm">Phone</label>
              <input type="tel" value={tel} onChange={e => setTel(e.target.value)} className="w-full border rounded p-2" required />
            </div>
            <div><label className="block text-sm">Address</label>
              <div className="flex space-x-2">
                <input type="text" value={zipcode} onChange={e => setZipcode(e.target.value)} placeholder="Zip" className="border rounded p-2 w-1/4" required />
                <input type="text" value={address1} onChange={e => setAddress1(e.target.value)} placeholder="Address1" className="border rounded p-2 flex-1" required />
              </div>
              <input type="text" value={address2} onChange={e => setAddress2(e.target.value)} placeholder="Address2" className="mt-2 border rounded p-2 w-full" />
            </div>
            <div><label className="block text-sm">Nickname</label>
              <input type="text" value={nick} onChange={e => setNick(e.target.value)} className="w-full border rounded p-2" required />
            </div>
            <div><label className="block text-sm">Avatar</label>
              <input type="file" accept="image/*" onChange={e => setAvatar(e.target.files[0])} className="w-full" />
            </div>
            <div className="flex justify-between">
              <button type="button" onClick={() => setStep(1)} className="px-4 py-2 bg-gray-200 rounded">Prev</button>
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Submit</button>
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
