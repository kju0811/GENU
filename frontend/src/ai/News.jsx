import React from "react"
import { useState,useEffect } from "react";
import {getIP} from "../components/Tool"

function News() {
const [news,setNews] = useState('');
const [summary,setSummary] = useState('');

  const NewsCreate = (reading) => {
    fetch(`http://${getIP()}:9093/news/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reading }),
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
      .catch((err) => console.error(err));
   };

    const Summary = (result) => {
    if (news.res != null) {
    fetch(`http://${getIP()}:9093/news/summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({result}),
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
      .catch((err) => console.error(err));
    } else {
        alert("뉴스를 먼저 생성해주세요")
    }
   };

    return (
    <>
    <div>
    <button onClick={() => NewsCreate("호재 뉴스")}  className="btn btn-accent">호재 뉴스</button>
    <button onClick={() => NewsCreate("악재 뉴스")} className="btn btn-accent">악재 뉴스</button>
    </div> <br />

    <span>뉴스 기사</span>
    <div style={{width:'70%', justifyContent: 'center', display: 'flex', height:'23%'}}>
      <textarea style={{width:'100%', padding: '10px'}} readOnly value={news.res} ></textarea>
    </div> <br />

    <button onClick={() => Summary(news.res)} className="btn btn-accent">요약하기</button><br />

    <span>요약본</span> 
    <div style={{width:'70%', justifyContent: 'center', display: 'flex', height:'23%'}}>
      <textarea style={{width:'100%', padding: '10px'}} readOnly value={summary.res} ></textarea>
    </div>
    </>
    
    );
}

export default News;