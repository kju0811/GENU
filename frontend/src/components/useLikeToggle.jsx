import { useState, useEffect } from "react";
import axios from "axios";
import { getIP } from '../components/Tool';
import { jwtDecode } from 'jwt-decode'; // named import 사용

export function useLikeToggle(coin_no) {
  const [liked, setLiked] = useState(false);
  const [memberNo, setMemberNo] = useState(null); // ✅ 상태로 멤버번호 저장

  // JWT 디코딩 및 member_no 추출
  useEffect(() => {
    const jwt = sessionStorage.getItem("jwt");
    if (jwt) {
      try {
        const decoded = jwtDecode(jwt);
        setMemberNo(decoded.member_no); // 상태에 저장
      } catch (err) {
        console.error("JWT 디코딩 실패:", err);
      }
    }
  }, []);

  // 좋아요 상태 요청
  useEffect(() => {
    if (!memberNo || !coin_no) return;

    const fetchLikeStatus = async () => {
      try {
        const res = await axios.get(`http://${getIP()}:9093/coinlike/isMemberCoinlike/${memberNo}/${coin_no}`);
        setLiked(res.data);
      } catch (err) {
        console.error("좋아요 상태 조회 실패:", err);
      }
    };

    fetchLikeStatus();
  }, [memberNo, coin_no]);

  // 좋아요 토글 함수
  const toggleLike = async () => {
    if (!memberNo || !coin_no) return;
    const jwt = sessionStorage.getItem("jwt");

    try {
      if (liked) {
        await axios.delete(`http://${getIP()}:9093/coinlike/deleteCoinlike/${memberNo}/${coin_no}`, {
          headers: {
            Authorization: jwt,
          }, 
        });
        setLiked(false);
      } else {
        await axios.post(`http://${getIP()}:9093/coinlike/create`, {
          member: { member_no: memberNo },
          coin: { coin_no },
        },
        {
          headers: {
            Authorization: jwt,
          }, 
        }
        );
        setLiked(true);
      }
    } catch (err) {
      console.error("좋아요 토글 실패:", err);
    }
  };

  return { liked, toggleLike };
}
