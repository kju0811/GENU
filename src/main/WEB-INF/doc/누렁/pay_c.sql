-- 누렁(돈) 테이블 삭제
drop table pay;
-- 제약 조건과 함께 삭제(제약 조건이 있어도 삭제됨, 권장하지 않음.)
DROP TABLE pay CASCADE CONSTRAINTS; 

CREATE TABLE pay (
	pay_no	NUMBER(10)	NOT NULL    PRIMARY KEY,
    member_no	NUMBER(10)	NOT NULL,
	pay	NUMBER(10)	NOT NULL,
	pay_date	DATE	NOT NULL,
	pay_type	NUMBER(1)	NOT NULL,
    FOREIGN KEY (member_no) REFERENCES member (member_no)
);

COMMENT ON TABLE pay is '누렁(돈)';
COMMENT ON COLUMN pay.pay_no is '누렁번호';
COMMENT ON COLUMN pay.pay is '금액';
COMMENT ON COLUMN pay.pay_date is '거래일';
COMMENT ON COLUMN pay.pay_type is '거래종류';

DROP SEQUENCE pay_seq;
CREATE SEQUENCE pay_seq
  START WITH 1              -- 시작 번호
  INCREMENT BY 1          -- 증가값
  MAXVALUE 9999999999 -- 최대값: 9999999 --> NUMBER(7) 대응
  CACHE 2                       -- 2번은 메모리에서만 계산
  NOCYCLE;                     -- 다시 1부터 생성되는 것을 방지
  
-- 추가
INSERT INTO pay(pay_no, member_no, pay, pay_date, pay_type)
VALUES (pay_seq.nextval, 1, 1000, sysdate, 1);

-- 검색
SELECT pay_no, member_no, pay, pay_date, pay_type
from pay;

-- 변경
update pay set pay = 500 where pay_no=1;

-- 삭제
DELETE FROM pay
WHERE pay_no=1;

commit;