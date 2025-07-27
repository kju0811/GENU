import React, { useEffect, useState } from 'react';
import { getIP } from '../components/Tool';
import { useOutletContext } from 'react-router-dom';
import Spinner from './Spinner';
import MyBalanceCard from './MyBalanceCard';
import PieChartCard from './PieChartCard';
import MyCoinCard from './MyCoinCard';

export default function Portfolio() {
    const { member_no, jwt } = useOutletContext();

    // 사용자 정보, 누렁 보유량, 요약 데이터
    const [member, setMember] = useState(null);
    const [nurung, setNurung] = useState(0);
    const [assetSummary, setAssetSummary] = useState(null);

    // 자산 요약용 기본 리스트
    const [assetList, setAssetList] = useState([]);

    // MyCoinCard용 상세 리스트
    const [detailedAssetList, setDetailedAssetList] = useState([]);

    // 전체 로딩 확인
    const [isLoading, setIsLoading] = useState(true);

    // 회원 정보 가져오기
    const fetchMember = async () => {
        try {
            const res = await fetch(`http://${getIP()}:9093/member/read/${member_no}`);
            const data = await res.json();
            setMember(data);
        } catch (err) {
            setMember(null);
        }
    };

    // 누렁 금액 가져오기
    const fetchNurung = async () => {
        try {
            const res = await fetch(`http://${getIP()}:9093/pay/my/${member_no}`, {
                headers: { Authorization: jwt }
            });
            const data = await res.json();
            setNurung(data);
        } catch (err) {
            setNurung(0);
        }
    };

    // MyBalanceCard, PieChartCard용 전체 반환
    const fetchAssetData = async () => {
        try {
            const res = await fetch(`http://${getIP()}:9093/deal/get_member_asset/${member_no}`, {
                headers: { Authorization: jwt },
            });
            const list = await res.json();
            setAssetList(list);

            // 요약 계산 (보유 수량, 평가 금액, 손익 등)
            let totalCount = 0, totalPrice = 0, totalProfit = 0;
            list.forEach(item => {
                totalCount += item.cnt;
                totalPrice += item.total_price;
                totalProfit += item.profitAmount;
            });

            const totalProfitPercentage = totalPrice !== 0 ? (totalProfit / totalPrice) * 100 : 0;
            setAssetSummary({ totalCount, totalPrice, totalProfit, totalProfitPercentage });

            return list;
        } catch (err) {
            setAssetList([]);
            setAssetSummary(null);
        }
    };

    const fetchDetailedAssets = async (assetList) => {
        const promises = assetList.map(asset =>
            fetch(`http://${getIP()}:9093/deal/get_one_asset/${member_no}/${asset.coin_no}`, {
                headers: { Authorization: jwt }
            }).then(res => res.json())
        );
        const results = await Promise.all(promises);
        setDetailedAssetList(results);
    };



    // 전체 데이터 불러오기
    useEffect(() => {
        const loadAllData = async () => {
            setIsLoading(true);
            try {
                await fetchMember();
                await fetchNurung();
                const baseList = await fetchAssetData(); // 이건 실제 데이터 리턴 받음
                if (baseList.length > 0) {
                    await fetchDetailedAssets(baseList); // 해당 데이터로 API 호출 가능
                }
            } catch (err) {
                console.error('데이터 로딩 중 에러:', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (member_no) {
            loadAllData();
        }
    }, [member_no]);

    if (isLoading || !member) {
        return (
            <div className="p-8 text-center">
                <Spinner size={8} message="전체 자산 정보를 불러오는 중..." />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* 상단: 자산 요약 카드 2종 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <MyBalanceCard nurung={nurung} assetSummary={assetSummary} />
                <PieChartCard assetList={assetList} nurung={nurung} />
            </div>

            {/* 하단: 보유 코인 목록 */}
            <div>
                <div className="font-semibold mb-2 text-gray-700">📌 보유 중인 코인</div>
                {detailedAssetList.length === 0 ? (
                    <div className="text-gray-400 p-6">보유 중인 코인이 없습니다.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {detailedAssetList.map((asset) => (
                            <MyCoinCard key={asset.coin_no} asset={asset} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
