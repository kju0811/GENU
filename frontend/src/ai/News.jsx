import React from "react"
import { useState,useEffect } from "react";
import {getIP} from "../components/Tool"
import { Link } from 'react-router-dom';
import { Dropdown } from "../components/CoinComponents";
import { useGlobal } from "../components/GlobalContext";

function News() {
const [news,setNews] = useState([]);
const [summary,setSummary] = useState('');
const [cloading, setCloading] = useState(false);
const [sloading, setSLoading] = useState(false);
const [option1,setOption1] = useState('선택하지 않음');
const [option3,setOption3] = useState('');
const [dropdownOpen, setDropdownOpen] = useState(false);
const { option2,setOption2 } = useGlobal();

const jwt = sessionStorage.getItem('jwt');

  const NewsCreate = () => {
    if(option1 != '선택하지 않음') {
    setCloading(true);
    fetch(`http://${getIP()}:9093/news/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': jwt,
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
        console.log(response);
      })
      .catch((err) => console.error(err))
      .finally(() => setCloading(false));
    } else {
       alert('호/악재는 필수입니다')
    }
   };


    const Summary = (result) => {
    if (news[0].res != null) {
    setSLoading(true);
    fetch(`http://${getIP()}:9093/news/summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': jwt
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
    <div style={{marginRight:'60%',marginTop:'2%'}}>
      <h2>‼️기사 생성시‼️</h2>
      <span>1. 기사 생성시 이미지는 자동으로 만들어지며 아래에서 확인 할 수 있습니다.</span><br /> 
      <span>2. gpt가 기사와 이미지를 동시에 만들어 냅니다.<br />  시간이 1~2분이상 소요 될수 있습니다!!</span>
    </div>

    <div style={{marginTop:'-5%'}}>
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
        <Dropdown onSelect={cate => { setOption2(cate); setDropdownOpen(true); }}   />
       </div>
    </div>
    <div>
    <span>호/악재: {option1}</span> /&nbsp;
    <span>카테고리: {option2}</span><br />
    <textarea style={{width:"100%",height:'80%', border:'1px solid gray', borderRadius: '5px',resize:'none'}} placeholder="추가 사항" value={option3} onChange={(e) => setOption3(e.target.value)} ></textarea>
    </div><br />
    
    <div>
        <button className="btn btn-accent" onClick={() => NewsCreate(option1,option2,option3)}> 뉴스 생성하기 </button>
        {cloading && <span className="loading loading-bars loading-xl"></span>}
    </div>
    
    <span>뉴스 기사</span>
    <div style={{width:'70%', justifyContent: 'center', display: 'flex', height:'500px'}}>
      <textarea style={{width:'100%',height:'100%', padding: '10px', border:'1px solid gray', borderRadius: '5px',resize:'none'}} readOnly value={news[0]?.res} > </textarea>
    </div> <br />

    <div>
    <button onClick={() => Summary(news[0].res)} className="btn btn-accent">요약하기</button>
    {sloading && <span className="loading loading-bars loading-xl"></span>}
    </div>

    <span>요약본</span>
    <div style={{width:'70%', justifyContent: 'center', display: 'flex', height:'23%'}}>
      <textarea style={{width:'100%', padding: '10px', border:'1px solid gray', borderRadius: '5px',resize:'none'}} readOnly value={summary.res} ></textarea>
    </div><br />

    <div style={{height:'50%',textAlign:'center'}}>
    <span>생성된 이미지</span>
    <img src={news[1] != null ? (`http://${getIP()}:9093/home/storage/${news[1]}.jpg`) : ("https://cdn.startupful.io/img/app_logo/no_img2.png") } alt="Featured" 
    class="w-full h-full"></img>
    </div>
    </>
    
    );
}

export default News;