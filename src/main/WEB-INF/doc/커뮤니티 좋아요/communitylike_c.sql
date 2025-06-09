-- 커뮤니티좋아요 테이블 삭제
drop table communitylike;
-- 제약 조건과 함께 삭제(제약 조건이 있어도 삭제됨, 권장하지 않음.)
DROP TABLE communitylike CASCADE CONSTRAINTS; 

-- 커뮤니티좋아요 테이블 생성
CREATE TABLE communitylike (
	communitylike_no	NUMBER(10)	NOT NULL    PRIMARY KEY,
    member_no	NUMBER(10)	NOT NULL, -- FK
	coin_no	    NUMBER(10)	NOT NULL, -- FK
	communitylike_date	DATE	NOT NULL,
    FOREIGN KEY (member_no) REFERENCES member (member_no),
    FOREIGN KEY (coin_no) REFERENCES coin (coin_no)
);

COMMENT ON TABLE communitylike is '커뮤니티좋아요';
COMMENT ON COLUMN communitylike.communitylike_no is '커뮤니티좋아요번호';
COMMENT ON COLUMN communitylike.communitylike_date is '생성일';

DROP SEQUENCE communitylike_seq;
CREATE SEQUENCE communitylike_seq
  START WITH 1              -- 시작 번호
  INCREMENT BY 1          -- 증가값
  MAXVALUE 9999999999 -- 최대값: 9999999 --> NUMBER(7) 대응
  CACHE 2                       -- 2번은 메모리에서만 계산
  NOCYCLE;                     -- 다시 1부터 생성되는 것을 방지
  
-- 추가
INSERT INTO communitylike(communitylike_no, member_no, coin_no, communitylike_date)
VALUES (communitylike_seq.nextval, 1, 1, sysdate);

-- 검색
SELECT communitylike_no, member_no, coin_no, communitylike_date
from communitylike;

-- 변경 (할 일이 없을듯함)
-- update communitylike set notice_price = 1000 where coinlike_no=1;

-- 삭제
DELETE FROM communitylike
WHERE communitylike_no=1;

commit;