import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../components/GlobalContext';
import { getIP } from '../components/Tool';

export default function Logout() {
  const { setSw } = useContext(GlobalContext);

//   const nav = useNavigate();

  const jwt = `${sessionStorage.getItem('jwt')}`; // Bearer + 공백 한칸 + Token
//   const jwt = `Bearer ${jwtToken.substring(6)}`; // Bearer + 공백 한칸 + Token
  console.log('jwt -> ', jwt);

  // Backend로 요청시마다 토큰을 보내야함.
  fetch(`http://${getIP()}:9093/member/logout`, {
    method: 'GET',
    headers: {'Authorization': jwt }, // 토큰을 보냄
  })
    .then((res) => res.json())
    .then((result) => {
      if (result.logout === true) {
        setSw(false);
        // // 로그아웃 시 sessionStorage에서 제거
        sessionStorage.removeItem('sw');
        sessionStorage.removeItem('jwt');
        nav('/');
      } else {
        alert('로그아웃에 실패했습니다.\n다시 시도해주세요.');
      }
    })
    .catch((err) => console.error(err));
  return (
    <>
  <h5 className="p-6 text-center">이용해 주셔서 감사합니다. 즐거운 하루 되세요~</h5>;
  </>
  );
}
