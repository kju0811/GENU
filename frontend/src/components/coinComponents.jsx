import React from "react";
import { useGlobal } from "./GlobalContext";
const Dropdown = ({ showNoneOption = false }) =>{
    const { setOption2 } = useGlobal();

    return(
        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm" style={{width:'120%'}}>

            {showNoneOption && (
                <li>
                    <a onClick={() => setOption2("선택하지 않음")} style={{textAlign: 'center', cursor: 'pointer'}}>선택하지 않음</a>
                </li>
            )}

            <li>
            <a onClick={() => setOption2('밈 코인')} style={{textAlign: 'center', cursor: 'pointer'}}>밈 코인</a>
            </li>

            <li>
            <a onClick={() => setOption2("ai코인")} style={{textAlign: 'center', cursor: 'pointer'}}>ai코인</a>
            </li>

            <li>
            <a onClick={() => setOption2("플랫폼코인")} style={{textAlign: 'center', cursor: 'pointer'}}>플랫폼 코인</a>
            </li>

            <li>
            <a onClick={() => setOption2("스테이블코인")} style={{textAlign: 'center', cursor: 'pointer'}}>스테이블 코인</a>
            </li>

        </ul>
    );
}

export {Dropdown};