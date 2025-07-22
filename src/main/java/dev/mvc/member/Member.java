package dev.mvc.member;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.SequenceGenerator;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

//CREATE TABLE member (
//    member_no      NUMBER(10)    NOT NULL,        -- 회원 번호 (PK)
//    member_id      VARCHAR(30)   NOT NULL UNIQUE, -- 이메일(아이디)
//    member_pw      VARCHAR(200)  NOT NULL,        -- 패스워드
//    member_name    VARCHAR(30)   NOT NULL,        -- 성명
//    member_tel     VARCHAR(14)   NOT NULL,        -- 전화번호
//    zipcode        VARCHAR(5)    NULL,            -- 우편번호
//    address1       VARCHAR(80)   NULL,            -- 주소 1
//    address2       VARCHAR(50)   NULL,            -- 주소 2
//    member_date    DATE          NOT NULL,        -- 가입일
//    member_grade   NUMBER(2)     NOT NULL,        -- 회원등급
//    member_img    VARCHAR(45)   NOT NULL, -- 회원이미지
//    member_nick    VARCHAR(45)   NOT NULL UNIQUE, -- 활동명
//    PRIMARY KEY (member_no)
//  );

@NoArgsConstructor
@AllArgsConstructor
@Entity @Setter @Getter @ToString
@Builder @Data
public class Member {
  /**
   * 회원 번호 식별자, sequence 자동 생성됨.
   * @Id: Primary Key
   */
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "member_seq")
  @SequenceGenerator(name = "member_seq", sequenceName = "MEMBER_SEQ", allocationSize = 1)
  @Column(name = "member_no", updatable = false)
  private Long member_no;
  
  /** 회원 아이디(이메일) */
  @Column(name = "member_id", nullable = false, length = 30, unique = true)
  private String memberId;

  /** 패스워드 */
  @Column(name = "member_pw", nullable = false, length = 200)
  private String memberPw;
  
  /** 성명 */
  @Column(name = "member_name", nullable = false, length = 30)
  private String member_name;

  /** 전화번호 */
  @Column(name = "member_tel", nullable = false, length = 14)
  private String member_tel = "";

  /** 우편번호 */
  @Column(name = "zipcode", length = 5)
  private String zipcode = "";

  /** 주소1 */
  @Column(name = "address1", length = 80)
  private String address1 = "";

  /** 주소2 */
  @Column(name = "address2", length = 50)
  private String address2 = "";

  /** 가입일 */
  @Column(name = "member_date", nullable = false, columnDefinition = "DATE")
  private LocalDateTime memberDate;

  /** 회원등급 */
  @Column(name = "member_grade", nullable = false)
  private Integer member_grade = 0;

  /** 활동명 */
  @Column(name = "member_nick", nullable = false, length = 45, unique = true)
  private String member_nick = "";
  
  /** 멤버 이미지 */
  @Column(name = "member_img", nullable = false)
  private String member_img="";
  
  /** 멤버 생년월일(8자리 고정) */
  @Column(name = "member_birth", nullable = false, length = 8)
  private String memberBirth="";  
  
  /** SNS 로그인 확인*/
  @Column(name = "auth_provider")
  private String authProvider;
  
  @PrePersist
  public void prePersist() {
    if (this.memberDate == null) {
      this.memberDate = LocalDateTime.now();
    }
  }
  
  public String getRole() {
    String grade_str = "GUEST";
    
    if (member_grade <= 1) {
      grade_str = "ADMIN"; // 관리자
    } else if (member_grade <= 10) {
      grade_str = "USER";    // 회원
    } else if (member_grade == 20) {
      grade_str = "STOP";    // 정지 회원
    } else if (member_grade == 30) {
      grade_str = "CANCEL"; // 탈퇴 회원
    } else {
    	grade_str = "GUEST";
    }
    
    //System.out.println("-> Employee.java grade_str:" + grade_str);
    
    return grade_str;
  }
  
}
