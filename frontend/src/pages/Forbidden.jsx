import React from "react";
import { useGlobal } from "../components/GlobalContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import forbidden from "../images/403.jpg";

function Forbidden() {
    const { setHideNavbar,setHideChatbot } = useGlobal();
    const navigate = useNavigate();
    const back =()=> {
        navigate("/")
    }

    useEffect(() => {
        // 404 페이지 진입 시 네비바 숨기기
        setHideNavbar(true);
        setHideChatbot(true);
        
        // 컴포넌트가 언마운트될 때 (다른 페이지로 이동할 때) 네비바 다시 보이기
        return () => {
        setHideNavbar(false);
        setHideChatbot(false);
        };
    }, [setHideNavbar]);

    return(
        <>
        <h1 style={{marginTop:'2%'}}>403 ForBidden</h1>
        <h2>잘못된 접근입니다</h2>
        <img style={{height:'700px'}} src={forbidden} />
        <span onClick={() => back()} style={{cursor:'pointer',color:'blue',fontSize:'20px',fontWeight:'bold'}}>⬅ 되돌아가기</span>
        </>
    );
}
export default Forbidden;