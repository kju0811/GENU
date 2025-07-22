import React from "react";
import { Link } from "react-router-dom";
import { RevealOnScroll } from "./RevealOnScroll";

const textTitle = "text-4xl md:text-5xl font-extrabold mb-6 text-blue-800";
const textDesc = "text-gray-700 text-xl md:text-2xl";

const serviceFeatures = [
  {
    title: "Smart Automation",
    desc: "Streamline your workflow with intelligent automation tools and time-saving features.",
    img: "/nurung.png",
    alt: "Smart Automation",
    reverse: false,
  },
  {
    title: "Seamless Integration",
    desc: "Connect with your favorite tools and platforms for a unified experience.",
    img: "/nurung.png",
    alt: "Seamless Integration",
    reverse: true,
  },
  {
    title: "Smart Automation",
    desc: "Streamline your workflow with intelligent automation tools and time-saving features.",
    img: "/nurung.png",
    alt: "Smart Automation",
    reverse: false,
  },
];

export default function Home() {
  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-200 via-white to-blue-10">
        <RevealOnScroll className="flex flex-col items-center justify-center text-center px-4" once={true}>
          <h1 className="text-6xl md:text-7xl font-extrabold text-blue-800 drop-shadow-lg mb-8">
            GENU 모의 코인 투자
          </h1>
          <p className="text-2xl md:text-3xl text-blue-900/80 font-semibold mb-10 max-w-2xl">
            AI가 생성한 실전 같은 투자 시나리오,<br />
            코인 / 뉴스 / 차트 / 자산까지 한눈에!
          </p>
          <div className="flex gap-6">
            <Link
              to="/coinlist"
              className="px-8 py-3 rounded-2xl text-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xl transition"
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
        className="w-full bg-white py-24 px-4 flex flex-col gap-40 items-center"
      >
        {serviceFeatures.map(({ title, desc, img, alt, reverse }, i) => (
          <div
            key={title}
            className={
              "max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center" +
              " " +
              (reverse ? "md:flex-row-reverse" : "") +
              " py-12 md:py-20"
            }
          >
            <RevealOnScroll
              className={
                "flex justify-center " +
                (reverse ? "order-1 md:order-2" : "")
              }
              once={false}
            >
              <img
                src={img}
                alt={alt}
                className="mx-auto w-3/4 md:w-2/3 aspect-video bg-gray-200 rounded-lg object-cover"
                style={{
                  background:
                    "radial-gradient(circle at 70% 30%, #ffd6e6 0%, #fcf6a7 50%, #97b3f7 100%)",
                }}
              />
            </RevealOnScroll>
            <RevealOnScroll
              className={reverse ? "order-2 md:order-1" : ""}
              once={false}
            >
              <h2 className={textTitle + " mb-8"}>{title}</h2>
              <p className={textDesc + " mb-6"}>{desc}</p>
            </RevealOnScroll>
          </div>
        ))}
      </section>
    </div>
  );
}
