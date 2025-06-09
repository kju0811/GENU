-- 공지사항 테이블 삭제
drop table announce;
-- 제약 조건과 함께 삭제(제약 조건이 있어도 삭제됨, 권장하지 않음.)
DROP TABLE announce CASCADE CONSTRAINTS; 

CREATE TABLE announce (
	announce_no	NUMBER(10)	NOT NULL    PRIMARY KEY,
    member_no	NUMBER(10)	NOT NULL, -- FK
	announce_title	VARCHAR2(200)	NOT NULL,
	announce_content	CLOB	NOT NULL,
	announce_date	DATE	NOT NULL,
	visible	CHAR(1)	DEFAULT 'Y' NOT NULL,
    FOREIGN KEY (member_no) REFERENCES member (member_no)
);

COMMENT ON TABLE announce is '공지사항';
COMMENT ON COLUMN announce.newslike_no is '공지사항번호';
COMMENT ON COLUMN announce.announce_title is '제목';
COMMENT ON COLUMN announce.announce_content is '내용';
COMMENT ON COLUMN announce.announce_date is '생성일';
COMMENT ON COLUMN announce.visible is '출력모드';

DROP SEQUENCE announce_seq;
CREATE SEQUENCE announce_seq
  START WITH 1              -- 시작 번호
  INCREMENT BY 1          -- 증가값
  MAXVALUE 9999999999 -- 최대값: 9999999 --> NUMBER(7) 대응
  CACHE 2                       -- 2번은 메모리에서만 계산
  NOCYCLE;                     -- 다시 1부터 생성되는 것을 방지
  
-- 추가
INSERT INTO announce(announce_no, member_no, announce_title, announce_content, announce_date)
VALUES (announce_seq.nextval, 1, '공지 제목', '공지 내용', sysdate);

-- 검색
SELECT announce_no, member_no, announce_title, announce_content, announce_date
from announce;

-- 변경 (할 일이 없을듯함)
-- update announce set notice_price = 1000 where newslike_no=1;

-- 삭제
DELETE FROM announce
WHERE announce_no=1;

commit;