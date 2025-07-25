import React, { useEffect, useState } from "react";
import { getIP } from "../components/Tool";
import { Link, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Announce_read() {
    const [data,setData] = useState([]);
    const [update,setUpdate] = useState(false);
    const [title,setTitle] = useState('');
    const [content,setContent] = useState('');
    const [img, setImg] = useState(null);
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
        setImg(result.file);
        })
        .catch(err => console.error(err));
    };

    useEffect(() => {
    fetchAnnounce();
    }, [announce_no]);

    useEffect(() => {
        fetch(`http://${getIP()}:9093/announce/read/${announce_no}`, {
          method: 'GET'
        })
        .then(result => result.json()) // 응답
        .then(result => {
          setData(result);
          setTitle(result.announcetitle);
          setContent(result.announce_content);
        })
        .catch(err => console.error(err))
    },[]);

    const deleteAnnounce =()=>{
        const delcheck = window.confirm('공지사항을 삭제하시겠습니까?');
        if (delcheck && role == "ADMIN") {
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

    const formData = new FormData();
    formData.append(
    'announce',
    new Blob([JSON.stringify({
        announcetitle: title,
        announce_content: content
    })], { type: 'application/json' })
    );
    if (img) {
    formData.append('file', img);
    }

    const updateAnnounce =(title,content)=> {
        fetch(`http://${getIP()}:9093/announce/update/${announce_no}`, {
            method: 'PUT',
            headers: {
                'Authorization': jwt
            },
            body: formData
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
        { img && (
            <div style={{marginTop:'5%',width:'500px',alignItems:'center',display:'flex',justifyContent:'center'}}>
            <img src={`http://${getIP()}:9093/home/storage/${img}`} />
            </div>
        ) 
        }

        { update ? (
        <div style={{width:'50%'}}>
        <span>제목</span><br />
        <textarea value={title} style={{resize:'none', border:'1px solid gray', borderRadius: '5px',width:'100%',height:'80px'}} onChange={(e) => setTitle(e.target.value)}></textarea> <br />
        <span>본문</span><br />
        <textarea value={content} style={{resize:'none', border:'1px solid gray', borderRadius: '5px',width:'100%',height:'500px'}} onChange={(e) => setContent(e.target.value)}></textarea>
        </div>
        
        )
        :
        (
        <div style={{textAlign:'center',width:'50%',marginTop:'2%'}}>
        <h1 style={{marginBottom:'1px'}}>{title}</h1><span className="text-gray-500">{data.announcedate}</span><br/><br/>
        <span>{content}</span><br/>
        <button onClick={()=>history.back()} style={{marginTop:'30px',marginBottom:'20px'}}>이전으로</button>
        </div>
        )
        }

        {role === "ADMIN" && (
        <>
            {update ? (
            <div>
            <button onClick={() => updateAnnounce(title,content)}>수정하기</button>
            <button onClick={() => setUpdate(false)}>수정취소</button>
            <input
              type="file"
              accept="image/*"
              onChange={e => setImg(e.target.files[0])}
              className="w-full file:rounded-lg file:bg-indigo-50 file:border-0 file:py-2 file:px-4 file:text-indigo-600 file:cursor-pointer"
              required
            />
            {img && <p className="mt-2 text-sm text-green-600">{img.name} 선택됨</p>}
            </div>
            ) : (
            <div>
            <button onClick={() => deleteAnnounce()}>삭제하기</button>
            <button onClick={() => setUpdate(true)}>수정하기</button>
            </div>
            )}
        </>
        )}
        </>
    );

}
export default Announce_read;