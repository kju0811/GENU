import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getIP } from "../components/Tool";

function NewsRead() {
    const [data,setData] = useState("");
    const {news_no} =  useParams();
useEffect(() => {

    fetch(`http://${getIP()}:9093/news/read/${news_no}`, { // Spring Boot JPA
      method: 'GET'
      // headers: {
      //   'Content-Type': 'application/json'
      // },
      // body: JSON.stringify({
      // })
    })
    .then(result => result.json()) // 응답
    .then(result => {
      // for (let item of result) { // Spring -> Js
      //   console.log('-> ', item.issueno, item.title, item.content, item.cnt, item.rdate);
      // }
      setData(result);
      console.log(result);
      // console.log("-> data[0]['issueno']:", data[0]['issueno'])
    })
    .catch(err => console.error(err))
  }, [news_no]); // []: news_no 변경시 실행

 return (
    <>
    <h2>{data.news_title}</h2><br />
    <span>{data.news_content}</span>
    </>
 );
}
export default NewsRead;