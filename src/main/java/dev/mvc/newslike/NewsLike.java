package dev.mvc.newslike;

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
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity @Getter @Setter
@Table(name = "newslike")
public class NewsLike {
  
  // 좋아요 번호 
 @Id
 @NotNull
 @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="newslike_seq")
 @SequenceGenerator(name="newslike_seq", sequenceName="NEWSLIKE_SEQ", allocationSize=1)
 private Long newslike_no;
 
  // 작성일
  @Column(name = "newslike_date", nullable = false, columnDefinition = "DATE")
  private LocalDateTime newslikeDate;
  
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
 
}
