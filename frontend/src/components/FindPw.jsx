import React, { useState } from "react";
import { getIP } from "../components/Tool";

export default function FindPw() {
  const [step, setStep] = useState(1);
  const [memberId, setMemberId] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [memberNo, setMemberNo] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const resetMessages = () => {
    setMessage("");
    setError("");
  };

  // 1단계: 인증번호 메일 전송
  const handleSendMail = async () => {
    resetMessages();
    try {
      const res = await fetch(`http://${getIP()}:9093/member/find_by_pw?memberId=${memberId}`, {
        method: "POST"
      });

      const parsed = await res.json();

      if (res.ok) {
        setMessage(parsed.message || "인증번호가 발송되었습니다.");
        setMemberNo(parsed.member_no);
        setStep(2);
      } else {
        setError(parsed.message || "에러가 발생했습니다.");
      }
    } catch {
      setError("메일 요청 중 오류가 발생했습니다.");
    }
  };

  // 2단계: 인증번호 확인
  const handleCheckCode = async () => {
    resetMessages();
    try {
      const res = await fetch(`http://${getIP()}:9093/member/check_code/${memberNo}?authCode=${authCode}`, {
        method: "POST"
      });
      const text = await res.text();

      if (res.ok) {
        setMessage(text);
        setStep(3);
      } else {
        setError(text);
      }
    } catch {
      setError("인증 확인 중 오류가 발생했습니다.");
    }
  };

  // 3단계: 비밀번호 변경
  const handleResetPw = async () => {
    resetMessages();

    if (newPw !== confirmPw) {
      setError("비밀번호가 서로 일치하지 않습니다.");
      return;
    }

    try {
      const res = await fetch(
        `http://${getIP()}:9093/member/new_pw/${memberNo}?new_pw=${newPw}`,
        { method: "POST" }
      );
      const text = await res.text();

      if (res.ok) {
        setMessage(text);
        setStep(4);
      } else {
        setError(text);
      }
    } catch {
      setError("비밀번호 변경 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      {step === 1 && (
        <div className="space-y-4">
          <label className="block font-medium text-gray-700 dark:text-white">아이디</label>
          <input
            type="text"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            className="w-full px-4 py-2 border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="가입한 아이디 입력"
          />
          <button
            onClick={handleSendMail}
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded hover:bg-indigo-700 transition"
          >
            인증번호 메일 전송
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <label className="block font-medium text-gray-700 dark:text-white">인증번호</label>
          <input
            type="text"
            value={authCode}
            onChange={(e) => setAuthCode(e.target.value)}
            className="w-full px-4 py-2 border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="메일로 받은 인증번호"
          />
          <button
            onClick={handleCheckCode}
            className="w-full bg-green-600 text-white font-semibold py-3 rounded hover:bg-green-700 transition"
          >
            인증 확인
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <label className="block font-medium text-gray-700 dark:text-white">새 비밀번호</label>
          <input
            type="password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            className="w-full px-4 py-2 border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="새 비밀번호 입력"
          />

          <label className="block font-medium text-gray-700 dark:text-white">비밀번호 확인</label>
          <input
            type="password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            className="w-full px-4 py-2 border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="비밀번호 재입력"
          />

          <button
            onClick={handleResetPw}
            className="w-full bg-purple-600 text-white font-semibold py-3 rounded hover:bg-purple-700 transition"
          >
            비밀번호 변경
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="text-center text-green-600 font-bold">
          🎉 비밀번호가 성공적으로 변경되었습니다!
        </div>
      )}
      {error && <p className="text-red-500 font-medium">{error}</p>}
    </div>
  );
}
