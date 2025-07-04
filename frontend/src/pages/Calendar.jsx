import React, { useState, useRef, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getIP } from '../components/Tool';
import 'moment/locale/ko';

moment.locale('ko');
const localizer = momentLocalizer(moment);

function Schedule() {
  const calendarRef = useRef(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showUpdateModal, setUpdateventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventBody, setNewEventBody] = useState('');
  const [events, setEvents] = useState([]);

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
  };

  const handleAddEvent = () => {
    if (newEventTitle.trim() !== "") { 
      const calendar = {
        title: newEventTitle,
        content: newEventBody,
        labeldate: moment(selectedDate).format('YYYY-MM-DD'),
      };

      fetch(`http://${getIP()}:9093/calendar/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( calendar ),
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
        fetch(`http://${getIP()}:9093/calendar/read`, { // Spring Boot JPA
      method: 'GET'
    })
    .then(result => result.json()) // 응답
    .then(result => {
      const calendarEvents = result.map(item => ({
        title: item.title,
        body: item.content,
        start: new Date(item.labeldate),  // 문자열을 Date 객체로 변환
        end: new Date(item.labeldate),
      }));
      setEvents(calendarEvents);
      console.log(result);
    })
    .catch(err => console.error(err))
  }, []); 

  return (
    <div className="relative" onMouseMove={handleMouseMove}>
      <Calendar
        ref={calendarRef}
        localizer={localizer}
        events={events}  
        formats={formats}
        startAccessor="start"  
        endAccessor="end"      
        titleAccessor="title"  
        style={{ height: 500, width: 800 }}
        views={['month','week']}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
      />

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
          <textarea
            placeholder='내용'
            value={newEventBody}
            onChange={(e) => setNewEventBody(e.target.value)}
            style={{height:200}}
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
            value={newEventTitle}
            onChange={(e) => setNewEventTitle(e.target.value)}
            className="w-full border px-2 py-1 mb-3"
          />
          <textarea
            placeholder='내용'
            value={newEventBody}
            onChange={(e) => setNewEventBody(e.target.value)}
            style={{height:200}}
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
    </div>
  );
}

export default Schedule;