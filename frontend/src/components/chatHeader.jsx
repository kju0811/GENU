import React from "react";
import { useGlobal } from "./GlobalContext";

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

export default chatHeader;