-- 기사 좋아요 테이블 삭제
drop table newslike;
-- 제약 조건과 함께 삭제(제약 조건이 있어도 삭제됨, 권장하지 않음.)
DROP TABLE newslike CASCADE CONSTRAINTS; 

-- 커뮤니티좋아요 테이블 생성
CREATE TABLE newslike (
	newslike_no	NUMBER(10)	NOT NULL    PRIMARY KEY,
    member_no	NUMBER(10)	NOT NULL, -- FK
	news_no	    NUMBER(10)	NOT NULL, -- FK
	newslike_date	DATE	NOT NULL,
    FOREIGN KEY (member_no) REFERENCES member (member_no),
    FOREIGN KEY (news_no) REFERENCES news (news_no)
);

COMMENT ON TABLE newslike is '댓글좋아요';
COMMENT ON COLUMN newslike.newslike_no is '기사좋아요번호';
COMMENT ON COLUMN newslike.newslike_date is '생성일';

DROP SEQUENCE newslike_seq;
CREATE SEQUENCE newslike_seq
  START WITH 1              -- 시작 번호
  INCREMENT BY 1          -- 증가값
  MAXVALUE 9999999999 -- 최대값: 9999999 --> NUMBER(7) 대응
  CACHE 2                       -- 2번은 메모리에서만 계산
  NOCYCLE;                     -- 다시 1부터 생성되는 것을 방지
  
-- 추가
INSERT INTO newslike(newslike_no, member_no, news_no, newslike_date)
VALUES (newslike_seq.nextval, 1, 1, sysdate);

-- 검색
SELECT newslike_no, member_no, news_no, newslike_date
from newslike;

-- 변경 (할 일이 없을듯함)
-- update newslike_seq set notice_price = 1000 where newslike_no=1;

-- 삭제
DELETE FROM newslike
WHERE replylike_no=1;

commit;