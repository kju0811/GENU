-- 거래 테이블 삭제
drop table deal;
-- 제약 조건과 함께 삭제(제약 조건이 있어도 삭제됨, 권장하지 않음.)
DROP TABLE deal CASCADE CONSTRAINTS; 

CREATE TABLE deal (
	deal_no	NUMBER(10)	NOT NULL,
    member_no	NUMBER(10)	NOT NULL, -- FK
	coin_no	NUMBER(10)	NOT NULL,    -- FK
	deal_date	DATE	NOT NULL,
	deal_cnt	NUMBER(10)	NOT NULL,
	deal_fee	NUMBER(10)	NOT NULL,
	deal_type	NUMBER(1)	NOT NULL, -- 매수 1, 매도 0
    FOREIGN KEY (member_no) REFERENCES member (member_no),
    FOREIGN KEY (coin_no) REFERENCES coin (coin_no)
);

COMMENT ON TABLE deal is '거래';
COMMENT ON COLUMN deal.deal_no is '거래번호';
COMMENT ON COLUMN deal.deal_date is '거래일';
COMMENT ON COLUMN deal.deal_cnt is '개수';
COMMENT ON COLUMN deal.deal_fee is '수수료가격';
COMMENT ON COLUMN deal.deal_type is '거래종류';

DROP SEQUENCE deal_seq;
CREATE SEQUENCE deal_seq
  START WITH 1              -- 시작 번호
  INCREMENT BY 1          -- 증가값
  MAXVALUE 9999999999 -- 최대값: 9999999 --> NUMBER(7) 대응
  CACHE 2                       -- 2번은 메모리에서만 계산
  NOCYCLE;                     -- 다시 1부터 생성되는 것을 방지
    
-- 추가
INSERT INTO deal(deal_no, member_no, coin_no, deal_date, deal_cnt, deal_fee, deal_type)
VALUES (deal_seq.nextval, 1, 1, sysdate, 3, 300, 1);

-- 검색
SELECT deal_no, member_no, coin_no, deal_date, deal_cnt, deal_fee, deal_type
from deal;

-- 변경
update deal set deal_cnt = 2 where deal_no=1;

-- 삭제
DELETE FROM deal
WHERE deal_no=1;

commit;