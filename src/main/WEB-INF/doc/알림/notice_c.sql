-- 알림 테이블 삭제
drop table notice;
-- 제약 조건과 함께 삭제(제약 조건이 있어도 삭제됨, 권장하지 않음.)
DROP TABLE notice CASCADE CONSTRAINTS; 

CREATE TABLE notice (
	notice_no	NUMBER(10)	NOT NULL    PRIMARY KEY,
    member_no	NUMBER(10)	NOT NULL, -- FK
	coin_no	    NUMBER(10)	NOT NULL, -- FK
	notice_price	NUMBER(10)	NOT NULL,
    FOREIGN KEY (member_no) REFERENCES member (member_no),
    FOREIGN KEY (coin_no) REFERENCES coin (coin_no)
);

COMMENT ON TABLE notice is '알림';
COMMENT ON COLUMN notice.notice_no is '알림번호';
COMMENT ON COLUMN notice.notice_price is '알림금액';

DROP SEQUENCE notice_seq;
CREATE SEQUENCE notice_seq
  START WITH 1              -- 시작 번호
  INCREMENT BY 1          -- 증가값
  MAXVALUE 9999999999 -- 최대값: 9999999 --> NUMBER(7) 대응
  CACHE 2                       -- 2번은 메모리에서만 계산
  NOCYCLE;                     -- 다시 1부터 생성되는 것을 방지
  
-- 추가
INSERT INTO notice(notice_no, member_no, coin_no, notice_price)
VALUES (notice_seq.nextval, 1, 1, 1700);

-- 검색
SELECT notice_no, member_no, coin_no, notice_price
from notice;

-- 변경
update notice set notice_price = 1000 where notice_no=1;

-- 삭제
DELETE FROM notice
WHERE notice_no=1;

commit;