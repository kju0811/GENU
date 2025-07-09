import React from "react";
import { useState, useEffect } from "react";
import { getIP } from "../components/Tool";
import { Link, useSearchParams} from "react-router-dom";
import Pagination from 'react-js-pagination'
import '../index.css';
import { useParams } from 'react-router-dom';


function DealList() {
  const [data,setData] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page")) || 1;
  const wording = searchParams.get("word") || "";
  const [page, setActivePage] = useState(pageParam);
  const [size,setSize] = useState(8);
  const [word,setWord] = useState('');

  const { member_no } = useParams();

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    setSearchParams({ page: pageNumber });
  };

  const indexOfLastItem = page * size;
  const indexOfFirstItem = indexOfLastItem - size;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => { 
  const url = word
  ? `http://${getIP()}:9093/deal/find_deal_by_member_search/${member_no}?word=${encodeURIComponent(word)}` : `http://${getIP()}:9093/deal/find_deal_by_member/${member_no}`;
  
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
        <h5>거래 내역</h5> <input style={{border:'1px solid gray'}} value = {word}   onChange={(e) => {
          setWord(e.target.value);
          setSearchParams({ page: pageNumber, word: e.target.value });
        }}></input>
      </div>

      <div className="flex flex-col gap-4 items-center">
        {currentItems.map((item) => (
          <div
            className="card card-dash bg-base-100 w-96 shadow-xl hover:scale-105 hover:shadow-lg"
            key={item.coin_no}
          >
            <div className="card-body">
              <h2 className="card-title">{item.coin_name}</h2>
              <p>
                {item.coin?.coin_name
                  ? item.coin.coin_name.length > 70
                    ? `${item.coin.coin_name.slice(0, 70)}...`
                    : item.coin.coin_name
                  : "코인 이름이 없습니다."}
              </p>
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

export default DealList;