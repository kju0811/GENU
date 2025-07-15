import React, { createContext, useState, useEffect, useContext } from 'react';

// 전역 Context 생성
const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  // 모달 닫힘 상태
  const [close, setClose] = useState(true);

  const [option2,setOption2] = useState('선택하지 않음');

  // sessionStorage에서 sw 값을 가져와 초기화
  const [sw, setSw] = useState(() => sessionStorage.getItem('sw') === 'true');

  // sessionStorage에서 member_no 값을 가져와 초기화
  const [member_no, setMember_no] = useState(
    () => Number(sessionStorage.getItem('member_no') || 0)
  );

  const [hideNavbar,setHideNavbar] = useState(false);
  const [hideChatbot,setHideChatbot] = useState(false);

  // 초기 paging 인덱스 설정 (한 번만 실행)
  useEffect(() => {
    sessionStorage.setItem('nextIndex', '0');
  }, []);

  // sw 상태가 변경될 때마다 sessionStorage에 저장
  useEffect(() => {
    sessionStorage.setItem('sw', sw ? 'true' : 'false');
  }, [sw]);

  // member_no 상태가 변경될 때마다 sessionStorage에 저장 또는 삭제
  useEffect(() => {
    if (member_no) {
      sessionStorage.setItem('member_no', member_no.toString());
    } else {
      sessionStorage.removeItem('member_no');
    }
  }, [member_no]);

  return (
    <GlobalContext.Provider value={{ sw, setSw, member_no, setMember_no, close, setClose , option2, setOption2, hideNavbar, setHideNavbar, hideChatbot,setHideChatbot}}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);