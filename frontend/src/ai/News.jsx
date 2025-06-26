import React from "react"
import { useState,useEffect } from "react";
import {getIP} from "../components/Tool"
import { Link } from 'react-router-dom';

function News() {
const [news,setNews] = useState('');
const [summary,setSummary] = useState('');
const [cloading, setCloading] = useState(false);
const [sloading, setSLoading] = useState(false);
const [option1,setOption1] = useState('선택되지 않음');
const [option2,setOption2] = useState('선택되지 않음');
const [option3,setOption3] = useState('');

  const NewsCreate = () => {
    if(option1 != '선택되지 않음') {
    setCloading(true);
    fetch(`http://${getIP()}:9093/news/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ option1,option2,option3 }),
    })
    .then((response) => {
        if (!response.ok) {
          alert("뉴스 생성에 실패하였습니다");
        }
        return response.json();
      })
    .then((response) => {
        setNews(response);
      })
      .catch((err) => console.error(err))
      .finally(() => setCloading(false));
    } else {
       alert('호/악재는 필수입니다')
    }
   };


    const Summary = (result) => {
    if (news.res != null) {
    setSLoading(true);
    fetch(`http://${getIP()}:9093/news/summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ result }),
    })
    .then((response) => {
        if (!response.ok) {
          alert("요약에 실패하였습니다");
        }
        return response.json();
      })
    .then((response) => {
        setSummary(response);
      })
      .catch((err) => console.error(err))
      .finally(() => setSLoading(false));
    } else {
        alert("뉴스를 먼저 생성해주세요")
    }
   };

   useEffect(() => {
    option1,
    option2
   }) 

    return (
    <>
    <Link to="/">메인 메뉴로</Link>
    <Link to="/ai/newsfind">기사 보러가기</Link>

    <div>
      <div className="dropdown dropdown-start" style={{margin:'5px'}}>
        <div tabIndex={0} role="button" className="btn btn-accent">호/악재 생성</div> 
        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm" style={{width:'120%'}}>
            <li>
            <a onClick={() => setOption1("호재 뉴스")} style={{textAlign: 'center', cursor: 'pointer'}}>호재 뉴스</a>
            </li>
            <li>
            <a onClick={() => setOption1("악재 뉴스")} style={{textAlign: 'center', cursor: 'pointer'}}>악재 뉴스</a>
            </li>
        </ul>
       </div>

      <div className="dropdown dropdown-start">
        <div tabIndex={0} role="button" className="btn btn-accent">카테고리 생성</div> 
        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm" style={{width:'120%'}}>
            <li>
            <a onClick={() => setOption2("선택하지 않음")} style={{textAlign: 'center', cursor: 'pointer'}}>선택하지 않음</a>
            </li>

            <li>
            <a onClick={() => setOption2("밈코인")} style={{textAlign: 'center', cursor: 'pointer'}}>밈코인</a>
            </li>

            <li>
            <a onClick={() => setOption2("ai코인")} style={{textAlign: 'center', cursor: 'pointer'}}>ai코인</a>
            </li>

            <li>
            <a onClick={() => setOption2("플랫폼코인")} style={{textAlign: 'center', cursor: 'pointer'}}>플랫폼 코인</a>
            </li>

            <li>
            <a onClick={() => setOption2("스테이블코인")} style={{textAlign: 'center', cursor: 'pointer'}}>스테이블 코인</a>
            </li>

        </ul>
       </div>
    </div>
    <div>
    <span>호/악재: {option1}</span> /&nbsp;
    <span>카테고리: {option2}</span><br />
    <textarea style={{width:"100%",height:'80%'}} placeholder="추가 사항" value={option3} onChange={(e) => setOption3(e.target.value)} ></textarea>
    </div><br />
    
    <div>
        <button className="btn btn-accent" onClick={() => NewsCreate(option1,option2,option3)}> 뉴스 생성하기 </button>
        {cloading && <span className="loading loading-bars loading-xl"></span>}
    </div>
    
    <span>뉴스 기사</span>
    <div style={{width:'70%', justifyContent: 'center', display: 'flex', height:'23%'}}>
      <textarea style={{width:'100%', padding: '10px'}} readOnly value={news.res} > </textarea>
    </div> <br />

    <div>
    <button onClick={() => Summary(news.res)} className="btn btn-accent">요약하기</button>
    {sloading && <span className="loading loading-bars loading-xl"></span>}
    </div>

    <span>요약본</span>
    <div style={{width:'70%', justifyContent: 'center', display: 'flex', height:'23%'}}>
      <textarea style={{width:'100%', padding: '10px'}} readOnly value={summary.res} ></textarea>
    </div>
    </>
    
    );
}

export default News;