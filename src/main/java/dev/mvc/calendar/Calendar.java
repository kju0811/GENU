package dev.mvc.calendar;

import java.time.LocalDateTime;

import dev.mvc.member.Member;
import dev.mvc.news.News;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/*
 CREATE TABLE calendar (
  calendar_no  NUMBER(10) NOT NULL PRIMARY KEY, -- AUTO_INCREMENT 대체
  member_no    NUMBER(10)     NOT NULL , -- FK
  labeldate   VARCHAR2(10)  NOT NULL, -- 출력할 날짜 2013-10-20
  label       VARCHAR2(50)  NOT NULL, -- 달력에 출력될 레이블
  title       VARCHAR2(100) NOT NULL, -- 제목(*)
  content     CLOB          NOT NULL, -- 글 내용
  cnt         NUMBER        DEFAULT 0, -- 조회수
  seqno       NUMBER(5)     DEFAULT 1 NOT NULL, -- 일정 출력 순서
  regdate     DATE          NOT NULL, -- 등록 날짜  
  FOREIGN KEY (member_no) REFERENCES member (member_no) -- 일정을 등록한 관리자 
);
 */

@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity @Getter @Setter
@Table(name = "calendar")
public class Calendar {

  /* 캘린더 번호 */
  @Id
  @NotNull
  @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="calendar_seq")
  @SequenceGenerator(name="calendar_seq", sequenceName="CALENDAR_SEQ", allocationSize=1)
  private Long calendar_no;
  
  /** 출력할 날짜 */
  @Column(name = "labeldate", nullable = false, columnDefinition = "VARCHAR(10)")
  private String labeldate = "";
  
  /** 출력할 레이블 */
  @Column(name = "label",nullable = false, columnDefinition = "VARCHAR2(50)")
  private String label = "";
  
  /** 제목 */
  @Column(name = "title",nullable = false, columnDefinition = "VARCHAR2(100)")
  private String title = "";
  
  /** 글 내용 */
  @Lob
  @Column(name = "content",nullable = false, columnDefinition = "CLOB")
  private String content = "";
  
  /** 조회수 */
  @Column(name = "cnt", nullable = false, columnDefinition = "NUMBER(7)")
  private Integer cnt = 0;
  
  /** 일정 출력 순서 */
  @Column(name = "seqno", nullable = false, columnDefinition = "NUMBER(5)")
  private Integer seqno;
  
  /** 등록 날짜 */
  @Column(name = "regdate", nullable = false, columnDefinition = "DATE")
  private LocalDateTime regdate;
  
  @PrePersist
  public void prepersist() {
	  if (regdate == null) {
		  regdate = LocalDateTime.now();
	  }
  }
  
  // 회원테이블 외래키
  @ManyToOne
  @JoinColumn(name = "member_no",nullable = false, referencedColumnName = "member_no",
              columnDefinition = "NUMBER(10)")
  private Member member;
  
}
