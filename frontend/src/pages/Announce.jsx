import React from "react";

function Announce() {
    return(
        <>
            <h2> 공지사항 </h2>
            <div style={{textAlign:'center', width:'30%',height:'10%'}}>
                <span>제목</span><br/>
                <textarea style={{width:"100%",height:'80%', border:'1px solid gray', borderRadius: '5px'}}></textarea>
            </div><br/>
            <div style={{textAlign:'center', width:'30%',height:'40%'}}>
                <span>내용</span><br/>
                <textarea style={{width:"100%",height:'80%', border:'1px solid gray', borderRadius: '5px'}}></textarea>
            </div>
            <button className="btn btn-accent" >공지사항생성</button>
        </>
    );
}
export default Announce;