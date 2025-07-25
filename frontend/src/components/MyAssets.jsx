import React, { useEffect, useState } from "react";
import axios from "axios";
import { getIP } from "./Tool";

function MyAssets ({ member_no }) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!member_no) return;

    setLoading(true);
    setError(null);

    const fetchMyAssets = async() => {
      try {
        const res = await axios.get(`http://${getIP()}:9093/deal/get_member_asset/${member_no}`)
        setAssets(res.data);

      } catch (err) {
        console.error("내 자산 조회 실패:", err);
        setError(err.message || "알 수 없는 에러가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyAssets();
  }, [member_no]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p style={{ color: "red" }}>에러: {error}</p>;
  if (assets.length === 0) return <p>보유한 자산이 없습니다.</p>;

  return (
    <div>
      <h2>내 자산 목록</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>코인 이름</th>
            <th>코인 이미지</th>
            <th>수량</th>
            <th>총 가격(원)</th>
            <th>이익 금액(원)</th>
            <th>이익률(%)</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.coin_no}>
              <td>{asset.coin_name}</td>
              <td>
                <img 
                  src={asset.coin_img} 
                  alt={`coin-${asset.coin_no}`} 
                  width="40" 
                  height="40" 
                  onError={(e) => { e.target.src = "/public/nurung.png"; }} 
                />
              </td>
              <td>{asset.cnt}</td>
              <td>{asset.total_price.toLocaleString()}</td>
              <td style={{ color: asset.profitAmount >= 0 ? "green" : "red" }}>
                {asset.profitAmount.toLocaleString()}
              </td>
              <td style={{ color: asset.profitPercentage >= 0 ? "green" : "red" }}>
                {asset.profitPercentage.toFixed(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyAssets;
