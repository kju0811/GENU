import React, { useState } from "react";
import { getIP } from "../components/Tool";
import { jwtDecode } from "jwt-decode";

export default function ChangePw() {
  const [oriPassword, setOriPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("새 비밀번호와 확인용 비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    
    // 토큰
    const jwt = sessionStorage.getItem("jwt");
    if (!jwt) {
      alert("로그인이 필요합니다.");
      setLoading(false);
      return;
    }
  let userInfo = null;
  if (jwt != null) {
    try {
      userInfo = jwtDecode(jwt);
    } catch (err) {
      console.error("JWT 디코딩 오류:", err);
    }
  }

  const member_no = userInfo?.member_no

    try {
      const res = await fetch(`http://${getIP()}:9093/member/change-pw/${member_no}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': jwt
        },
        body: JSON.stringify({ oriPassword, newPassword}),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `오류: ${res.status}`);
      }

      alert("비밀번호 변경 성공!");
      setOriPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      alert(error.message || "비밀번호 변경 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-6">비밀번호 변경</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">현재 비밀번호</label>
          <input
            type="password"
            value={oriPassword}
            onChange={(e) => setOriPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">새 비밀번호</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={4}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">새 비밀번호 확인</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={4}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "변경 중..." : "비밀번호 변경"}
        </button>
      </form>
    </div>
  );
}
