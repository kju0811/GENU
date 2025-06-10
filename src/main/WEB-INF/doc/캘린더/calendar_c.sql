-- 수업 코드임 참고.
DROP TABLE calendar;

CREATE TABLE calendar (
  calendar_no  NUMBER(10) NOT NULL PRIMARY KEY, -- AUTO_INCREMENT 대체
  member_no    NUMBER(10)     NOT NULL , -- FK
  labeldate   VARCHAR2(10)  NOT NULL, -- 출력할 날짜 2013-10-20
  label       VARCHAR2(50)  NOT NULL, -- 달력에 출력될 레이블
  title       VARCHAR2(100) NOT NULL, -- 제목(*)
  content     CLOB          NOT NULL, -- 글 내용
  cnt         NUMBER        DEFAULT 0, -- 조회수
  seqno       NUMBER(5)     DEFAULT 1 NOT NULL, -- 일정 출력 순서
  regdate     DATE          NOT NULL, -- 등록 날짜  
  FOREIGN KEY (member_no) REFERENCES member (member_no) -- 일정을 등록한 관리자 
);

DROP SEQUENCE calendar_seq;
CREATE SEQUENCE calendar_seq
START WITH 1         -- 시작 번호
INCREMENT BY 1       -- 증가값
MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
CACHE 2              -- 2번은 메모리에서만 계산
NOCYCLE;             -- 다시 1부터 생성되는 것을 방지


-- 데이터 삽입
INSERT INTO calendar(calendar_no, labeldate, label, title, content, cnt, seqno, regdate, member_no)
VALUES (calendar_seq.nextval, '2024-12-24', '크리스마스 이브', '메리 크리스마스', '즐거운 크리스마스 되세요.', 0, 1, sysdate, 1);

INSERT INTO calendar(calendar_no, labeldate, label, title, content, cnt, seqno, regdate, member_no)
VALUES (calendar_seq.nextval, '2024-12-25', '휴강 안내', '메리 크리스마스', '휴강입니다.', 0, 1, sysdate, 1);

INSERT INTO calendar(calendar_no, labeldate, label, title, content, cnt, seqno, regdate, member_no)
VALUES (calendar_seq.nextval, '2024-12-25', '학원 출입 안내', '학원 출입 안내', '크리스마스 기간에 학원 입실 안됩니다.', 0, 2, sysdate, 1);

INSERT INTO calendar(calendar_no, labeldate, label, title, content, cnt, seqno, regdate, member_no)
VALUES (calendar_seq.nextval, '2025-01-01', '새해 첫날 학원 출입 안내', '새해 첫날 학원 출입 안내', '새해 첫날에 학원 입실 안됩니다.', 0, 2, sysdate, 1);

-- 전체 목록
SELECT calendar_no, labeldate, label, title, content, cnt, seqno, regdate, member_no
FROM calendar
ORDER BY calendar_no DESC;

commit;
------------------------------------------ 여기까지 수정 완

-- 특정 달의 목록
SELECT calendarno, labeldate, label, seqno
FROM calendar
WHERE SUBSTR(labeldate, 1, 7) = '2024-12'
ORDER BY labeldate ASC, seqno ASC;

SELECT calendarno, labeldate, label, seqno
FROM calendar
WHERE TO_CHAR(TO_DATE(labeldate, 'YYYY-MM-DD'), 'YYYY-MM') = '2024-12'
ORDER BY labeldate ASC, seqno ASC;

CALENDARNO LABELDATE  LABEL                               SEQNO
---------- ---------- ------------------------------ ----------
         1 2024-12-24 크리스마스 이브                         1
         2 2024-12-25 휴강 안내                               1
         3 2024-12-25 학원 출입 안내                          2

-- 특정 날짜의 목록
SELECT calendarno, labeldate, label, seqno
FROM calendar
WHERE labeldate = '2024-12-24';

CALENDARNO LABELDATE  LABEL                                                   SEQNO
---------- ---------- -------------------------------------------------- ----------
         1 2024-12-24 크리스마스 이브                                             1

-- 조회수 증가
UPDATE calendar
SET cnt = cnt + 1
WHERE calendarno = 1;

-- 조회
SELECT calendarno, labeldate, label, title, content, cnt, regdate, seqno
FROM calendar
WHERE calendarno = 1;

-- 변경
UPDATE calendar
SET labeldate = '', label = '', title = '', content = '', seqno = 1
WHERE calendarno = 1;

-- 삭제
DELETE FROM calendar
WHERE calendarno = 1;