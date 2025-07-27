import React, { useState } from "react";
import FindId from "../components/FindId";
import FindPw from "../components/FindPw";

export default function FindIdPw() {
  const [tab, setTab] = useState("id");

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-10 min-h-[700px] flex flex-col justify-start">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-10">
          ID / 비밀번호 찾기
        </h1>

        {/* 탭 선택 영역 */}
        <div className="flex justify-center mb-10">
          <div className="flex w-full max-w-md rounded-lg overflow-hidden border border-indigo-500">
            <button
              onClick={() => setTab("id")}
              className={`w-1/2 py-4 text-lg transition font-semibold
                ${tab === "id"
                  ? "bg-indigo-600 text-white shadow-inner font-bold"
                  : "bg-white text-indigo-600 dark:bg-gray-700 dark:text-indigo-300"
                }`}
            >
              아이디 찾기
            </button>
            <button
              onClick={() => setTab("pw")}
              className={`w-1/2 py-4 text-lg transition font-semibold
                ${tab === "pw"
                  ? "bg-indigo-600 text-white shadow-inner font-bold"
                  : "bg-white text-indigo-600 dark:bg-gray-700 dark:text-indigo-300"
                }`}
            >
              비밀번호 찾기
            </button>
          </div>
        </div>

        {/* 탭 콘텐츠 */}
        <div className="flex-1 min-h-[400px]">
          {tab === "id" ? <FindId /> : <FindPw />}
        </div>
      </div>
    </div>
  );
}
