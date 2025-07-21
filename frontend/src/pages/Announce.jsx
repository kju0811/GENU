import React, { useState } from "react";
import { getIP } from "../components/Tool";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';


function Announce() {

    const jwt  = sessionStorage.getItem('jwt');
    let userInfo = null;
    if (jwt != null) {
        try {
        userInfo = jwtDecode(jwt);
        } catch (err) {
        console.error("JWT 디코딩 오류:", err);
        }
    } 
    const [title,setTitle] = useState('');
    const [content,setContent] = useState('');
    const navigate = useNavigate();
    const [img, setImg] = useState(null);

    const member_no = userInfo?.member_no
    const role = userInfo?.role

   const formData = new FormData();
    formData.append(
    'announce',
    new Blob([JSON.stringify({
        announcetitle: title,
        announce_content: content,
        member: {
        member_no: member_no
        }
    })], { type: 'application/json' })
    );
    if (img) {
    formData.append('file', img);
    }

    const create =()=> {
        if (title.trim() != '' && content.trim() != '') {
        fetch(`http://${getIP()}:9093/announce/create`, {
            method: 'POST',
            headers: {
                'Authorization': jwt
            },
            body: formData
            })
            .then((response) => {
                if (response.ok) {
                alert("공지사항이 생성되었습니다");
                navigate('/announce_find');
                } else {
                alert("공지사항 생성에 실패하였습니다");
                }
                return response.json();
            })
        } else if(role != "ADMIN") {
            alert("정상적이지 않은 토큰입니다")
        } else {
            alert("제목과 내용을 입력해주세요")
        }
    }

    return(
        <>
            <h2> 공지사항 </h2>
            <div style={{textAlign:'center', width:'30%',height:'10%'}}>
                <span>제목</span><br/>
                <textarea style={{width:"100%",height:'80%', border:'1px solid gray', borderRadius: '5px',resize:'none'}} value={title} onChange={(e) => setTitle(e.target.value)} ></textarea>
            </div><br/>
            <div style={{textAlign:'center', width:'30%',height:'40%'}}>
                <span>내용</span><br/>
                <textarea style={{width:"100%",height:'80%', border:'1px solid gray', borderRadius: '5px',resize:'none'}} value={content} onChange={(e) => setContent(e.target.value)} ></textarea>
            </div>
            <div>
            <input
              type="file"
              accept="image/*"
              onChange={e => setImg(e.target.files[0])}
              className="mt-1"
              required
            />
            {img && <p className="mt-2 text-sm text-green-600">{img.name} 선택됨</p>}
          </div>
            <button className="btn btn-accent" onClick={() => create(title,content)} >공지사항생성</button>
        </>
    );
}
export default Announce;