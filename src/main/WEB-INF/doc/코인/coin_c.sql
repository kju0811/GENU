-- 코인 테이블 삭제
drop table coin;
-- 제약 조건과 함께 삭제(제약 조건이 있어도 삭제됨, 권장하지 않음.)
DROP TABLE coin CASCADE CONSTRAINTS; 

-- 코인 테이블 생성
CREATE TABLE coin (
	coin_no	NUMBER(10)	NOT NULL    PRIMARY KEY,
	coin_name	VARCHAR(30)	NOT NULL,
	coin_price	NUMBER(10)	NOT NULL,
	coin_date	DATE	NOT NULL,
	coin_info	CLOB	NOT NULL
);

-- 추가
ALTER TABLE coin DROP COLUMN coin_percentage;
ALTER TABLE COIN ADD coin_cate VARCHAR(30);
ALTER TABLE COIN MODIFY coin_cate NOT NULL;

COMMENT ON TABLE coin is '코인';
COMMENT ON COLUMN coin.coin_no is '코인번호';
COMMENT ON COLUMN coin.coin_name is '코인명';
COMMENT ON COLUMN coin.coin_price is '코인가격';
COMMENT ON COLUMN coin.coin_date is '생성일';
COMMENT ON COLUMN coin.coin_info is '코인정보';

DROP SEQUENCE coin_seq;
CREATE SEQUENCE coin_seq
  START WITH 1              -- 시작 번호
  INCREMENT BY 1          -- 증가값
  MAXVALUE 9999999999 -- 최대값: 9999999 --> NUMBER(7) 대응
  CACHE 2                       -- 2번은 메모리에서만 계산
  NOCYCLE;                     -- 다시 1부터 생성되는 것을 방지
  
-- 추가
INSERT INTO coin(coin_no, coin_name, coin_price, coin_date, coin_info)
VALUES (coin_seq.nextval, '누렁이', 500, sysdate, '누렁이 정보...');

-- 검색
SELECT coin_no, coin_name, coin_price, coin_date, coin_info
from coin;

-- 변경
update coin set coin_price = coin_price + 1000 where coin_no=1;

-- 삭제
DELETE FROM coin
WHERE coin_no=1;

commit;

SELECT f.news_no
FROM fluctuation f
JOIN coin c ON f.coin_no = c.coin_no
WHERE f.fluctuation_date BETWEEN SYSDATE - 3 AND SYSDATE;
