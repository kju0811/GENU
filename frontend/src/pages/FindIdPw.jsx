import React, { useState } from "react";

const PHONE_PREFIXES = ["010", "011", "016", "017", "018", "019"];

export default function FindIdPw() {
  const [tab, setTab] = useState("pw");
  const [form, setForm] = useState({
    id: "",
    name: "",
    phone1: "010",
    phone2: "",
    phone3: "",
    code: "",
  });

  const handleInput = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // 실제 인증/제출 로직은 별도로 추가
  const handleSendCode = () => {
    // TODO: 인증번호 요청 처리
    alert("인증번호 발송!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 본인인증, 다음 단계로 이동
    alert("다음 단계!");
  };

  return (
    <div className="w-[90%] mx-auto p-4">
    <div className="max-w-xl mx-auto pt-10 pb-16 px-2 bg-white min-h-[90vh]">
      {/* 상단 타이틀 */}
      <h1 className="text-5xl font-bold text-center mb-8 tracking-tight">ID/PW 찾기</h1>
      {/* 탭 */}
      <div className="flex mb-6 border-b-4 border-black">
        <button
          onClick={() => setTab("id")}
          className={`flex-1 py-3 text-lg font-bold ${tab === "id" ? "bg-blue border-blue border-b-4 text-blue" : "bg-black text-white"}`}
        >
          아이디
        </button>
        <button
          onClick={() => setTab("pw")}
          className={`flex-1 py-3 text-lg font-bold ${tab === "pw" ? "bg-red border-red border-b-4 text-red" : "bg-black text-white"}`}
        >
          비밀번호
        </button>
      </div>

      {/* 안내문구 */}
      <div className="mb-8">
        <div className="font-bold text-lg mb-2">등록된 휴대폰 번호로 찾기</div>
        <div className="text-gray-700 mb-2">
          가입 당시 입력한 휴대전화 번호를 통해 인증 후 새비밀번호를 등록해주세요.
        </div>
      </div>

      {/* 폼 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 가입된 아이디 입력 (PW 탭만 노출) */}
        {tab === "pw" && (
          <input
            type="text"
            name="id"
            value={form.id}
            onChange={handleInput}
            placeholder="가입된 아이디 입력"
            className="w-full border px-4 py-3 rounded text-lg bg-gray-50 placeholder-gray-400 mb-1"
            required
          />
        )}

        {/* 이름 */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">이름</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleInput}
            placeholder="이름"
            className="w-full border px-4 py-3 rounded text-lg bg-gray-50 placeholder-gray-400"
            required
          />
        </div>

        {/* 휴대전화 */}
        <div className="flex flex-col gap-1">
          <label className="font-medium mb-1">휴대전화</label>
          <div className="flex gap-2">
            <select
              name="phone1"
              value={form.phone1}
              onChange={handleInput}
              className="w-24 border px-2 py-3 rounded text-lg bg-gray-50"
            >
              {PHONE_PREFIXES.map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <input
              name="phone2"
              type="text"
              value={form.phone2}
              onChange={handleInput}
              className="w-24 border px-2 py-3 rounded text-lg bg-gray-50"
              maxLength={4}
              placeholder=""
              required
            />
            <input
              name="phone3"
              type="text"
              value={form.phone3}
              onChange={handleInput}
              className="w-24 border px-2 py-3 rounded text-lg bg-gray-50"
              maxLength={4}
              placeholder=""
              required
            />
            <button
              type="button"
              onClick={handleSendCode}
              className="w-28 bg-black text-white font-bold rounded px-4 py-3 ml-1 hover:bg-gray-900 transition"
            >
              인증번호
            </button>
          </div>
        </div>

        {/* 인증번호 */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">인증번호</label>
          <input
            type="text"
            name="code"
            value={form.code}
            onChange={handleInput}
            className="w-full border px-4 py-3 rounded text-lg bg-gray-50"
            placeholder="인증번호 6자리 숫자 입력"
            maxLength={6}
            required
          />
          <span className="text-xs text-gray-500 mt-1">인증번호를 입력해주세요.</span>
        </div>

        {/* 다음 버튼 */}
        <button
          type="submit"
          className="w-full mt-8 bg-black text-white font-bold text-lg py-4 rounded hover:bg-gray-900 transition"
        >
          다음
        </button>
      </form>
    </div>
    </div>
  );
}
