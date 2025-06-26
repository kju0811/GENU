import React from "react";
import {Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
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

function App() {
  return (
    <>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Home />} /> {/* <Link to="/"> */}
        <Route path="/ai/news" element={<News />} />
        <Route path="/ai/newsfind" element={<NewsFind/>} />
        <Route path="/ai/read/:news_no" element={<NewsRead/>} />
        <Route path="/coin/:coin_no" element={<CoinRead/>} />
        {/* <Route path="/attendance/:attendance_no" element={<Attendance/>} /> */}
        <Route path="/coin/find_all" element={<CoinList/>} />
        <Route path="/coin/create" element={<CoinCreate/>} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
      {/* <Footer /> */}
    </>
  );  
}

export default App;



// 이후 확장 예정
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import Home from "./pages/Home";
// import NotFound from "./pages/NotFound";

// function App() {
//   return (
//     <Router>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//       <Footer />
//     </Router>
//   );
// }
