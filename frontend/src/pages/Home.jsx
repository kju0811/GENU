import React from "react";
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>GENU</h1>
        <p>React + Vite 프로젝트가 정상 작동 중입니다.</p>
        <Link to="/ai/news">llm 기사 생성</Link><br />
        <Link to="/ai/newsfind">기사 보러가기</Link><br />
        <Link to="/calendar">캘린더</Link><br />
        <Link to="/announce">공지사항</Link><br />
        <Link to="/coin/find_all">코인 보러가기</Link>
        </div>
  );
}

export default Home;