import React from "react";
import {Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
import Home from "./pages/Home";
import News from "./ai/News";
import NewsFind from "./ai/NewsFind";
import NewsRead from "./ai/NewsRead";
//import NotFound from "./pages/NotFound";

import CoinRead from "./components/CoinRead";
// import Attendance from "./components/Attendance";
import CoinList from "./components/CoinList";
import CoinCreate from "./components/CoinCreate";
import TradeForm from "./components/TradeForm";
import CandleStickChart from "./components/CandleStickChart";
import Schedule from "./pages/Calendar";
import CoinUpdate from "./components/CoinUpdate";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} /> {/* <Link to="/"> */}
        <Route path="/ai/news" element={<News />} />
        <Route path="/ai/newsfind" element={<NewsFind/>} />
        <Route path="/ai/read/:news_no" element={<NewsRead/>} />
        <Route path="/coin/:coin_no" element={<CoinRead/>} />
        {/* <Route path="/attendance/:attendance_no" element={<Attendance/>} /> */}
        <Route path="/coin/find_all" element={<CoinList/>} />
        <Route path="/coin/create" element={<CoinCreate/>} />
        <Route path="/coin/deal" element={<TradeForm/>} />
        <Route path="/coin/chart/:coin_no" element={<CandleStickChart/>} />
        <Route path="/calendar" element={<Schedule/>} />
        <Route path="/coin/update/:coin_no" element={<CoinUpdate/>} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
      {/* <Footer /> */}
    </>
  );  
}

export default App;