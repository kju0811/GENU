package dev.mvc.announce;

import java.time.LocalDateTime;

import org.hibernate.annotations.ColumnDefault;

import com.fasterxml.jackson.annotation.JsonFormat;

import dev.mvc.member.Member;
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
   CREATE TABLE "announce" (
  "announce_no" NUMBER(10)    NOT NULL,
  "announce_title"  VARCHAR2(200)   NOT NULL,
  "announce_content"  CLOB    NOT NULL,
  "announce_date" DATE    NOT NULL,
  "visible" CHAR(1)   NOT NULL,
  "member_no" NUMBER(10)    NOT NULL
);
 */

@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity @Getter @Setter
@Table(name = "announce")
public class Announce {
  
  // 공지사항 번호 
  @Id
  @NotNull
  @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="announce_seq")
  @SequenceGenerator(name="announce_seq", sequenceName="ANNOUNCE_SEQ", allocationSize=1)
  private Long announce_no;
  
  // 공지사항 타이틀
  @Column(name = "announce_title",nullable = false, columnDefinition = "VARCHAR2(200)")
  private String announcetitle = "";
  
  // 공지사항 타이틀
 @Column(name = "announce_content",nullable = false, columnDefinition = "CLOB")
 private String announce_content = "";
 
  // 공지사항 등록일
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
  @Column(name = "announce_date", nullable = false, columnDefinition = "DATE")
  private LocalDateTime announcedate;
  
  // 출력모드
  @Column(name = "visible", nullable = false, columnDefinition = "CHAR(1)")
  @ColumnDefault("'Y'")
  private String visible = "Y";
  
  // 회원테이블 외래키
  @ManyToOne
  @JoinColumn(name = "member_no",nullable = false, referencedColumnName = "member_no",
              columnDefinition = "NUMBER(10)")
  private Member member;
  
  @PrePersist
  public void prePersist() {
	  if (announcedate == null) {
		  announcedate = LocalDateTime.now();
	  }
  }
  
}
