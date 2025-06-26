import { Link } from "react-router-dom";
import React, {useEffect, useState} from 'react';
// import {useRecoilValue} from "recoil";
// import {IsLoginState, UserState} from "../recoil/RecoilState.js";
// import {axiosLogout} from "../api/axios.js";

function Navbar() {
    return (
      <>
        <nav className="bg-white shadow-md p-4 w-full">
        <div className="flex flex-col md:flex-row justify-between items-center">
            {/* 왼쪽: 로고 */}
            <div className="flex items-center gap-2">
                <Link to="/" className="text-3xl font-bold">
                <span className="text-orange-300">GENU</span>
                </Link>
            </div>
  
            {/* 중앙: 검색 */}
            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none"
                />
              </div>
            </div>
  
            {/* 오른쪽: 알림 + 프로필 */}
            <div className="flex items-center gap-4">
              <button className="text-gray-500 hover:text-gray-700">🔔</button>
              <img
                src="/default-profile.png"
                className="w-8 h-8 rounded-full"
                alt="profile"
              />
            </div>
          </div>
  
          {/* 아래 탭 메뉴 */}
          <div className="flex justify-center gap-6 mt-3 border-t pt-2">
            <button className="px-3 py-1 rounded-xl bg-gray-200 text-black font-medium">홈</button>
            <Link to="/ai/news" className="px-3 py-1 hover:text-blue-600">기사</Link>
            <button className="px-3 py-1 hover:text-blue-600">커뮤니티</button>
            <button className="px-3 py-1 hover:text-blue-600">내 자산</button>
          </div>
        </nav>
      </>
    );
  }
  
  export default Navbar;
  