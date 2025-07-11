import React, { createContext, useState, useEffect } from 'react';

// 전역 Context 생성
const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  // 초기값을 sessionStorage에서 가져오도록 함
  const [sw, setSw] = useState(() => sessionStorage.getItem('sw') === 'true');
  console.log("-> sessionStorage.getItem('sw'): " + sessionStorage.getItem('sw')); // null

  const [member_no, setMember_no] = useState(
    () => Number(sessionStorage.getItem('member_no') || 0)
  );

  console.log("-> sessionStorage.getItem('member_no'): " + sessionStorage.getItem('member_no')); // null
  console.log("-> sessionStorage.getItem('member_no') || 0: " + sessionStorage.getItem('member_no') || 0); // null
  console.log("-> Number(sessionStorage.getItem('member_no') || 0): " + Number(sessionStorage.getItem('member_no') || 0)); // 0


  // (기존) paging용 전역변수
  sessionStorage.setItem('nextIndex', 0);

  // sw 상태가 바뀔 때마다 sessionStorage에 저장
  useEffect(() => {
    sessionStorage.setItem('sw', sw ? 'true' : 'false');
  }, [sw]);

  // member_no 바뀔 때마다 sessionStorage에 저장/삭제
  useEffect(() => {
    if (member_no) {
      sessionStorage.setItem('member_no', member_no);
    } else {
      sessionStorage.removeItem('member_no');
    }}, [member_no]);

  return (
    <GlobalContext.Provider value={{ sw, setSw, member_no, setMember_no }}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalProvider };