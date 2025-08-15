import React, { useEffect, useState } from 'react';
import { getIP } from '../components/Tool';
import { jwtDecode } from 'jwt-decode';

const PAGE_SIZE = 100;

export default function MyBalanceList() {
    const [payList, setPayList] = useState([]);
    const [page, setPage] = useState(1);

    // JWT에서 member_no 추출
    const jwt = sessionStorage.getItem('jwt');
    let member_no = null;
    if (jwt) {
        try { member_no = jwtDecode(jwt).member_no; } catch { }
    }

    useEffect(() => {
        if (!member_no) return;
        fetch(`http://${getIP()}:9093/pay/get_member_pay_list/${member_no}`, {
            headers: { Authorization: jwt }
        })
            .then(res => res.json())
            .then(list => setPayList(list || []))
            .catch(() => setPayList([]));
    }, [member_no, jwt]);

    if (!payList) return <div className="p-6 text-center">내역 불러오는 중...</div>;

    const startIndex = (page - 1) * PAGE_SIZE;
    const currentPageData = payList.slice(startIndex, startIndex + PAGE_SIZE);

    // 거래 타입 명칭
    const getTypeLabel = (type) =>
        type === 1 ? '매수'
            : type === 2 ? '매도'
                : type === 0 ? '지급'
                    : type === 3 ? '매수주문'
                        : type === 5 ? '주문취소'
                            : '기타';

    return (
        <main className="w-[98%] mx-auto p-2">
            <div className="max-w-5xl w-full mx-auto p-2">
                <div className="flex flex-col gap-2">
                    {/* 컬럼 헤더 */}
                    <div className="hidden md:flex items-center gap-1 px-2 pb-2 text-gray-500 text-xs border-b font-semibold">
                        <div className="w-8 text-center">#</div>
                        <div className="w-28 text-center">거래일시</div>
                        <div className="flex-1 text-center">구분</div>
                        <div className="flex-1 text-center">코인명</div>
                        <div className="flex-1 text-center">거래수량</div>
                        <div className="flex-1 text-center">체결가격</div>
                        <div className="flex-1 text-center">거래금액</div>
                        <div className="flex-1 text-center">수수료</div>
                        <div className="flex-1 text-center">정산금액</div>
                    </div>

                    {/* 리스트 */}
                    {currentPageData.map((item, idx) => {
                        // null safe
                        const deal = item.deal || {};
                        const coin = deal.coin || {};
                        const amount = deal.deal_cnt ?? '-';
                        const price = deal.deal_price ?? '-';
                        const total = (deal.deal_cnt && deal.deal_price) ? (deal.deal_cnt * deal.deal_price).toLocaleString() : '-';
                        const fee = deal.deal_fee != null ? deal.deal_fee.toLocaleString() : '-';

                        return (
                            <div
                                key={item.pay_no || idx}
                                className="flex items-center gap-1 p-2 bg-white hover:bg-gray-50 rounded shadow-sm cursor-default text-xs"
                            >
                                <div className="w-8 text-center text-gray-400">{startIndex + idx + 1}</div>
                                <div className="w-28 text-center text-gray-700 font-mono">
                                    {item.pay_date ? new Date(item.pay_date).toLocaleString("ko-KR") : '-'}
                                </div>
                                <div className="flex-1 text-center font-semibold">{getTypeLabel(item.pay_type)}</div>
                                <div className="flex-1 text-center">{coin.coin_name ?? '-'}</div>
                                <div className="flex-1 text-center">{amount !== '-' ? amount.toLocaleString() : '-'}</div>
                                <div className="flex-1 text-center">{price !== '-' ? price.toLocaleString() : '-'}</div>
                                <div className="flex-1 text-center">{total}</div>
                                <div className="flex-1 text-center">{fee}</div>
                                <div className="flex-1 text-center font-bold">{item.pay_pay != null ? item.pay_pay.toLocaleString() : '-'}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
