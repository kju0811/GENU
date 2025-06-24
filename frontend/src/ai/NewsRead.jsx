import React from "react";
import { useState, useEffect } from "react";
import { getIP } from "../components/Tool";
import { Link } from "react-router-dom";
import Pagination from 'react-js-pagination'
import '../index.css';


function NewsRead() {
  const [data,setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 8;

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => { 
    fetch(`http://${getIP()}:9093/news/read`, { // Spring Boot JPA
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
  }, []); // []: 최초 1회만 렌더링 실행

  return(
    <>
    <Link to="/">메인 메뉴로</Link>
    <h5>뉴스 목록</h5> 
  <div className="flex flex-wrap gap-4 justify-center">
    {currentItems.map((item) => (
      <div className="card card-dash bg-base-100 w-96 shadow-xl" key={item.news_no}>
        <div className="card-body">
          <h2 className="card-title">{item.news_title}</h2>
          <p>
          {item.news_content.length > 70
            ? `${item.news_content.slice(0, 70)}...`
            : item.news_content}
          </p>
          <div className="card-actions justify-end">
           <Link to={`/news/${item.news_no}`}> <button className="btn btn-primary">뉴스 보러가기</button> </Link>
          </div>
        </div>
      </div>
    ))}
  </div>

    <Pagination 
      innerClass="flex justify-center mt-4 gap-2"
      itemClass="page-item"
      linkClass="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-200 text-sm"
      activeClass="bg-blue-500 text-white border-blue-500"
      activePage={activePage}
      itemsCountPerPage={itemsPerPage}
      totalItemsCount={data.length}
      pageRangeDisplayed={5}
      onChange={handlePageChange}> 
    </Pagination>

    </>
  );
}

export default NewsRead;