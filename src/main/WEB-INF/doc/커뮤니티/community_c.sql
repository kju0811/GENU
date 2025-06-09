-- 커뮤니티 테이블 삭제
drop table community;
-- 제약 조건과 함께 삭제(제약 조건이 있어도 삭제됨, 권장하지 않음.)
DROP TABLE community CASCADE CONSTRAINTS; 

CREATE TABLE community (
	community_no	NUMBER(10)	NOT NULL,
    member_no	NUMBER(10)	NOT NULL,   -- FK
	coin_no	NUMBER(10)	NOT NULL,       -- FK
	community_title	VARCHAR2(200)	NOT NULL,
	community_content	CLOB	NOT NULL,
	community_cnt	NUMBER(7)	NOT NULL,
	community_date	DATE	NOT NULL,
    FOREIGN KEY (member_no) REFERENCES member (member_no),
    FOREIGN KEY (coin_no) REFERENCES coin (coin_no)
);

COMMENT ON TABLE community is '커뮤니티';
COMMENT ON COLUMN community.community_no is '커뮤니티번호';
COMMENT ON COLUMN community.community_title is '제목';
COMMENT ON COLUMN community.community_content is '내용';
COMMENT ON COLUMN community.community_cnt is '댓글수';
COMMENT ON COLUMN community.community_date is '생성일';

DROP SEQUENCE community_seq;
CREATE SEQUENCE community_seq
  START WITH 1              -- 시작 번호
  INCREMENT BY 1          -- 증가값
  MAXVALUE 9999999999 -- 최대값: 9999999 --> NUMBER(7) 대응
  CACHE 2                       -- 2번은 메모리에서만 계산
  NOCYCLE;                     -- 다시 1부터 생성되는 것을 방지
  
-- 추가
INSERT INTO community(community_no, member_no, coin_no, community_title, community_content, community_cnt, community_date)
VALUES (community_seq.nextval, 1, 1, '누렁이 이대로 괜찮은가...', '제목은 어그로다.', 0, sysdate);

-- 검색
SELECT community_no, member_no, coin_no, community_title, community_content, community_cnt, community_date
from community;

-- 변경
update community set community_title = '누렁이 이번엔 진짜다.' where community_no=1;

-- 삭제
DELETE FROM community
WHERE community_no=1;

commit;