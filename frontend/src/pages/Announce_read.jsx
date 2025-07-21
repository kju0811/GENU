import React, { useState, useEffect } from "react";
import { getIP } from "../components/Tool";
import Pagination from 'react-js-pagination';
import { Link, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Announce_read() {
      const [data,setData] = useState([]);
      const [searchParams, setSearchParams] = useSearchParams();
      const pageParam = parseInt(searchParams.get('page')) || 1;
      const wordParam = searchParams.get('word') || '';
      const [page, setPage] = useState(pageParam);
      const [word, setWord] = useState(wordParam);
      const size = 20;

      const jwt  = sessionStorage.getItem('jwt');
          let userInfo = null;
          if (jwt != null) {
              try {
              userInfo = jwtDecode(jwt);
              } catch (err) {
              console.error("JWT 디코딩 오류:", err);
              }
          } 
    
      const indexOfLastItem = page * size;
      const indexOfFirstItem = indexOfLastItem - size;
      const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

     useEffect(() => { 
      const url = word
            ? `http://${getIP()}:9093/announce/find?word=${encodeURIComponent(word)}`
            : `http://${getIP()}:9093/announce/find_all`;
        fetch(url, {
          method: 'GET'
        })
        .then(result => result.json()) // 응답
        .then(result => {
          setData(result);
          console.log(result);
        })
        .catch(err => console.error(err))
      }, [word]); 

      const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
        setSearchParams(word ? { page: pageNumber, word } : { page: pageNumber });
      };

      const handleSearchChange = (e) => {
        const newWord = e.target.value;
        setWord(newWord);
        setPage(1);
        setSearchParams(newWord ? { page: 1, word: newWord } : { page: 1 });
      };

    return(
        <>
        {userInfo?.role == "ADMIN" && (
              <Link to="/announce" className="text-indigo-600 hover:underline">공지사항 생성하기</Link>
        )}

        <h2> 공지사항 </h2>

        <div className="flex justify-between items-center mb-6" style={{marginTop:'2%'}}>
        <input
          type="search"
          placeholder="Search..."
          value={word}
          onChange={handleSearchChange}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        </div>

            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100" style={{width:'60%'}}>
              <table className="table">
                <thead>
                  <tr>
                    <th>제목</th>
                    <th>내용</th>
                    <th>등록일 </th>
                  </tr>
                </thead>
                <tbody>
                {currentItems.map((item) => (
                  <tr key={item.announce_no}>
                    <th style={{width:'20%'}}>{item.announcetitle}</th>
                    <td style={{width:'50%'}}> 
                    {item.announce_content.length > 70
                        ? `${item.announce_content.slice(0, 70)}...`
                        : item.announce_content}
                    </td>
                    <td style={{width:'15%'}}>{item.announcedate}</td>
                  </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-8 py-5 flex justify-center gap-2">
              <Pagination
                innerClass="flex justify-center mt-4 gap-2"
                itemClass="rounded-lg"
                linkClass="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-200 text-sm rounded-lg"
                activeClass="bg-sky-500 text-white border-sky-500 rounded-lg"
                activePage={page}
                itemsCountPerPage={size}
                totalItemsCount={data.length}
                pageRangeDisplayed={5}
                onChange={handlePageChange}
              />
            </div>
        </>
    );
}
export default Announce_read;