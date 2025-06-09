-- 출석체크 테이블 삭제
drop table attendance;
-- 제약 조건과 함께 삭제(제약 조건이 있어도 삭제됨, 권장하지 않음.)
DROP TABLE attendance CASCADE CONSTRAINTS; 

CREATE TABLE attendance (
	attendance_no	NUMBER(10)	NOT NULL    PRIMARY KEY,
    member_no	NUMBER(10)	NOT NULL,
	attendance_date	DATE	NOT NULL,
    attendance_cnt	NUMBER(2)   DEFAULT 0	NOT NULL,
    FOREIGN KEY (member_no) REFERENCES member (member_no)
);

COMMENT ON TABLE attendance is '출석체크';
COMMENT ON COLUMN attendance.attendance_no is '출석체크번호';
COMMENT ON COLUMN attendance.attendance_date is '출석일';
COMMENT ON COLUMN attendance.attendance_cnt is '누적일';

DROP SEQUENCE attendance_seq;
CREATE SEQUENCE attendance_seq
  START WITH 1              -- 시작 번호
  INCREMENT BY 1          -- 증가값
  MAXVALUE 9999999999 -- 최대값: 9999999 --> NUMBER(7) 대응
  CACHE 2                       -- 2번은 메모리에서만 계산
  NOCYCLE;                     -- 다시 1부터 생성되는 것을 방지
  
-- 추가
INSERT INTO attendance(attendance_no, member_no, attendance_date, attendance_cnt)
VALUES (attendance_seq.nextval, 1, sysdate, 0);

-- 검색
SELECT attendance_no, member_no, attendance_date, attendance_cnt
from attendance;

-- 변경
update attendance set attendance_cnt = 2 where attendance_no=1;

-- 삭제
DELETE FROM attendance
WHERE attendance_no=1;

commit;