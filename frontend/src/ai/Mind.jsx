import React, { useState,useEffect } from "react";
import { getIP } from '../components/Tool';
import { jwtDecode } from 'jwt-decode';

const mind =() => {
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
            console.log("거래",result)
        }) 
    }
    const name = dealinfo[0]?.member.member_nick
    const price = dealinfo.map(item => String(item.deal_price))
    const cnt = dealinfo.map(item => String(item.deal_cnt))
    const coin = dealinfo.map(item => item.coin.coin_name)
    const percent = dealinfo.map(item => String(item.coin.coin_percentage))

    const createmind =()=> {
        setCloading(true)
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
        })
        .finally(() => setCloading(false))
    }

    const [mindata,setMindata] = useState([]);
    useEffect(() => {
        fetch(`http://${getIP()}:9093/mind/find_all`, {
        method: 'GET',
        })
        .then(res =>res.json())
        .then(result => {
        setMindata(result)
        })
    },[])

    const load =()=> {
    return cloading && <span className="loading loading-bars loading-xl"></span>
    }   

    return {getDeal,createmind,mindata,load};
};

export default mind;