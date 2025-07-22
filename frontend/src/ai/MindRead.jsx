import React, { useState, useEffect } from 'react';
import { getIP } from '../components/Tool';
import { jwtDecode } from 'jwt-decode';
import { useParams } from 'react-router-dom';

function MindRead() {
    const {mindno} = useParams();
    const [data,setData] = useState([]);

    useEffect(()=>{
        fetch(`http://${getIP()}:9093/mind/read/${mindno}`,{
            method: 'GET'
        })
        .then(res=>res.json())
        .then(result => {
            setData(result)
            console.log("조회",result)
        })
    },[])

    return(
        <>
        <p>{data.mindcontent}</p>
        </>
    );
}
export default MindRead;