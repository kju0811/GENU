import React, { useEffect, useState } from "react";
import { getIP } from "../components/Tool";
import { Link, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Announce_read() {
    const [data,setData] = useState([]);
    const [update,setUpdate] = useState(false);
    const [title,setTitle] = useState('');
    const [content,setContent] = useState('');
    const { announce_no } = useParams();
    const jwt = sessionStorage.getItem('jwt');
    let userInfo = null;
    if (jwt != null) {
        try {
        userInfo = jwtDecode(jwt);
        } catch (err) {
        console.error("JWT 디코딩 오류:", err);
        }
    }

    const role = userInfo?.role;

    const fetchAnnounce = () => {
    fetch(`http://${getIP()}:9093/announce/read/${announce_no}`)
        .then(res => res.json())
        .then(result => {
        setData(result);
        setTitle(result.announcetitle);
        setContent(result.announce_content);
        })
        .catch(err => console.error(err));
    };

    useEffect(() => {
    fetchAnnounce();
    }, [announce_no]);

    useEffect(() => {
        console.log("번호:",announce_no);
        fetch(`http://${getIP()}:9093/announce/read/${announce_no}`, {
          method: 'GET'
        })
        .then(result => result.json()) // 응답
        .then(result => {
          setData(result);
          setTitle(result.announcetitle);
          setContent(result.announce_content);
          console.log(result);
        })
        .catch(err => console.error(err))
    },[]);

    const deleteAnnounce =()=>{
        const delcheck = window.confirm('공지사항을 삭제하시겠습니까?');
        if (delcheck && jwt == "ADMIN") {
        fetch(`http://${getIP()}:9093/announce/delete/${announce_no}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt
            },
         })
         .then(response => {
            if(response.ok){
                alert("공지사항을 삭제했습니다")
                history.back()
            } else{
                alert("삭제에 실패하였습니다")
            }
         })
        }
    }

    const updateAnnounce =(title,content)=> {
        fetch(`http://${getIP()}:9093/announce/update/${announce_no}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt
            },
            body: JSON.stringify({
                "announcetitle" :title,
                "announce_content":content
            })
            })
            .then(response => {
            if(response.ok){
                alert("공지사항을 수정했습니다")
                setUpdate(false)
                fetchAnnounce()
            } else{
                alert("수정에 실패하였습니다")
            }
            })
    }

    return (
        <>
        { update ? (
        <div>
        <span>제목</span>
        <textarea value={title} style={{resize:'none',marginTop:"15%", border:'1px solid gray', borderRadius: '5px'}} onChange={(e) => setTitle(e.target.value)}></textarea> <br />
        <span>본문</span>
        <textarea value={content} style={{resize:'none', border:'1px solid gray', borderRadius: '5px'}} onChange={(e) => setContent(e.target.value)}></textarea>
        </div>
        
        )
        :
        (
        <div>
        <h1>{data.announcetitle}</h1>
        <span>{data.announce_content}</span><br/>
        <button onClick={()=>history.back()}>이전으로</button>
        </div>
        )
        }

        {role === "ADMIN" && (
        <>
            {update ? (
            <div>
            <button onClick={() => updateAnnounce(title,content)}>수정하기</button>
            <button onClick={() => setUpdate(false)}>수정취소</button>
            </div>
            ) : (
            <div>
            <button onClick={deleteAnnounce}>삭제하기</button>
            <button onClick={() => setUpdate(true)}>수정하기</button>
            </div>
            )}
        </>
        )}
        </>
    );

}
export default Announce_read;