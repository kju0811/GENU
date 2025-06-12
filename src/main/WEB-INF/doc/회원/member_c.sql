-- 기존 테이블 삭제
DROP TABLE qna;
DROP TABLE reply;
DROP TABLE member;
DROP TABLE member CASCADE CONSTRAINTS;

-- member 테이블 생성
CREATE TABLE member (
  member_no      NUMBER(10)    NOT NULL,        -- 회원 번호 (PK)
  member_id      VARCHAR(30)   NOT NULL UNIQUE, -- 이메일(아이디)
  member_pw      VARCHAR(200)  NOT NULL,        -- 패스워드
  member_name    VARCHAR(30)   NOT NULL,        -- 성명
  member_tel     VARCHAR(14)   NOT NULL,        -- 전화번호
  zipcode        VARCHAR(5)    NULL,            -- 우편번호
  address1       VARCHAR(80)   NULL,            -- 주소 1
  address2       VARCHAR(50)   NULL,            -- 주소 2
  member_date    DATE          NOT NULL,        -- 가입일
  member_grade   NUMBER(2)     NOT NULL,        -- 회원등급
  member_nick    VARCHAR(45)   NOT NULL UNIQUE, -- 활동명
  PRIMARY KEY (member_no)
);

-- 주석(Comment)
COMMENT ON TABLE member IS '회원';
COMMENT ON COLUMN member.member_no IS '회원번호';
COMMENT ON COLUMN member.member_id IS '회원아이디';
COMMENT ON COLUMN member.member_pw IS '회원비번';
COMMENT ON COLUMN member.member_name IS '회원이름';
COMMENT ON COLUMN member.member_tel IS '전화번호';
COMMENT ON COLUMN member.zipcode IS '우편번호';
COMMENT ON COLUMN member.address1 IS '주소1';
COMMENT ON COLUMN member.address2 IS '주소2';
COMMENT ON COLUMN member.member_date IS '회원가입일';
COMMENT ON COLUMN member.member_grade IS '회원등급';
COMMENT ON COLUMN member.member_nick IS '활동명';

-- 시퀀스 생성
DROP SEQUENCE member_seq;

CREATE SEQUENCE member_seq
  START WITH 1
  INCREMENT BY 1
  MAXVALUE 9999999999
  CACHE 2
  NOCYCLE;

-- 1. ID 중복 확인
SELECT COUNT(member_id) AS cnt
FROM member
WHERE member_id = 'user1';

-- 2. 회원 등록
INSERT INTO member(member_no, member_id, member_pw, member_name, member_tel, zipcode,
                   address1, address2, member_date, member_grade, member_nick)
VALUES (member_seq.nextval, 'admin', '1234', '통합 관리자', '000-0000-0000', '12345',
        '서울시 종로구', '관철동', SYSDATE, 1, 'admin_nick');

INSERT INTO member(member_no, member_id, member_pw, member_name, member_tel, zipcode,
                   address1, address2, member_date, member_grade, member_nick)
VALUES (member_seq.nextval, 'qnaadmin', '1234', '질문답변관리자', '000-0000-0000', '12345',
        '서울시 종로구', '관철동', SYSDATE, 1, 'qnaadmin_nick');

INSERT INTO member(member_no, member_id, member_pw, member_name, member_tel, zipcode,
                   address1, address2, member_date, member_grade, member_nick)
VALUES (member_seq.nextval, 'user1@mail.com', '1234', '왕눈이', '000-0000-0000', '12345',
        '서울시 종로구', '관철동', SYSDATE, 15, 'user1_nick');

INSERT INTO member(member_no, member_id, member_pw, member_name, member_tel, zipcode,
                   address1, address2, member_date, member_grade, member_nick)
VALUES (member_seq.nextval, 'user2@mail.com', '1234', '아로미', '000-0000-0000', '12345',
        '서울시 종로구', '관철동', SYSDATE, 15, 'user2_nick');

INSERT INTO member(member_no, member_id, member_pw, member_name, member_tel, zipcode,
                   address1, address2, member_date, member_grade, member_nick)
VALUES (member_seq.nextval, 'user3@mail.com', '1234', '투투투', '000-0000-0000', '12345',
        '서울시 종로구', '관철동', SYSDATE, 15, 'user3_nick');

INSERT INTO member(member_no, member_id, member_pw, member_name, member_tel, zipcode,
                   address1, address2, member_date, member_grade, member_nick)
VALUES (member_seq.nextval, 'team1', '1234', '개발팀', '000-0000-0000', '12345',
        '서울시 종로구', '관철동', SYSDATE, 15, 'team1_nick');

INSERT INTO member(member_no, member_id, member_pw, member_name, member_tel, zipcode,
                   address1, address2, member_date, member_grade, member_nick)
VALUES (member_seq.nextval, 'team2', '1234', '웹퍼블리셔팀', '000-0000-0000', '12345',
        '서울시 종로구', '관철동', SYSDATE, 15, 'team2_nick');

INSERT INTO member(member_no, member_id, member_pw, member_name, member_tel, zipcode,
                   address1, address2, member_date, member_grade, member_nick)
VALUES (member_seq.nextval, 'team3', '1234', '디자인팀', '000-0000-0000', '12345',
        '서울시 종로구', '관철동', SYSDATE, 15, 'team3_nick');

COMMIT;

-- 3. 전체 목록 조회
SELECT member_no, member_id, member_pw, member_name, member_tel, zipcode,
       address1, address2, member_date, member_grade, member_nick
FROM member
ORDER BY member_grade ASC, member_id ASC;

-- 4. 단일 조회
SELECT member_no, member_id, member_pw, member_name, member_tel, zipcode,
       address1, address2, member_date, member_grade, member_nick
FROM member
WHERE member_no = 1;

SELECT member_no, member_id, member_pw, member_name, member_tel, zipcode,
       address1, address2, member_date, member_grade, member_nick
FROM member
WHERE member_id = 'user1@mail.com';

-- 5. 정보 수정
UPDATE member 
SET member_name = '조인성',
    member_tel = '111-1111-1111',
    zipcode = '00000',
    address1 = '강원도',
    address2 = '홍천군',
    member_grade = 14
WHERE member_no = 12;

COMMIT;

-- 6. 삭제
DELETE FROM member; -- 전체 삭제

DELETE FROM member -- 특정 회원 삭제
WHERE member_no = 12;

COMMIT;

-- 7. 로그인
SELECT COUNT(member_no) AS cnt
FROM member
WHERE member_id = 'user1@mail.com' AND member_pw = '1234';

-- 8. 패스워드 변경
SELECT COUNT(member_no) AS cnt
FROM member
WHERE member_no = 1 AND member_pw = '1234';

UPDATE member
SET member_pw = '0000'
WHERE member_no = 1;

COMMIT;

-- 9. 회원 등급 변경
UPDATE member
SET member_grade = 40
WHERE member_no = 5;

UPDATE member
SET member_grade = 99
WHERE member_no = 9;

COMMIT;
