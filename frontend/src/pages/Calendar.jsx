import React, { useState, useRef, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getIP } from '../components/Tool';
import { Link } from 'react-router-dom';
import 'moment/locale/ko';
import { jwtDecode } from 'jwt-decode';

moment.locale('ko');
const localizer = momentLocalizer(moment);

function Schedule() {
  const calendarRef = useRef(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [updateEventTitle, setUpdateEventTitle] = useState('');
  const [newEventBody, setNewEventBody] = useState('');
  const [events, setEvents] = useState([]);

  const jwt = sessionStorage.getItem("jwt");
  let userInfo = null;
    if (jwt != null) {
      try {
        userInfo = jwtDecode(jwt);
        console.log("토큰있음");
      } catch (err) {
        console.error("JWT 디코딩 오류:", err);
      }
    } else {
      console.log("토큰없음");
    }

  const member_no = userInfo?.member_no
  const formats = {
    monthHeaderFormat: 'YYYY년 MM월',
    dayFormat: 'MM월 DD일',
    dateFormat:'D일'
  }

  const handleMouseMove = (e) => {
    window.lastMousePosition = {
      x: e.clientX,
      y: e.clientY
    };
  };

  const handleSelectSlot = (slotInfo) => {
    const { start } = slotInfo;
    setSelectedDate(start);
    
    // 저장된 마우스 위치 사용
    const mousePos = window.lastMousePosition || { x: 0, y: 0 };
    
    // 모달이 화면 밖으로 나가지 않도록 조정
    const modalWidth = 320; 
    const modalHeight = 400; 
    
    let left = mousePos.x;
    let top = mousePos.y;
    
    // 오른쪽 경계 확인
    if (left + modalWidth > window.innerWidth) {
      left = window.innerWidth - modalWidth - 10;
    }
    
    // 아래쪽 경계 확인
    if (top + modalHeight > window.innerHeight) {
      top = window.innerHeight - modalHeight - 10;
    }
    
    // 최소 위치 보장
    left = Math.max(10, left);
    top = Math.max(10, top);
    
    setModalPosition({ top, left });
    setShowEventModal(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setUpdateEventTitle(event.title || ''); // ← 기존 제목 넣기
    
    // 마우스 위치 기반으로 모달 위치 설정
    const mousePos = window.lastMousePosition || { x: 0, y: 0 };
    const modalWidth = 320; 
    const modalHeight = 400; 
    
    let left = mousePos.x;
    let top = mousePos.y;
    
    if (left + modalWidth > window.innerWidth) {
      left = window.innerWidth - modalWidth - 10;
    }
    
    if (top + modalHeight > window.innerHeight) {
      top = window.innerHeight - modalHeight - 10;
    }
    
    left = Math.max(10, left);
    top = Math.max(10, top);
    
    setModalPosition({ top, left });
    setShowUpdateModal(true);
  };

  const handleAddEvent = () => {
    if (newEventTitle.trim() !== "") { 
      const calendar = {
        title: newEventTitle,
        member: member_no,
        labeldate: moment(selectedDate).format('YYYY-MM-DD'),
      };

      fetch(`http://${getIP()}:9093/calendar/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: jwt,
        },
        body: JSON.stringify({ 
        title: newEventTitle,
        member: { member_no },
        labeldate: moment(selectedDate).format('YYYY-MM-DD')
      }),
      })
      .then((res) => {
        if(res.ok) {
          window.location.reload();
        }
      })

      setEvents([...events, calendar]);
      setNewEventTitle('');
      setNewEventBody('');
      setShowEventModal(false);
    } else {
      alert("제목을 입력해주세요");
    }
  };

useEffect(() => {
  Promise.all([
    fetch(`http://${getIP()}:9093/calendar/read`).then(res => res.json()),
    fetch(`http://${getIP()}:9093/news/find`).then(res => res.json())
  ])
    .then(([calendarData, newsData]) => {
      const calendarEvents = calendarData.map(item => ({
        calendarno: item.calendar_no,
        title: item.title,
        start: new Date(item.labeldate),
        end: new Date(item.labeldate),
      }));

      const newsEvents = newsData.map(item => ({
        newsno: item.news_no,
        title: item.title,
        start: new Date(item.newsrdate),
        end: new Date(item.newsrdate),
      }));

      // 일정과 뉴스 둘 다 합치기
      setEvents([...calendarEvents, ...newsEvents]);
    })
    .catch(error => console.error("데이터 불러오기 오류:", error));
}, []); 

  const handleUpdateEvent = () => {
    if (newEventTitle.trim() !== "") {
      const updatedEvents = events.map(event => 
        event === selectedEvent 
          ? { ...event, title: newEventTitle}
          : event
      ); 

      const calendarno = selectedEvent?.calendarno;
      const calendar = {
        title: newEventTitle,
      };

      fetch(`http://${getIP()}:9093/calendar/update/${calendarno}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: jwt,
        },
        body: JSON.stringify(calendar),
      })
      .then(resonse => {
        console.log(resonse);
      })
      
      setEvents(updatedEvents);
      setNewEventTitle('');
      setNewEventBody('');
      setShowUpdateModal(false);
      setSelectedEvent(null);
    } else {
      alert("제목을 입력해주세요");
    }
  };

  const handleDeleteEvent = () => {
    if (window.confirm("일정을 삭제하시겠습니까?")) {
      const updatedEvents = events.filter(event => event !== selectedEvent);

      const calendarno = selectedEvent?.calendarno;

      fetch(`http://${getIP()}:9093/calendar/delete/${calendarno}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: jwt,
        },
        body: JSON.stringify(calendarno),
      })
      setEvents(updatedEvents);
      setShowUpdateModal(false);
      setSelectedEvent(null);
      setNewEventTitle('');
      setNewEventBody('');
    }
  };

  return (
    <>
    <div className="relative" onMouseMove={handleMouseMove}>
      <Calendar
        popup
        ref={calendarRef}
        localizer={localizer}
        events={events}  
        formats={formats}
        startAccessor="start"  
        endAccessor="end"      
        titleAccessor="title"  
        style={{ height: 500, width: 800 }}
        views={['month']}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
      />
  {userInfo?.role === "ADMIN" && (
  <>
    {showEventModal && (
      <div
        className="bg-white border p-4 rounded-lg shadow-lg z-50 w-80"
        style={{
          position: 'fixed',
          top: `${modalPosition.top}px`,
          left: `${modalPosition.left}px`,
          backgroundColor: 'white',
          padding: '10px',
          zIndex: 1000,
        }}
      >
        <h2 className="text-lg font-bold mb-2">일정 추가</h2>
        <input
          type="text"
          placeholder="제목"
          value={newEventTitle}
          onChange={(e) => setNewEventTitle(e.target.value)}
          className="w-full border px-2 py-1 mb-3"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowEventModal(false)}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            취소
          </button>
          <button
            onClick={handleAddEvent}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            추가
          </button>
        </div>
      </div>
    )}

    {showUpdateModal && (
      <div
        className="bg-white border p-4 rounded-lg shadow-lg z-50 w-80"
        style={{
          position: 'fixed',
          top: `${modalPosition.top}px`,
          left: `${modalPosition.left}px`,
          backgroundColor: 'white',
          padding: '10px',
          zIndex: 1000,
        }}
      >
        <h2 className="text-lg font-bold mb-2">일정 수정</h2>
        <input
          type="text"
          placeholder="제목"
          value={updateEventTitle}
          onChange={(e) => setNewEventTitle(e.target.value)}
          className="w-full border px-2 py-1 mb-3"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowUpdateModal(false)}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            취소
          </button>
          <button
            onClick={handleDeleteEvent}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            삭제
          </button>
          <button
            onClick={handleUpdateEvent}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            수정
          </button>
        </div>
      </div>
    )}
  </>
)}
    </div>
    </>
  );
}

export default Schedule;