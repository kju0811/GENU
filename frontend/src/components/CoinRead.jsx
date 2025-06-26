import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {getIP} from '../components/Tool';

function CoinRead() {
  console.log('-> CoinRead');
  const navigator = useNavigate(); // useNavigate Hook 사용, redirect 기능

  const [data, setData] = useState(null);

  const {coin_no} = useParams();

  useEffect(() => {
    fetch(`http://${getIP()}:9093/coin/${coin_no}`, {
      method: 'GET'
    })
    .then(result => result.json())
    .then(data => {
      console.log("date -> ", data)
      setData(data)
    })
    .catch(err => console.error(err))
  }, [coin_no])

  if (!data) { // 수신 데이터가 없으면 리턴 없음.
    return <div>Loading...</div>; 
  }

  const goBack = () => {
    navigator(-1); // 이전 페이지로 이동
  }


  return (
    <>
      <h4>{data.coin_name}</h4>
      <div>
        정보 : {data.coin_info}
      </div>
      <div>
        현재가 : {data.coin_price} 누렁 <br />{data.coin_percentage}%
        {/* {
          data.content.split('\n').map((line, index) => (
            // 특별한 태그를 사용하지 않고 출력 결과 그룹화 설정 필요시 사용, <> 
            <React.Fragment key={index}>
              {line}<br />
            </React.Fragment>
          ))
        } (조회수: {data.cnt})<br></br><br></br>
        <button onClick={goBack} className="btn btn-sm btn-primary"> 목록 </button>  */}
      </div>
    </>
  )
}

export default CoinRead;