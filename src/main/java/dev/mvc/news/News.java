package dev.mvc.news;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.ColumnDefault;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import dev.mvc.fluctuation.Fluctuation;
import dev.mvc.member.Member;
import dev.mvc.newslike.NewsLike;
import dev.mvc.newsreply.NewsReply;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/*
 CREATE TABLE "news" (
  "news_no" NUMBER(10)    NOT NULL,
  "news_title"  VARCHAR2(200)   NOT NULL,
  "news_content"  CLOB    NOT NULL,
  "news_like" NUMBER(7)   NULL,
  "news_cnt"  NUMBER(7)   NULL,
  "news_replycnt" NUMBER(7)   NOT NULL,
  "news_word" VARCHAR2(200)   NULL,
  "news_rdate"  DATE    NOT NULL,
  "file1" VARCHAR(100)    NULL,
  "file1saved"  VARCHAR(100)    NULL,
  "thumb1"  VARCHAR(100)    NULL,
  "size1" NUMBER(10)    NULL,
  "map" VARCHAR2(1000)    NULL,
  "youtube" VARCHAR2(1000)    NULL,
  "mp4" VARCHAR2(100)   NULL,
  "visible" CHAR(1)   NOT NULL,
  "grade_no"  NUMBER(7)   NOT NULL,
  "emotion" NUMBER(1)   NOT NULL,
  "summary" VARCHAR(1000)   NOT NULL,
  "member_no" NUMBER(10)    NOT NULL
);
  */

@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity @Getter @Setter
@Table(name = "news")
public class News {
  
  // 뉴스 번호 
  @Id
  @NotNull
  @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="news_seq")
  @SequenceGenerator(name="news_seq", sequenceName="NEWS_SEQ", allocationSize=1)
  @Column(name = "news_no")
  private Long newsno;
  
  // 뉴스 타이틀
  @Column(name = "news_title",nullable = false, columnDefinition = "VARCHAR2(200)")
  private String title = "";
  
  // 뉴스 내용
  @Lob
  @Column(name = "news_content", nullable = false, columnDefinition = "CLOB")
  private String content = "";
  
  // 뉴스 조회수
  @Column(name = "news_cnt", nullable = false, columnDefinition = "NUMBER(7)")
  private  Integer news_cnt = 0;
  
  // 댓글수
  @Column(name = "news_replycnt", nullable = false, columnDefinition = "NUMBER(7)")
  private  Integer news_replycnt = 0;
  
  // 검색어
  @Column(name = "news_word", nullable = false, columnDefinition = "VARCHAR2(200)")
  private String news_word = "";
  
  // 뉴스 등록일
  @JsonFormat(pattern = "yyyy-MM-dd HH:MM")
  @Column(name = "news_rdate", nullable = false, columnDefinition = "DATE")
  private LocalDateTime newsrdate;
  
  // 파일1
  @Column(name = "file1", columnDefinition = "VARCHAR2(100)")
  private String file1;
  
  // 저장된 파일명1 
  @Column(name = "file1saved", columnDefinition = "VARCHAR2(100)")
  private String file1saved;
  
  // 프리뷰1
  @Column(name = "thumb1", columnDefinition = "VARCHAR2(100)")
  private String thumb1;
  
  // 파일크기1
  @Column(name = "size1", columnDefinition = "NUMBER(10)")
  private String size1;
  
  // 지도
  @Column(name = "map", columnDefinition = "VARCHAR2(1000)")
  private String map;
  
  // 유투브
  @Column(name = "youtube", columnDefinition = "VARCHAR2(1000)")
  private String youtube;
  
  // mp4
  @Column(name = "mp4", columnDefinition = "VARCHAR2(100)")
  private String mp4;
  
  // 출력모드
  @Column(name = "visible", nullable = false, columnDefinition = "CHAR(1)")
  @ColumnDefault("'Y'")
  private String visible = "Y";
  
  // 호재악재 판별
  @Column(name = "emotion", nullable = false, columnDefinition = "NUMBER(1)")
  @ColumnDefault("0")
  private Integer emotion = 0;
  
  // 요약
  @Column(name = "summary", nullable = false, columnDefinition = "VARCHAR2(1000)")
  private String summary;
  
  // 회원테이블 외래키
  @ManyToOne
  @JoinColumn(name = "member_no",nullable = false, referencedColumnName = "member_no",
              columnDefinition = "NUMBER(10)")
  private Member member;
  
  @PrePersist
  public void prePersist() {
	  if (newsrdate == null) {
		  newsrdate = LocalDateTime.now();
	  }
  }
  
  @OneToMany(mappedBy = "news", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Fluctuation> fluctuations = new ArrayList<>();
  
//  @OneToMany(mappedBy = "news", cascade = CascadeType.ALL, orphanRemoval = true)
//  @JsonManagedReference
//  private List<NewsLike> like = new ArrayList<>();
//  
//  @OneToMany(mappedBy = "news", cascade = CascadeType.ALL, orphanRemoval = true)
//  @JsonManagedReference
//  private List<NewsReply> reply = new ArrayList<>();
  
}
