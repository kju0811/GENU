import React, { useState, useEffect } from "react";
import { getIP } from '../components/Tool';
import { useNavigate } from "react-router-dom";
import { useOutletContext } from 'react-router-dom';

export default function Mind() {
    const navigate = useNavigate();
    const { member_no, jwt } = useOutletContext();
    const [dealinfo, setDealinfo] = useState([]);
    const [mindata, setMindata] = useState([]);
    const [cloading, setCloading] = useState(false);

    // 거래 내역 조회
    const getDeal = async () => {
        try {
            const res = await fetch(`http://${getIP()}:9093/deal/find_deal_by_member_coin_twoweek/${member_no}`);
            const result = await res.json();
            setDealinfo(result);
        } catch (err) {
            console.error("거래 내역 불러오기 오류:", err);
        }
    };

    // 마인드 분석 결과 전체 조회
    const getMindData = async () => {
        try {
            const res = await fetch(`http://${getIP()}:9093/mind/find_all`);
            const result = await res.json();
            setMindata(result);
        } catch (err) {
            console.error("마인드 데이터 불러오기 오류:", err);
        }
    };

    // 초기 데이터 가져오기
    useEffect(() => {
        if (!member_no) return;
        getDeal();
        getMindData();
    }, [member_no]);

    // 심리 분석 요청
    const createmind = () => {
        setCloading(true);
        const userMinds = mindata.filter(item => item.member?.member_no === member_no);

        if (userMinds.length >= 3) {
            const name = dealinfo[0]?.member.member_nick;
            const price = dealinfo.map(item => String(item.deal_price));
            const cnt = dealinfo.map(item => String(item.deal_cnt));
            const coin = dealinfo.map(item => item.coin.coin_name);
            const percent = dealinfo.map(item => String(item.coin.coin_percentage));

            fetch(`http://${getIP()}:9093/mind/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                },
                body: JSON.stringify({ name, price, cnt, coin, percent }),
            })
                .then(() => getMindData())
                .finally(() => setCloading(false));
        } else {
            alert("거래기록이 3회 이상일 때부터 분석이 가능합니다.");
            setCloading(false);
        }
    };

    // 본인 분석 결과 찾기
    const userMind = mindata.find(item => item.member?.member_no === member_no);

    return (
        <div className="flex flex-col">
            {/* 이전 분석 보러가기 버튼 */}
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate('/mindfind')}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
                >
                    <span>🧠 이전 분석 보러가기</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                <div className="text-gray-500 text-sm">
                    📢 아래 심리 분석 등급표 꼭 확인해주세요
                </div>
            </div>

            <div className="bg-gray-300 rounded-xl shadow p-8 w-full min-w-[600px] min-h-[500px] flex flex-col">
                {userMind
                    ? <span>{userMind.mindcontent}</span>
                    : <span className="text-gray-500">아직 분석 기록이 없습니다.</span>
                }
            </div>

            <button onClick={createmind} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                심리분석 요청하기
            </button>

            {cloading && <span className="loading loading-bars loading-xl mt-4" />}

            {/* 주의사항 영역 */}
            <div className="w-full flex justify-center items-center mt-8">
                <div className="max-w-2xl w-full bg-white p-6 rounded-xl shadow text-sm text-gray-800 leading-relaxed text-center">
                    <h2 className="text-lg font-semibold text-red-600 mb-4">📊 심리 분석 등급표 안내</h2>
                    <p className="mb-6 text-center text-gray-600">
                        AI는 아래 기준에 따라 거래 성향을 분석합니다.<br />
                        재미로 봐주시고 실제 투자에 맹신하지는 마세요 😊
                    </p>
                    <ul className="list-none space-y-6 text-center">
                        <li className="border-l-8 border-red-500 bg-red-100 p-4 rounded-md shadow-md">
                            <strong className="text-red-700 text-lg">🤑 S등급 - 초공격형</strong><br />
                            <span className="text-sm text-gray-800">
                                극도의 수익을 추구하며, 큰 손실도 감수할 수 있는 성향.
                                <br />• 자산 70% 이상 집중 매수<br />• 하락장 매수, 급등 추격
                            </span>
                        </li>
                        <li className="border-l-8 border-orange-400 bg-orange-100 p-4 rounded-md shadow-md">
                            <strong className="text-orange-600 text-lg">⚔️ A등급 - 공격형</strong><br />
                            <span className="text-sm text-gray-800">
                                수익 중시, 일정 손실 감수<br />• 자산 40~70% 단기 투입
                            </span>
                        </li>
                        <li className="border-l-8 border-yellow-400 bg-yellow-100 p-4 rounded-md shadow-md">
                            <strong className="text-yellow-700 text-lg">⚖️ B등급 - 적극형</strong><br />
                            <span className="text-sm text-gray-800">
                                수익과 안정 중립<br />• 자산 20~40% 분할 매수, 급락 시 소폭 추가
                            </span>
                        </li>
                        <li className="border-l-8 border-green-500 bg-green-100 p-4 rounded-md shadow-md">
                            <strong className="text-green-700 text-lg">🌱 C등급 - 안정추구형</strong><br />
                            <span className="text-sm text-gray-800">
                                리스크 회피 성향<br />• 10~20% 분산 매수, 평균 단가 낮추기 위주
                            </span>
                        </li>
                        <li className="border-l-8 border-blue-500 bg-blue-100 p-4 rounded-md shadow-md">
                            <strong className="text-blue-700 text-lg">🧊 D등급 - 보수형</strong><br />
                            <span className="text-sm text-gray-800">
                                리스크 극도 회피<br />• 매수 거의 없음, 단기 수익 실현 후 매도
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
