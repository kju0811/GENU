import React, { useState, useEffect } from "react";
import { getIP } from "../components/Tool";
import { CoinCategory } from "../components/CoinCategory";
import { useGlobal } from "../components/GlobalContext";

export default function News() {
  const [news, setNews] = useState([]);
  const [summary, setSummary] = useState("");
  const [cloading, setCloading] = useState(false);
  const [sloading, setSLoading] = useState(false);
  const [option1, setOption1] = useState("선택하지 않음");
  const [option3, setOption3] = useState("");
  const { option2, setOption2 } = useGlobal();

  const jwt = sessionStorage.getItem("jwt");

  const NewsCreate = () => {
    if (option1 === "선택하지 않음") return alert("호/악재는 필수입니다");
    setCloading(true);
    fetch(`http://${getIP()}:9093/news/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: jwt,
      },
      body: JSON.stringify({ option1, option2, option3 }),
    })
      .then((res) => res.json())
      .then((res) => setNews(res))
      .catch((err) => console.error(err))
      .finally(() => setCloading(false));
  };

  const Summary = (result) => {
    if (!news[0]?.res) return alert("뉴스를 먼저 생성해주세요");
    setSLoading(true);
    fetch(`http://${getIP()}:9093/news/summary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: jwt,
      },
      body: JSON.stringify({ result }),
    })
      .then((res) => res.json())
      .then((res) => setSummary(res))
      .catch((err) => console.error(err))
      .finally(() => setSLoading(false));
  };

  return (
    <div className="space-y-8 p-4 max-w-5xl mx-auto">
      {/* 안내 문구 */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm text-gray-700 rounded">
        <p>✅ 뉴스 생성 시 이미지는 자동 생성됩니다. GPT 응답 시간에 따라 최대 1~2분이 소요될 수 있습니다.</p>
      </div>

      {/* 옵션 선택 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
        {/* 왼쪽 - 뉴스 생성 옵션 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-10 space-y-4 min-h-[600px]">
          <h2 className="text-lg font-semibold">🧾 뉴스 생성 옵션</h2>

          {/* 호/악재 선택 */}
          <div className="space-y-2">
            <span className="text-sm font-medium">호/악재 선택</span>
            <div className="flex gap-2">
              <button
                onClick={() => setOption1("호재 뉴스")}
                className={`px-4 py-2 rounded ${option1 === "호재 뉴스" ? "bg-red-500 text-white" : "bg-gray-100"}`}
              >호재</button>
              <button
                onClick={() => setOption1("악재 뉴스")}
                className={`px-4 py-2 rounded ${option1 === "악재 뉴스" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
              >악재</button>
            </div>
          </div>

          {/* 카테고리 */}
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">카테고리 선택</label>
            <div className="relative">
              <CoinCategory
                value={option2}
                onSelect={setOption2}
                showNoneOption={true}
              />
            </div>
            {option2 && (
              <p className="text-sm text-indigo-600 mt-1">
                선택된 카테고리: <span className="font-semibold">{option2}</span>
              </p>
            )}
          </div>


          {/* 추가 설명 */}
          <div>
            <textarea
              value={option3}
              onChange={(e) => setOption3(e.target.value)}
              className="w-full h-48 border rounded p-3 resize-none min-h-[80px]"
              placeholder="추가 사항 입력..."
            />
          </div>

          <div className="flex items-center gap-3">
            <button onClick={NewsCreate} className="btn btn-primary text-white hover:bg-indigo-800  ">뉴스 생성</button>
            {cloading && <span className="loading loading-spinner" />}
          </div>
        </div>

        {/* ➜ 화살표 */}
        <div className="hidden md:flex justify-center items-center text-3xl text-gray-400">
          ➜
        </div>

        {/* 오른쪽 - 생성된 뉴스 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-10 space-y-4 min-h-[600px]">
          <h2 className="text-lg font-semibold">📰 생성된 뉴스</h2>
          <textarea
            className="w-full border rounded p-3 h-48 resize-none"
            readOnly
            value={news[0]?.res || ""}
          />
          <div className="flex items-center gap-3">
            <button
              onClick={() => Summary(news[0]?.res)}
              className="btn btn-primary px-4 py-2 hover:bg-indigo-800 text-white rounded"
            >
              요약하기
            </button>
            {sloading && <span className="loading loading-spinner" />}
          </div>
          <textarea
            className="w-full border rounded p-3 h-32 resize-none"
            readOnly
            value={summary?.res || ""}
          />
        </div>
      </div>

      {/* 이미지 영역 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-10 text-center space-y-4 mt-10">
        <h2 className="text-lg font-semibold">🖼 생성된 이미지</h2>
        <img
          src={news[1] ? `http://${getIP()}:9093/home/storage/${news[1]}.jpg` : "https://cdn.startupful.io/img/app_logo/no_img2.png"}
          alt="generated"
          className="w-full md:w-[60%] mx-auto rounded shadow max-h-[400px] object-contain"
        />
      </div>
    </div>
  );
}
