package dev.mvc.attendance;

import java.time.LocalDate;
import java.time.LocalDateTime;

import dev.mvc.member.Member;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Entity @Getter @Setter @ToString
public class Attendance {
  /**
   * 출석체크 번호 식별자, sequence 자동 생성됨.
   * @Id: Primary Key
   */
  @Id
  @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="attendance_seq")
  @SequenceGenerator(name="attendance_seq", sequenceName="ATTENDANCE_SEQ", allocationSize=1)
  @Column(name = "attendance_no", updatable = false)
  private Long attendance_no;
  
  /** 출석체크 기록 */
  @Column(name = "attendance_date", nullable = false)
  private LocalDate attendance_date;
  
  /** 누적 출석 */
  @Column(name = "attendance_cnt", nullable = false)
  private Integer attendance_cnt = 0;
  
  /**
   * member 테이블에 member_no를 참조
   */
  @ManyToOne
  @JoinColumn(name="member_no", referencedColumnName = "member_no", nullable = false)
  private Member member;
}
