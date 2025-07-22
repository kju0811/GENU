import React, { useState, useEffect } from 'react';
import { getIP } from '../components/Tool';
import { jwtDecode } from 'jwt-decode';
import { useNavigate,useSearchParams } from 'react-router-dom';
import Pagination from 'react-js-pagination';

function Mindfind() {
    const [data,setData] = useState([]);
    const navigate = useNavigate();
    const jwt = sessionStorage.getItem('jwt');
    let userInfo = null;
    if (jwt != null) {
        try {
            userInfo = jwtDecode(jwt);
        } catch (err) {
            console.error("JWT 디코딩 오류:", err);
        }
    } 
    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = parseInt(searchParams.get('page')) || 1;
    const [page, setPage] = useState(pageParam);
    const size = 8;
    const member_no = userInfo?.member_no

    useEffect(() =>{
        fetch(`http://${getIP()}:9093/mind/find_all`, {
        method: 'GET',
      })
      .then(res =>res.json())
      .then(result => {
        setData(result)
        console.log("조회: ",result)
      })
    },[])
    const userno = data.find(item => item.member?.member_no == member_no);

    const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
    setSearchParams({ page: pageNumber });
  };

    // 페이지네이션 아이템 계산
  const indexOfLast = page * size;
  const indexOfFirst = indexOfLast - size;
  const currentItems = data.slice(indexOfFirst, indexOfLast);

    return (
        <>
        {jwt
            ? userno ? (
                <div className="flex flex-wrap justify-center gap-4">
                    {currentItems.map(item => (
                    <div className="card card-border w-96 bg-gray-50 dark:bg-[#252731] transition-transform hover:scale-[1.02]" style={{ marginTop: '3%' }}>
                        <div className="card-body">
                        <p>
                        {item.mindcontent}
                        </p>
                        <div className="card-actions justify-end">
                            <p>{item.minddate} 심리분석 결과</p>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                ) : (
                <span style={{ marginTop: '10%' }}>심리 분석 결과가 없습니다</span>
                )
            : (
                <span style={{ marginTop: '10%' }}>로그인 후 이용해주세요</span>
            )
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
export default Mindfind;