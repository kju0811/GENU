import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import { getIP } from "./Tool";

function NotificationLog() {
  console.log('-> NotificationLog');
  const [data, setData] = useState(null);
  const jwt = sessionStorage.getItem("jwt");
  const { member_no } = useParams();

  useEffect(() => {
    fetch(`http://${getIP()}:9093/notification/find_by_MemberNotification/1`, {
      method: 'GET',
      headers : { 'Authorization' : jwt }
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
    <h1>알림 기록</h1>
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
                <Link to={`/notification/${item.notification_no}`}>
                  {/* <img src={imgUrl} alt={item.coin_name} width="50" height="50" style={{ marginRight: '10px' }} /> */}
                  {item.notification_no} | 제목 : {item.notification_nametype} | 내용 : {item.notification_text}
                </Link>
              </td>
            </tr>)
        }
        </tbody>
      </table>
    </>
  )
}

export default NotificationLog;