-- 코인기록 테이블 삭제
drop table coinlog;
-- 제약 조건과 함께 삭제(제약 조건이 있어도 삭제됨, 권장하지 않음.)
DROP TABLE coinlog CASCADE CONSTRAINTS; 

CREATE TABLE coinlog (
	coinlog_no	NUMBER(10)	NOT NULL    PRIMARY KEY,
    coin_no	NUMBER(10)	NOT NULL, -- FK
	coinlog_time	DATE	NOT NULL,
	coinlog_price	NUMBER(10)	NOT NULL,
    FOREIGN KEY (coin_no) REFERENCES coin (coin_no)
);

COMMENT ON TABLE coinlog is '코인기록';
COMMENT ON COLUMN coinlog.coinlog_no is '코인기록번호';
COMMENT ON COLUMN coinlog.coinlog_time is '기록시간';
COMMENT ON COLUMN coinlog.coinlog_price is '코인가격';

DROP SEQUENCE coinlog_seq;
CREATE SEQUENCE coinlog_seq
  START WITH 1              -- 시작 번호
  INCREMENT BY 1          -- 증가값
  MAXVALUE 9999999999 -- 최대값: 9999999 --> NUMBER(7) 대응
  CACHE 2                       -- 2번은 메모리에서만 계산
  NOCYCLE;                     -- 다시 1부터 생성되는 것을 방지
  
-- 추가
INSERT INTO coinlog(coinlog_no, coin_no, coinlog_time, coinlog_price)
VALUES (coinlog_seq.nextval, 1, sysdate, 1500);

-- 검색
SELECT coinlog_no, coin_no, coinlog_time, coinlog_price
from coinlog;

-- 변경 (할 일이 없을듯함)
update coin set coin_price = coin_price + 1000 where coin_no=1;

-- 삭제
DELETE FROM coin
WHERE coinlog_no=1;

commit;