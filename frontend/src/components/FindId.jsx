import React, { useRef, useState } from "react";
import { getIP } from "../components/Tool";

export default function FindId() {
  const [form, setForm] = useState({
    member_name: "",
    phone1: "",
    phone2: "",
    phone3: "",
    memberBirth: ""
  });

  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  // 각 전화번호 필드 ref
  const phone1Ref = useRef(null);
  const phone2Ref = useRef(null);
  const phone3Ref = useRef(null);

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult("");
    setError("");

    const fullPhone = `${form.phone1}-${form.phone2}-${form.phone3}`;

    try {
      const response = await fetch(`http://${getIP()}:9093/member/find_by_id`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          member_name: form.member_name,
          member_tel: fullPhone,
          memberBirth: form.memberBirth
        })
      });

      if (response.ok) {
        const data = await response.text(); // 아이디는 문자열
        setResult(`🔍 찾은 아이디: ${data}`);
      } else {
        setError("아이디를 찾을 수 없습니다.");
      }
    } catch {
      setError("서버 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium mb-1">이름</label>
        <input
          type="text"
          name="member_name"
          value={form.member_name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded bg-gray-50 focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">전화번호</label>
        <div className="flex gap-2">
          <input
            type="text"
            name="phone1"
            value={form.phone1}
            ref={phone1Ref}
            onChange={(e) => {
              const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
              setForm(prev => ({ ...prev, phone1: v }));
              if (v.length === 3) phone2Ref.current?.focus();
            }}
            className="w-20 px-3 py-2 border rounded bg-gray-50 text-center"
            inputMode="numeric"
            maxLength={3}
            required
          />
          <span className="self-center">-</span>
          <input
            type="text"
            name="phone2"
            value={form.phone2}
            ref={phone2Ref}
            onChange={(e) => {
              const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
              setForm(prev => ({ ...prev, phone2: v }));
              if (v.length === 4) phone3Ref.current?.focus();
            }}
            className="w-24 px-3 py-2 border rounded bg-gray-50 text-center"
            inputMode="numeric"
            maxLength={4}
            required
          />
          <span className="self-center">-</span>
          <input
            type="text"
            name="phone3"
            value={form.phone3}
            ref={phone3Ref}
            onChange={(e) => {
              const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
              setForm(prev => ({ ...prev, phone3: v }));
            }}
            className="w-24 px-3 py-2 border rounded bg-gray-50 text-center"
            inputMode="numeric"
            maxLength={4}
            required
          />
        </div>
      </div>

      <div>
        <label className="block font-medium mb-1">생년월일</label>
        <input
          type="text"
          name="memberBirth"
          value={form.memberBirth}
          onChange={handleChange}
          placeholder="ex) 20250811"
          inputMode="numeric"
          maxLength={8}
          required
          className="w-full px-4 py-2 border rounded bg-gray-50 focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-500 text-white font-bold py-3 rounded hover:bg-indigo-600 transition"
      >
        아이디 찾기
      </button>

      {result && <p className="mt-4 text-green-600 font-medium text-center">{result}</p>}
      {error && <p className="mt-4 text-red-500 font-medium text-center">{error}</p>}
    </form>
  );
}
