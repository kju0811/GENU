const getIP = () => {
  return "localhost";
  // return "192.168.2.190";
}

const getNowDate = () => {
      // 현재 날짜와 시간을 가져옵니다.
    const now = new Date();

    // 날짜와 시간을 "YYYY-MM-DD HH:mm:ss" 형식으로 변환합니다.
    const rdate = now.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\./g, '-').replace(/- /g, '-').replace(/ /, ' ').trim().slice(0, -1);

    return rdate.replace(/-([0-9]{2}:)/, ' $1'); // 2024-11-06 16:29:5
}

// 포커스 이동
function enter_chk(event, nextTag){
  if(event.keyCode === 13){ // 엔터키
    document.getElementById(nextTag).focus();
  }
}

export { getIP, getNowDate, enter_chk };