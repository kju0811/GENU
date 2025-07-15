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
  const [word,setWord] = useState(wording);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    // 검색어가 있으면 word도 함께 유지
    if (word) {
      setSearchParams({ page: pageNumber, word: word });
    } else {
      setSearchParams({ page: pageNumber });
    }
  };

  const indexOfLastItem = page * size;
  const indexOfFirstItem = indexOfLastItem - size;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
   const url = word
  ? `http://${getIP()}:9093/news/find?word=${encodeURIComponent(word)}`
  : `http://${getIP()}:9093/news/find_all`;
       
    fetch(url,{
      method:'GET'
    })
    .then(result => result.json())
    .then(result => {
      setData(result);
      setSize(8);
      console.log(result);
    })
    .catch(err => console.error(err))
  }, [page, word]);

  const handleSearchChange = (e) => {
    const newWord = e.target.value;
    setWord(newWord);
    setActivePage(1); 
    
    if (newWord) {
      setSearchParams({ page: 1, word: newWord });
    } else {
      setSearchParams({ page: 1 });
    }
  };

  return(
    <>
    <Link to="/">메인 메뉴로</Link>
    
    <div style={{marginLeft:'80%',width:'13%'}}>
    <label className="input flex items-center gap-2 bg-white shadow-md border border-gray-300" style={{width:'100%'}}>
      <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2.8"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </g>
      </svg>
      <input 
        type="search" 
        required 
        placeholder="Search..." 
        value={word}
        onChange={handleSearchChange}
      />
    </label>
    </div>
    
    <div style={{textAlign:"center",marginTop:'-2.5%'}}>
    <h5>뉴스 목록</h5>
    </div>
  <div className="flex flex-wrap gap-4 justify-center" style={{marginTop:'3%'}}>
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
      itemsCountPerPage={size}
      totalItemsCount={data.length}
      pageRangeDisplayed={5}
      onChange={handlePageChange}>
     </Pagination>
    
     </>
  );
}

export default NewsFind;