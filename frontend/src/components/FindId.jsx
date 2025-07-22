import React, { useState } from "react";
import axios from "axios";
import { getIP } from '../components/Tool';

function FindId() {
  const [form, setForm] = useState({
    name: "",
    tel: "",
    birth: ""
  });
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult("");

    try {
      const response = await axios.post(`http://${getIP()}:9093/member/find_by_id`, form);
      setResult(`찾은 아이디: ${response.data}`);
    } catch (err) {
      setError(err.response?.data || "아이디를 찾을 수 없습니다.");
    }
  };

  return (
    <div>
      <h2>아이디 찾기</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>이름: </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>전화번호: </label>
          <input
            type="tel"
            name="tel"
            value={form.tel}
            onChange={handleChange}
            placeholder="숫자만 입력"
            required
          />
        </div>
        <div>
          <label>생년월일 (YYYYMMDD): </label>
          <input
            type="text"
            name="birth"
            value={form.birth}
            onChange={handleChange}
            maxLength={8}
            placeholder="예: 19900101"
            required
          />
        </div>
        <button type="submit">아이디 찾기</button>
      </form>

      {result && <p style={{ color: "green" }}>{result}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default FindId;