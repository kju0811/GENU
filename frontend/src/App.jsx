import React, { useState } from "react";
import {Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
import Home from "./pages/Home";
import News from "./ai/News";
import NewsFind from "./ai/NewsFind";
import NewsRead from "./ai/NewsRead";
//import NotFound from "./pages/NotFound";

// import Attendance from "./components/Attendance";
import CoinCreate from "./components/CoinCreate";
import CoinDetail from "./pages/CoinDetail";
import SignUp from "./pages/SignUp";
// import CoinList from "./pages/CoinList";
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

import "react-chatbot-kit/build/main.css";
import "./style/chat.css";
import NotFound from "./pages/NotFound";

function App() {
  const { close, hideNavbar,hideChatbot } = useGlobal();

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} /> {/* <Link to="/"> */}
        <Route path="/SignUp" element={<SignUp />} /> 
        <Route path="/ai/news" element={<News />} />
        <Route path="/ai/newsfind" element={<NewsFind/>} />
        <Route path="/ai/read/:newsno" element={<NewsRead/>} />
        {/* <Route path="/attendance/:attendance_no" element={<Attendance/>} /> */}
        <Route path="/coin/create" element={<CoinCreate/>} />
        {/* <Route path="/coinlist" element={<CoinList />} /> */}
        <Route path="/coin/:coin_no" element={<CoinDetail/>} />
        <Route path="/calendar" element={<Schedule/>} />
        <Route path="/coin/update/:coin_no" element={<CoinUpdate/>} />
        <Route path="/coin/tickList/:coin_no" element={<OrderBook/>} />
        <Route path="/member" element={<MemberList />} />
        <Route path="/deal/dealList/:member_no" element={<DealList/>} />
        <Route path="/notification/find_by_MemberNotification/:member_no" element={<NotificationLog/>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
      {!hideChatbot && (
        !close ? (
          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
            placeholderText="메세지를 입력해주세요"
          />
        ) : (
          <ChatOpen />
        )
      )}
      {/* <Footer /> */}
    </>
  );  
}

export default App;