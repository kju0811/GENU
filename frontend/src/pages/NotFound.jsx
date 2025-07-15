import React from "react";
import notfound from "../images/404.jpg"
import { useGlobal } from "../components/GlobalContext";
import { useEffect } from "react";

function NotFound() {
    const { setHideNavbar } = useGlobal();

    useEffect(() => {
        // 404 페이지 진입 시 네비바 숨기기
        setHideNavbar(true);
        
        // 컴포넌트가 언마운트될 때 (다른 페이지로 이동할 때) 네비바 다시 보이기
        return () => {
        setHideNavbar(false);
        };
    }, [setHideNavbar]);

    return(
    <>
    <img src={notfound}></img>
    </>
    );
}
export default NotFound;