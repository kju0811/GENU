package dev.mvc.auth;

import java.time.LocalDateTime;

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
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Entity @Getter @Setter @ToString
public class Auth {
  /**
   * 거래 식별자, sequence 자동 생성됨.
   * @Id: Primary Key
   */
  @Id
  @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="auth_seq")
  @SequenceGenerator(name="auth_seq", sequenceName="AUTH_SEQ", allocationSize=1)
  @Column(name = "auth_no", updatable = false)
  private Long authNo;
  
  /** 인증번호 */
  @Column(name = "auth_code", length = 6, updatable = false,  nullable = false)
  private String authCode;
  
  /** 요청시간 */
  @Column(name = "created_at", updatable = false,  nullable = false)
  private LocalDateTime createdAt;
  
  /** 만료시간 */
  @Column(name = "expire_at", updatable = false,  nullable = false)
  private LocalDateTime expireAt;
  
  /** 인증여부 */
  @Column(name = "verified", nullable = false)
  private Boolean verified = false;
  
  /**
   * member 테이블에 member_no를 참조
   */
  @ManyToOne
  @JoinColumn(name="member_no", referencedColumnName = "member_no", nullable = false)
  private Member member;
  
  /** 생성시 자동 */
  @PrePersist
  protected void onCreate() {
      this.createdAt = LocalDateTime.now();
      this.expireAt = this.createdAt.plusMinutes(5); // 유효시간 5분
  }
}
