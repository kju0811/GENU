import React, { useEffect } from 'react';

export default function MyBalanceCard({ nurung, assetSummary }) {

    const totalAsset = nurung + (assetSummary?.totalPrice || 0);

    return (
        <div className="bg-gray-800 rounded-xl text-white p-6 shadow-lg h-[300px]">
            <div className="text-lg font-semibold mb-2">💼 내 자산 요약</div>

            {/* 💼 내 총 자산 = 보유현금 + 코인 평가액 */}
            <div className="text-3xl font-bold mb-4 flex items-end gap-2">
                {totalAsset.toLocaleString()} 누렁
                <span className="text-xs text-white/70 mb-[2px]">(현금 + 코인)</span>
            </div>

            {/* 상세 breakdown */}
            <div className="text-sm space-y-2">
                <div>
                    💰 보유 현금:
                    <strong className="text-base font-medium ml-1">
                        {nurung?.toLocaleString()} 누렁
                    </strong>
                </div>
                <div>
                    🪙 코인 평가액:
                    <strong className="text-base font-medium ml-1">
                        {assetSummary?.totalPrice?.toLocaleString() || 0} 누렁
                    </strong>
                </div>
                <div>
                    🎢 평가 손익:
                    <strong className={`text-base font-medium ml-1 ${assetSummary?.totalProfit >= 0 ? 'text-red-400' : 'text-blue-400'}`}>
                        {assetSummary?.totalProfit?.toLocaleString() || 0} 누렁
                    </strong>
                </div>
                <div>
                    📈 수익률:
                    <strong className={`ml-1 text-base font-medium ${assetSummary?.totalProfitPercentage >= 0 ? 'text-red-400' : 'text-blue-400'}`}>
                        {assetSummary?.totalProfitPercentage?.toFixed(2) || 0}%
                    </strong>
                </div>
            </div>

            <div className="text-xs opacity-80 mt-4">* 최근 기준으로 계산된 수치입니다</div>
        </div>
    );
}
