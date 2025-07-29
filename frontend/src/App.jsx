import React, { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import News from "./ai/News";
import NewsFind from "./ai/NewsFind";
import NewsRead from "./ai/NewsRead";
//import NotFound from "./pages/NotFound";

// import Attendance from "./components/Attendance";
import CoinCreate from "./components/CoinCreate";
import CoinDetail from "./pages/CoinDetail";
import SignUp from "./pages/SignUp";
import CoinList from "./pages/CoinList";
import Schedule from "./pages/Calendar";
import CoinUpdate from "./components/CoinUpdate";
import OrderBook from "./components/OrderBook";
import MemberList from "./pages/MemberList";
import DealList from "./components/DealList";
import Chatbot from "react-chatbot-kit";
import config from "./ai/config";
import MessageParser from "./ai/MessageParser";
import ActionProvider from "./ai/ActionProvider";
import { useGlobal } from "./components/GlobalContext";
import { ChatOpen } from "./components/chatCompnents";
import NotificationLog from "./components/NotificationLog";
import Announce from "./pages/Announce";
import Announce_find from "./pages/Announce_find";
import Announce_read from "./pages/Announce_read";

import SocialLogin from "./components/SocialLogin"; // SNS 로그인용
import "react-chatbot-kit/build/main.css";
import "./style/chat.css";
import NotFound from "./pages/NotFound";
import MyPage from "./pages/MyPage";
import FindIdPw from "./pages/FindIdPw";
import CoinLikeList from "./components/CoinLikeList"
import Portfolio from "./components/Portfolio";
import Mind from "./ai/Mind";
import Mindfind from "./ai/MindFind";
import MindRead from "./ai/MindRead";

import { getInitialMessages } from "./components/chatCompnents";
import CoinInfo from "./components/CoinInfo";
import OrderTab from "./components/OrderTab";
import CommunityFeed from "./components/CommunityFeed";
import { jwtDecode } from "jwt-decode";
import Forbidden from "./pages/Forbidden";
import MemberUpdate from "./components/MemberUpdate";
import ChangePw from "./components/ChangePw";

function App() {
  const { close, hideNavbar, hideChatbot } = useGlobal();
  const getmsg = getInitialMessages();
  const jwt = sessionStorage.getItem('jwt');
  let userInfo = null;
  if (jwt != null) {
    try {
      userInfo = jwtDecode(jwt);
    } catch (err) {
      console.error("JWT 디코딩 오류:", err);
    }
  }

  const role = userInfo?.role;
  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} /> {/* <Link to="/"> */}
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/ai/newsfind" element={<NewsFind />} />
        <Route path="/ai/read/:newsno" element={<NewsRead />} />
        {/* <Route path="/attendance/:attendance_no" element={<Attendance/>} /> */}
        <Route path="/coinlist" element={<CoinList />} />
        <Route path="/coin/:coin_no/*" element={<CoinDetail />}>
          <Route path="order" element={<OrderTab />} />
          <Route path="info" element={<CoinInfo />} />
          <Route path="community" element={<CommunityFeed />} />
          <Route index element={<Navigate to="order" replace />} />
        </Route>
        <Route path="/calendar" element={<Schedule />} />
        <Route path="/coin/update/:coin_no" element={<CoinUpdate />} />
        <Route path="/coin/tickList/:coin_no" element={<OrderBook />} />
        <Route path="/announce_find" element={<Announce_find />} />
        <Route path="/mindfind" element={<Mindfind />} />
        <Route path="/mindread/:mindno" element={<MindRead />} />
        <Route path="/announce_read/:announce_no" element={<Announce_read />} />
        <Route path="/deal/dealList/:member_no" element={<DealList />} />
        <Route path="/notification/find_by_MemberNotification/:member_no" element={<NotificationLog />} />
        <Route path="/findidpw" element={<FindIdPw />} />

        {role === "USER" || role === "ADMIN" ? (
          <Route path="/mypage/*" element={<MyPage />}>
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="memberupdate" element={<MemberUpdate />} />
            <Route path="changepw" element={<ChangePw />} />
            <Route path="membermind" element={<Mind />} />
            <Route path="coinlikelist" element={<CoinLikeList />} />
            <Route index element={<Navigate to="portfolio" replace />} />
          </Route>
        ) : (
          // 권한 없을경우
          <Route path="/mypage/*" element={<Forbidden />} />
        )}

        {role == "ADMIN" ? (
          <>
            <Route path="/ai/news" element={<News />} />
            <Route path="/coin/create" element={<CoinCreate />} />
            <Route path="/announce" element={<Announce />} />
            <Route path="/member" element={<MemberList />} />
          </>
        ) :
          (
            <>
              <Route path="/ai/news" element={<Forbidden />} />
              <Route path="/coin/create" element={<Forbidden />} />
              <Route path="/announce" element={<Forbidden />} />
              <Route path="/member" element={<Forbidden />} />
            </>
          )}
        <Route path="*" element={<NotFound />} />

        <Route path="/sociallogin" element={<SocialLogin />} /> {/* Backend 로그인후 실행, Backend: OAuthSuccessHandler.java */}
      </Routes>
      {!hideChatbot && (
        !close ? (
          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
            placeholderText="메세지를 입력해주세요"
            messageHistory={getmsg}
          />
        ) : (
          <ChatOpen />
        )
      )}
      {!hideNavbar && <Footer />}
    </>
  );
}

export default App;