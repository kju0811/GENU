-- 차단 테이블 삭제
drop table blocks;
-- 제약 조건과 함께 삭제(제약 조건이 있어도 삭제됨, 권장하지 않음.)
DROP TABLE blocks CASCADE CONSTRAINTS; 

CREATE TABLE blocks (
	blocker_no	NUMBER(10)	NOT NULL,
    blocked_no	NUMBER(10)	NOT NULL,
    FOREIGN KEY (blocker_no) REFERENCES member (member_no),
    FOREIGN KEY (blocked_no) REFERENCES member (member_no)
);

COMMENT ON TABLE blocks is '차단';
COMMENT ON COLUMN blocks.blocker_no is '차단 하는 유저번호';
COMMENT ON COLUMN blocks.blocked_no is '차단 받은 유저번호';

-- 추가
INSERT INTO blocks(blocker_no, blocked_no)
VALUES (1, 2);

-- 검색
SELECT blocker_no, blocked_no
from blocks;

-- 변경
-- update blocks set pay = 500 where pay_no=1;

-- 삭제
DELETE FROM blocks
WHERE blocker_no=1 and blocked_no=2;

commit;