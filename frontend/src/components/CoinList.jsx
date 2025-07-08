import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

import { getIP } from "./Tool";

function CoinList() {
  console.log('-> CoinList');
  const [data, setData] = useState(null);


  useEffect(() => {
    fetch(`http://${getIP()}:9093/coin/find_all`, {
      method: 'GET'
    })
    .then(result => result.json())
    .then(data => {
      console.log("date -> ", data)
      setData(data)
    })
    .catch(err => console.error(err))
  }, [])

  return (
    <>
    <Link to="/coin/create">코인 생성</Link>
    <table className='table_center table table-hover'>
        <tbody>
        {
          // item.issueno, item.title, item.content, item.cnt, item.rdate
          // data가 null이 아닐때만 map 함수 실행
          // data.map((item, index) => ...: item은 data 배열에 저장된 객체가 할당됨
          // index: 0~    
          data && data.map((item, index) =>
            <tr key={index}>
              <td style={{textAlign: 'left', height: '30px'}}>
                <Link to={`/coin/${item.coin_no}`}>
                  {/* <img src={imgUrl} alt={item.coin_name} width="50" height="50" style={{ marginRight: '10px' }} /> */}
                  <img
                    src={`http://${getIP()}:9093/home/storage/${item.coin_img}`}
                    alt="home"
                    style={{ maxWidth: '30%', height: 'auto', marginTop: '16px' }}
                  />
                  {item.coin_no} | {item.coin_name} | {item.coin_price.toLocaleString()}누렁 | {item.coin_percentage}%
                </Link>
              </td>
            </tr>)
        }
        </tbody>
      </table>
    </>
  )
}

export default CoinList;