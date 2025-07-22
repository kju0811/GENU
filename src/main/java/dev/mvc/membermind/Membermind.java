package dev.mvc.membermind;

import java.time.LocalDateTime;

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
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Membermind {
	
	// mind번호
	@Id
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator="membermind_seq")
	@SequenceGenerator(name="membermind_seq", sequenceName="MEMBERMIND_SEQ", allocationSize=1)
	@Column(name = "mind_no", updatable = false)
	private Long mindno;
	
	// 생성일
	@Column(name = "mind_date", nullable = false,columnDefinition = "DATE")
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm")
	private LocalDateTime minddate;
	
	// 분석 내용
	@Column(name = "mind_content", nullable = false, columnDefinition = "VARCHAR2(500 char)")
	private String mindcontent = "";
	
	//member외래키
	@ManyToOne
	@JoinColumn(name = "member_no",nullable = false, referencedColumnName = "member_no",
              	columnDefinition = "NUMBER(10)")
	private Member member;
	
	@PrePersist
	  public void prePersist() {
		  if (minddate == null) {
			  minddate = LocalDateTime.now();
		  }
	  }
}
