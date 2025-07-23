import React from "react";
import { Link } from "react-router-dom";
import { RevealOnScroll } from "./RevealOnScroll";

const textTitle = "text-4xl md:text-5xl font-extrabold mb-6 text-blue-800";
const textDesc = "text-gray-700 text-xl md:text-2xl";

const serviceFeatures = [
  {
    title: "Smart Automation",
    desc: "업무를 혁신하는 AI 자동화와 최적화된 워크플로우 경험",
    icon: (
      <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2"
        viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round"
        d="M13 16h-1v-4h-1m1-4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" /></svg>
    ),
    img: "/nurung.png",
    alt: "Smart Automation",
    reverse: false,
    label: "AI 자동화",
  },
  {
    title: "Seamless Integration",
    desc: "다양한 툴·플랫폼과 손쉽게 연동, 하나의 경험으로",
    icon: (
      <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" strokeWidth="2"
        viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round"
        d="M8 17l4 4 4-4m0-5V3m-4 4v10" /></svg>
    ),
    img: "/nurung.png",
    alt: "Seamless Integration",
    reverse: true,
    label: "플랫폼 연동",
  },
  {
    title: "Instant Insight",
    desc: "실시간 데이터 분석과 인사이트, 빠른 투자 판단력 제공",
    icon: (
      <svg className="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2"
        viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round"
        d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
    ),
    img: "/nurung.png",
    alt: "Instant Insight",
    reverse: false,
    label: "데이터 인사이트",
  },
];

export default function Home() {
  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 via-white to-blue-0">
        <RevealOnScroll className="flex flex-col items-center justify-center text-center px-4" once>
          <span className="inline-block mb-3 px-4 py-1 bg-blue-50 text-blue-700 font-bold rounded-full shadow-sm tracking-widest text-xs md:text-sm">
            AI 기반 모의 코인 투자 플랫폼
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-blue-800 drop-shadow-lg mb-8 leading-tight">
            GENU 모의 코인 투자
          </h1>
          <p className="text-lg md:text-2xl text-blue-900/80 font-semibold mb-10 max-w-2xl">
            AI가 생성한 실전 같은 투자 시나리오<br />
            코인·뉴스·차트·자산까지 한눈에!
          </p>
          <div className="flex gap-6">
            <Link
              to="/coinlist"
              className="px-8 py-3 rounded-2xl text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              코인 투자 시작
            </Link>
          </div>
        </RevealOnScroll>
        {/* 하단 스크롤 유도 아이콘 */}
        <div className="absolute bottom-10 -translate-x-1/2 z-30 flex flex-col items-center animate-bounce">
          <div className="w-8 h-8 rounded-full border-2 border-blue-600 flex items-center justify-center bg-white">
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </div>
          <span className="mt-2 text-blue-700 text-base font-semibold">아래로 스크롤</span>
        </div>
      </section>

      {/* 서비스 소개 SECTION */}
      <section
        id="service"
        className="w-full bg-white py-20 px-2 flex flex-col gap-24 items-center border-t border-gray-200"
      >
        {serviceFeatures.map(({ title, desc, img, alt, reverse, icon, label }, i) => (
          <div
            key={title}
            className={
              "max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center" +
              (reverse ? " md:flex-row-reverse" : "") +
              " py-10 md:py-16"
            }
          >
            {/* 이미지+아이콘 */}
            <RevealOnScroll
              className={"flex flex-col items-center justify-center " + (reverse ? "order-1 md:order-2" : "")}
              once={false}
            >
              <div className="bg-gradient-to-br from-yellow-100 via-white to-blue-100 rounded-3xl shadow-xl flex flex-col items-center justify-center p-7 md:p-10 w-full">
                <div className="mb-4">{icon}</div>
                <img
                  src={img}
                  alt={alt}
                  className="mx-auto w-44 md:w-64 aspect-square bg-gray-100 rounded-full object-cover border-4 border-white shadow"
                  style={{
                    background:
                      "radial-gradient(circle at 70% 30%, #fde68a 0%, #e0e7ff 100%)",
                  }}
                />
                <span className="mt-4 inline-block text-xs font-semibold tracking-widest bg-blue-50 text-blue-700 rounded px-3 py-1">{label}</span>
              </div>
            </RevealOnScroll>
            {/* 텍스트 */}
            <RevealOnScroll
              className={"flex flex-col justify-center items-start px-2 " + (reverse ? "order-2 md:order-1" : "")}
              once={false}
            >
              <span className={textTitle + " mb-6"}>{title}</span>
              <span className={textDesc + " mb-7 leading-relaxed"}>{desc}</span>
            </RevealOnScroll>
          </div>
        ))}
      </section>
    </div>
  );
}
