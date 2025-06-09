-- 댓글 테이블 삭제
drop table reply;
-- 제약 조건과 함께 삭제(제약 조건이 있어도 삭제됨, 권장하지 않음.)
DROP TABLE reply CASCADE CONSTRAINTS; 

CREATE TABLE reply (
	reply_no	NUMBER(10)	NOT NULL    PRIMARY KEY,
    member_no	NUMBER(10)	NOT NULL,   -- FK
	coin_no	NUMBER(10)	NOT NULL,       -- FK
	reply_content	VARCHAR(600)	NOT NULL,
	reply_date	DATE	NOT NULL,
    FOREIGN KEY (member_no) REFERENCES member (member_no),
    FOREIGN KEY (coin_no) REFERENCES coin (coin_no)
);

COMMENT ON TABLE reply is '댓글';
COMMENT ON COLUMN reply.reply_no is '댓글번호';
COMMENT ON COLUMN reply.reply_content is '내용';
COMMENT ON COLUMN reply.reply_date is '생성일';

DROP SEQUENCE reply_seq;
CREATE SEQUENCE reply_seq
  START WITH 1              -- 시작 번호
  INCREMENT BY 1          -- 증가값
  MAXVALUE 9999999999 -- 최대값: 9999999 --> NUMBER(7) 대응
  CACHE 2                       -- 2번은 메모리에서만 계산
  NOCYCLE;                     -- 다시 1부터 생성되는 것을 방지
  
-- 추가
INSERT INTO reply(reply_no, member_no, coin_no, reply_content, reply_date)
VALUES (reply_seq.nextval, 1, 1, 'ㅎㅇㅎㅇ', sysdate);

-- 검색
SELECT reply_no, member_no, coin_no, reply_content, reply_date
from reply;

-- 변경
update reply set reply_content = 'ㅋㅎㅋㅎ' where reply_no=1;

-- 삭제
DELETE FROM reply
WHERE reply_no=1;

commit;