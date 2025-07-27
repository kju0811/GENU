import React from "react";
import { getIP } from './Tool';

export default function MyCoinCard({ asset }) {
    if (!asset) return null;

    const {
        coin_img,
        coin_name,
        coin_price,
        coin_percentage,
        profitAmount, // 평가손익
        profitPercentage, // 수익률
        totalCnt, // 수량
        avg_price, // 매수평균가(평단가)
        previousTotalPrice, // 매수금액 (평단가 * 수량)
        total_price, // 평가금액 (현재가 * 수량)
    } = asset;

    return (
        <div className="bg-white rounded-xl shadow p-4 border text-sm space-y-1">
            {/* 상단 */}
            <div className="flex items-center justify-between border-b pb-2 mb-2">
                <div className="flex items-center gap-3">
                    <img
                        src={`http://${getIP()}:9093/home/storage/${coin_img}`}
                        alt={coin_name}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => { e.target.src = "/nurung.png"; }}
                    />
                    <div className="font-semibold text-gray-800">{coin_name}</div>
                </div>
                <div className="text-right">
                    <div className="text-red-600 font-semibold">
                        {coin_price.toLocaleString()} 누렁
                    </div>
                    <div className="text-xs flex justify-end gap-1">
                        <span className="text-xxs text-gray-500 mr-1">전일대비</span>
                        <span className={
                            coin_percentage > 0 ? "text-red-400"
                            : coin_percentage < 0 ? "text-blue-400"
                            : "text-gray-500"
                        }>
                            {coin_percentage > 0 ? `+${coin_percentage}` : `${coin_percentage}`}%
                        </span>
                    </div>
                </div>
            </div>

            {/* 하단 수치 */}
            <div className="text-xs text-gray-600 space-y-1 mt-0 pt-0">
                <div className="flex justify-between font-medium">
                    <span>평가손익</span>
                    <span className={
                        profitAmount > 0 ? "text-red-500"
                        : profitAmount < 0 ? "text-blue-500"
                        : "text-gray-600"
                    }>
                        {profitAmount > 0 ? "+" : ""}
                        {profitAmount.toLocaleString()} 누렁
                    </span>
                </div>

                <div className="flex justify-between font-medium">
                    <span>수익률</span>
                    <span className={
                        profitPercentage > 0 ? "text-red-500"
                        : profitPercentage < 0 ? "text-blue-500"
                        : "text-gray-600"
                    }>
                        {profitPercentage > 0 ? "+" : ""}
                        {profitPercentage.toFixed(2)}%
                    </span>
                </div>

                <div className="flex justify-between">
                    <span>보유수량</span>
                    <span>{totalCnt} 개</span>
                </div>
                <div className="flex justify-between">
                    <span>평균매수가</span>
                    <span>{avg_price.toLocaleString()} 누렁</span>
                </div>
                <div className="flex justify-between">
                    <span>매수금액</span>
                    <span>{previousTotalPrice.toLocaleString()} 누렁</span>
                </div>
                <div className="flex justify-between">
                    <span>평가금액</span>
                    <span>{total_price.toLocaleString()} 누렁</span>
                </div>
            </div>
        </div>
    );
}
