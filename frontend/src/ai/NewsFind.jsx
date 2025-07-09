import React from "react";
import { useState, useEffect } from "react";
import { getIP } from "../components/Tool";
import { Link, useSearchParams} from "react-router-dom";
import Pagination from 'react-js-pagination'
import '../index.css';


function NewsFind() {
  const [data,setData] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page")) || 1;
  const wording = searchParams.get("word") || "";
  const [page, setActivePage] = useState(pageParam);
  const [size,setSize] = useState(8);
  const [word,setWord] = useState('');

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    setSearchParams({ page: pageNumber });
  };

  const indexOfLastItem = page * size;
  const indexOfFirstItem = indexOfLastItem - size;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => { 
  const url = word
  ? `http://${getIP()}:9093/news/find?word=${encodeURIComponent(word)}` : `http://${getIP()}:9093/news/find_all`;
  
    fetch(url,{
      method:'GET'
    })
    .then(result => result.json()) // 응답
    .then(result => {
      setData(result);
      setSize(8);
      console.log(result);
    })
    .catch(err => console.error(err))
  }, [page, word]); 

  return(
    <>
    <Link to="/">메인 메뉴로</Link>
    <div style={{textAlign:"center"}}>
    <h5>뉴스 목록</h5> <input style={{border:'1px solid gray'}} value = {word}   onChange={(e) => {
    setWord(e.target.value);
    setSearchParams({ page: pageNumber, word: e.target.value });
  }}></input>
    </div>
  <div className="flex flex-wrap gap-4 justify-center">
    {currentItems.map((item) => (
      <div className="card card-dash bg-base-100 w-96 shadow-xl hover:scale-105 hover:shadow-lg" key={item.news_no}>
        <div className="card-body">
          <h2 className="card-title">{item.title}</h2>
          <p>
          {item.content.length > 70
            ? `${item.content.slice(0, 70)}...`
            : item.content}
          </p>
          
          <div className="card-actions justify-end">
            <span style={{marginTop:'15px', marginRight:'5px'}}>{item.newsrdate}</span>
           <Link to={`/ai/read/${item.news_no}`}> <button className="btn btn-primary">뉴스 보러가기</button> </Link>
          </div>
        </div>
      </div>
    ))}
  </div>

    <Pagination 
      innerClass="flex justify-center mt-4 gap-2"
      itemClass="page-item"
      linkClass="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-200 text-sm"
      activeClass="bg-blue-500 text-white border-blue-500 rounded-lg"
      activeLinkClass="bg-blue-500 text-white border-blue-500"
      activePage={page}
      itemsCountPerPage= {size}
      totalItemsCount={data.length}
      pageRangeDisplayed={5}
      onChange={handlePageChange}> 
    </Pagination>

    </>
  );
}

export default NewsFind;