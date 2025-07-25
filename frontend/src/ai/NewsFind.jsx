import React, { useState, useEffect } from 'react';
import { getIP } from '../components/Tool';
import { Link, useSearchParams,useNavigate } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import load from "../images/로딩.gif";
import basic from "../images/profile.png"
import { jwtDecode } from 'jwt-decode';

export default function NewsFind() {
  const [data, setData] = useState([]);
  const [likedata, setLikedata] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get('page')) || 1;
  const wordParam = searchParams.get('word') || '';
  const navigate = useNavigate();
  const [page, setPage] = useState(pageParam);
  const [word, setWord] = useState(wordParam);
  const size = 6;
  const [loading,setLoading] = useState(false);
  const jwt = sessionStorage.getItem('jwt');
  let userInfo = null;
  if (jwt != null) {
    try {
      userInfo = jwtDecode(jwt);
    } catch (err) {
      console.error("JWT 디코딩 오류:", err);
    }
  } 

  useEffect(() => {
    fetch(`http://${getIP()}:9093/newslike/liked`, {
      method: 'GET'
    })
      .then(result => result.json()) // 응답
      .then(result => {
        setLikedata(result);
      })
      .catch(err => console.error(err))
  },[])

  useEffect(() => {
    if(word.trim() == '') {
      word === false
    }
    const url = word
      ? `http://${getIP()}:9093/news/find?word=${encodeURIComponent(word)}`
      : `http://${getIP()}:9093/news/find_all`;
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(result => { 
        setData(result)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
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
  // 페이지네이션 아이템 계산
  const indexOfLast = page * size;
  const indexOfFirst = indexOfLast - size;
  const currentItems = data.slice(indexOfFirst, indexOfLast);

  const cntup =(newsno)=> {
    fetch(`http://${getIP()}:9093/news/cnt/${newsno}`, {
      method: 'PATCH',
    })
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6" style={{marginTop:'2%'}}>
        <input
          type="search"
          placeholder="Search..."
          value={word}
          onChange={handleSearchChange}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Card Grid: MainContent 스타일 적용 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map(item => (
          <article
            key={item.newsno}
            className="rounded-xl overflow-hidden bg-gray-50 dark:bg-[#252731] transition-transform hover:scale-[1.02]"
          >
            <img
              src={item.file1 ? `http://${getIP()}:9093/home/storage/${item.file1}.jpg` : 'https://cdn.startupful.io/img/app_logo/no_img2.png'}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 rounded-full text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-500">
                  News
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  {item.newsrdate}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {item.content.length > 70
                  ? `${item.content.slice(0, 70)}...`
                  : item.content
                }
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={item.member.member_img ? `http://${getIP()}:9093/home/storage/${item.member.member_img}`: `${basic}`}
                    alt={item.member.member_name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm text-black dark:text-white">
                    {item.member.member_nick}
                  </span>
                </div>
                <div style={{width:'170px',position:'relative',left:'14%'}}>
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  ❤️ 좋아요 {likedata.filter(like => like.news.newsno === item.newsno).length}&nbsp;
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm" >
                  👁️ 조회수 {item.newscnt}
                </span>
                </div>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition" onClick={()=>{cntup(item.newsno); navigate(`/ai/read/${item.newsno}`);}}>
                    뉴스 보러가기
                  </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      
      {loading ? (
      <div>
        <img src={load}/><br />
        기사들 물어오는 중 ...
      </div>) : null
      } 

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
