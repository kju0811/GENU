-- 기사 댓글 테이블 삭제
drop table newsreply;
-- 제약 조건과 함께 삭제(제약 조건이 있어도 삭제됨, 권장하지 않음.)
DROP TABLE newsreply CASCADE CONSTRAINTS; 

CREATE TABLE newsreply (
	newsreply_no	NUMBER(10)	NOT NULL PRIMARY KEY,
    member_no	NUMBER(10)	NOT NULL,   -- FK
	news_no	NUMBER(10)	NOT NULL,       -- FK
	newsreply_content	VARCHAR(600)	NOT NULL,
	newsreply_date	DATE	NOT NULL,
    FOREIGN KEY (member_no) REFERENCES member (member_no),
    FOREIGN KEY (news_no) REFERENCES news (news_no)
);

COMMENT ON TABLE newsreply is '기사댓글';
COMMENT ON COLUMN newsreply.newsreply_no is '기사댓글번호';
COMMENT ON COLUMN newsreply.newsreply_content is '내용';
COMMENT ON COLUMN newsreply.newsreply_date is '생성일';

DROP SEQUENCE newsreply_seq;
CREATE SEQUENCE newsreply_seq
  START WITH 1              -- 시작 번호
  INCREMENT BY 1          -- 증가값
  MAXVALUE 9999999999 -- 최대값: 9999999 --> NUMBER(7) 대응
  CACHE 2                       -- 2번은 메모리에서만 계산
  NOCYCLE;                     -- 다시 1부터 생성되는 것을 방지
  
-- 추가
INSERT INTO newsreply(newsreply_no, member_no, news_no, newsreply_content, newsreply_date)
VALUES (newsreply_seq.nextval, 1, 1, '기사 도움이 됩니다!', sysdate);

-- 검색
SELECT newsreply_no, member_no, news_no, newsreply_content, newsreply_date
from newsreply;

-- 변경
update newsreply set newsreply_content = '잘보고 갑니다!' where newsreply_no=1;

-- 삭제
DELETE FROM newsreply
WHERE newsreply_no=1;

commit;