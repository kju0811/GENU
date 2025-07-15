package dev.mvc.newsreply;

import java.time.LocalDateTime;

import dev.mvc.member.Member;
import dev.mvc.news.News;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
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
 CREATE TABLE `newsreply` (
  `newsreply_no`  NUMBER(10)  NOT NULL,
  `newsreply_content` VARCHAR(600)  NOT NULL,
  `newsreply_date`  DATE  NOT NULL,
  `member_no` NUMBER(10)  NOT NULL,
  `news_no` NUMBER(10)  NOT NULL
);
 */

@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity @Getter @Setter
@Table(name = "newsreply")
public class NewsReply {
  
  // 댓글 번호 
  @Id
  @NotNull
  @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="newsreply_seq")
  @SequenceGenerator(name="newsreply_seq", sequenceName="NEWSREPLY_SEQ", allocationSize=1)
  private Long newsreply_no;
  
  // 댓글 내용
  @Column(name = "newsreply_content",nullable = false, columnDefinition = "VARCHAR2(600)")
  private String newsreply_content = "";
  
  // 댓글 작성일
  @Column(name = "newsreply_date", nullable = false, columnDefinition = "DATE")
  private LocalDateTime newsreplyDate;
  
  // 회원테이블 외래키
  @ManyToOne
  @JoinColumn(name = "member_no",nullable = false, referencedColumnName = "member_no",
              columnDefinition = "NUMBER(10)")
  private Member member;
  
  // 뉴스테이블 외래키
  @ManyToOne
  @JoinColumn(name = "news_no",nullable = false, referencedColumnName = "news_no",
              columnDefinition = "NUMBER(10)")
  private News news;
  
  @PrePersist
  public void prePersist() {
    if (this.newsreplyDate == null) {
      this.newsreplyDate = LocalDateTime.now();
    }
  }
  
}
