import React from "react";
import { useGlobal } from "./GlobalContext";
import imgsrc from "../images/send.png"
import botimg from "../images/genu.png"
import chatopen from "../images/genu.png";

const chatHeader = () => {
  const { close, setClose } = useGlobal();

  return (
    <div className="myheader" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px'}}>
      💬 GENU 챗봇
      <span
        style={{ color: "white", cursor: "pointer", fontWeight: "bold", fontSize: "20px"}}
        onClick={() => setClose(true)}
      >
        x
      </span>
    </div>
  );
};

const chatButton = () => {
    return(
    <button><img src={imgsrc} alt="send button"/></button>
    );
}

const botImg = () => {
  return(
    <>
    <img src={botimg} className="botimg"/>
    </>
  );
}

const ChatOpen = () => {
  const { close, setClose } = useGlobal();
  return(
    <>
    <div onClick={() => setClose(false)} style={{cursor:'pointer'}}>
    <img src={chatopen} style={{ width:'6%',height:'10%', position:'fixed',right:'2%',bottom:'3%'}}/>
    <span style={{ position:'fixed',right:'1%',bottom:'13%'}}>AI 챗봇 NURUNG2입니다</span>
    </div>
    </>
  );
}

export { chatHeader, chatButton, botImg, ChatOpen };