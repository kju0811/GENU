import React from "react";
import notfound from "../images/404.jpg"
import { useGlobal } from "../components/GlobalContext";
import { useEffect } from "react";

function NotFound() {
    const { setHideNavbar,setHideChatbot } = useGlobal();

    const back =()=> {
        history.back();
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
    <div style={{position:'relative',left:'25%',zIndex:'0',top:'30%',textAlign:'center'}}>
    <h1 style={{fontSize:'80px'}}>404 NotFound</h1>
    <h2>요청하신 페이지는 없는 페이지입니다</h2><br />
    <span onClick={() => back()} style={{cursor:'pointer',color:'blue',fontSize:'20px',fontWeight:'bold'}}>⬅ 되돌아가기</span>
    </div>

    <div style={{position: 'relative', right:'25%', width:'50%',marginTop:'-15%'}}>
    <img src={notfound} style={{width:'100%',height:'1000px'}}></img>
    </div>

    </>
    );
}
export default NotFound;