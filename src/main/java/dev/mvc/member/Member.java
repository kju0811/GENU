package dev.mvc.member;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Entity @Setter @Getter @ToString
public class Member {
  /**
   * 회원 번호 식별자, sequence 자동 생성됨.
   * @Id: Primary Key
   */
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "member_seq")
  @SequenceGenerator(name = "member_seq", sequenceName = "MEMBER_SEQ", allocationSize = 1)
  private Long member_no;
  
  /** 회원 아이디(이메일) */
  private String member_id;
  
  /** 패스워드 */
  private String member_pw;
  
  /** 성명 */
  private String member_name;
  
  /** 전화번호 */
  private String member_tel="";
  
  /** 우편번호 */
  private String zipcode="";
  
  /** 주소1 */
  private String address1="";
  
  /** 주소2 */
  private String address2="";
  
  /** 가입일 */
  @Column(columnDefinition = "DATE")
  private String member_date="";
  
  /** 회원등급 */
  private Integer member_grade=0;
  
  /** 활동명 */
  private String member_nick="";
  
  }
  
