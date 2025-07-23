import React, { useState,useEffect } from "react";
import { getIP } from '../components/Tool';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";

const mind =() => {
    const navigate = useNavigate();
    const [dealinfo,setDealinfo] = useState([]);
    const [cloading, setCloading] = useState(false);
    const jwt = sessionStorage.getItem('jwt');
    let userInfo = null;
    if (jwt != null) {
        try {
            userInfo = jwtDecode(jwt);
        } catch (err) {
            console.error("JWT 디코딩 오류:", err);
        }
    } 
    const member_no = userInfo?.member_no
    const getDeal =()=>{
        fetch(`http://${getIP()}:9093/deal/find_deal_by_member_coin_twoweek/${member_no}`,{
            method:'GET'
        })
        .then(res => res.json())
        .then(result => {
            setDealinfo(result)
        }) 
    }
    const name = dealinfo[0]?.member.member_nick
    const price = dealinfo.map(item => String(item.deal_price))
    const cnt = dealinfo.map(item => String(item.deal_cnt))
    const coin = dealinfo.map(item => item.coin.coin_name)
    const percent = dealinfo.map(item => String(item.coin.coin_percentage))
    const [mindata,setMindata] = useState([]);
    const userno = mindata.filter(item => item.member?.member_no === member_no);

    const createmind =()=> {
        setCloading(true)
        if (userno.length >= 3) {
        fetch(`http://${getIP()}:9093/mind/create`,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt
            },
            body: JSON.stringify({ 
                "name": name,
                "price": price,
                "cnt": cnt,
                "coin": coin,
                "percent": percent
            }),
        }).
        then(() => {
            return fetch(`http://${getIP()}:9093/mind/find_all`);
        })
        .then(res => res.json())
        .then(result => {
            setMindata(result);
            console.log(result)
        })
        .finally(() => setCloading(false))
     } else {
        alert("거래기록이 3회이상일때부터 가능합니다")
        setCloading(false)
     }
    }
    useEffect(() => {
        fetch(`http://${getIP()}:9093/mind/find_all`, {
        method: 'GET',
        })
        .then(res =>res.json())
        .then(result => {
            setMindata(result);
        })
    },[])

    const load =()=> {
    return cloading && <span className="loading loading-bars loading-xl"></span>
    }   

    const list =()=>{
    return <span style={{marginTop:'-1.5%',cursor:'pointer',width:'10%'}} onClick={()=>navigate('/mindfind')}>이전 분석 보러가기 ➡️</span>
    }

    const info =()=> {
        return <span style={{marginTop:'2%',textAlign:'center'}}>
                <h2>‼️주의사항‼️</h2>
                AI는 아래 등급표를 기준으로 분석을 하며 매우 주관적이며 틀릴 수 있습니다 참고용으로만 즐겁게 봐주세요😊<br /><br />
                S등급<br />
            초공격형<br />
            극도의 수익을 추구하며, 큰 손실도 감수할 수 있는 성향.
            •	한 번에 총 보유금액의 70% 이상을 특정 시점에 집중 매수
            •	하락장에서도 매수 강행, 급등 직후 추격 매수 패턴 존재 <br /><br />
            
            A등급<br />
            공격형<br />
            수익을 중시하며, 일정 수준의 손실을 감내할 수 있는 성향.
            •	보유 자금 중 40~70%를 단기 타이밍에 투입
            •	상대적으로 높은 가격에서도 매수 <br /><br />
            
            B등급<br />
            적극형<br />
            수익과 안정성 사이에서 균형을 추구하는 성향.
            •	총 자금의 20~40% 정도를 나눠 매수
            •	코인당 수량과 매수 타이밍에 일정한 간격 존재
            •	급락 시 소폭 추가 매수, 급등 시 관망 <br /><br />
            
            C등급<br />
            안정추구형<br />
            안정적인 수익을 선호하고, 리스크에 민감한 성향.
            •	10~20% 이내 소액 분산 매수, 평균 단가 낮추기 위주
	        •	평균 매수가는 시세보다 낮은 경향, 리스크 감지 시 즉시 멈춤<br /><br />
            
            D등급<br />
            보수형<br />
            원금 손실을 극도로 회피하며, 리스크 회피 성향이 강함.
            •	대부분 관망 상태, 투자 금액 매우 적음(5% 이하)
            •	매수 횟수 적고, 하락 시 절대 매수 없음
            •	오히려 단기 수익 후 바로 매도, 시장 불신</span>
    }

    return {getDeal,createmind,mindata,load,list,info};
};

export default mind;