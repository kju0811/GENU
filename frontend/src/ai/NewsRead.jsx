import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getIP } from "../components/Tool";
import { jwtDecode } from "jwt-decode";

function NewsRead() {
    const [data,setData] = useState("");
    const {news_no} =  useParams();
    const jwt = sessionStorage.getItem('jwt');
    let userInfo = null;
    if (jwt != null) {
      try {
        userInfo = jwtDecode(jwt);
        console.log("토큰있음");
      } catch (err) {
        console.error("JWT 디코딩 오류:", err);
      }
    } else {
      console.log("토큰없음");
    }

useEffect(() => {
    fetch(`http://${getIP()}:9093/news/read/${news_no}`, {
      method: 'GET'
    })
    .then(result => result.json()) // 응답
    .then(result => {
      setData(result);
      console.log(result);
    })
    .catch(err => console.error(err))
  }, [news_no]);

const deleteNews = () => {
  if (window.confirm("뉴스를 삭제하시겠습니까?")){
  fetch(`http://${getIP()}:9093/news/delete/${news_no}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': jwt
    },
  })
  .then(response => {
    if (response.ok) {
      alert('뉴스가 성공적으로 삭제 되었습니다');
      const query = `?page=${page}${word ? `&word=${encodeURIComponent(word)}` : ''}`;
      window.location.href = `/ai/newsfind${query}`;
    } else {
      alert('삭제에 실패하였습니다');
    }
  })
}
}

 return (
    <>
    <img
    src={`http://${getIP()}:9093/home/storage/${data.file1}.jpg`}
    style={{width:'40%',height:'60%'}}
    ></img>
    <h2>{data.title}</h2><br />
    <span>{data.content}</span><br />
    <h2>기사 요약</h2>
    <span>{data.summary}</span>
    {userInfo?.role === 'ADMIN' && (
      <button onClick={deleteNews}>뉴스 삭제하기</button>
    )}
    </>
 );
}
export default NewsRead;