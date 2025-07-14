package dev.mvc.notification;

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
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Entity @Getter @Setter @ToString
@Builder
public class Notification {
  
  /**
   * 종합알림 식별자, sequence 자동 생성됨.
   * @Id: Primary Key
   */
  @Id
  @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="notification_seq")
  @SequenceGenerator(name="notification_seq", sequenceName="NOTIFICATION_SEQ", allocationSize=1)
  @Column(name = "notification_no", updatable = false)
  private Long notification_no;
  
  /** 알림 내용 */
  @Column(name = "notification_text", length = 40, nullable = false)
  private String notification_text;
  
  /** 읽기전 0 / 읽은 후 1 */
  @Column(name = "notification_readtype", columnDefinition = "NUMBER(1)", nullable = false)
  private int notification_readtype=0;
  
  /** 알림 생성 위치 */
  @Column(name = "notification_nametype", length = 10, nullable = false)
  private String notification_nametype;
  
  /** 알림 생성일 */
  @Column(name = "notification_date", columnDefinition = "DATE", nullable = false)
  private LocalDateTime notification_date;
  
  /** 외래키 */
  @ManyToOne
  @JoinColumn(name="member_no", referencedColumnName = "member_no", nullable = false)
  private Member member;
  
  /** 시간 자동으로 넣어준다. */
  @PrePersist
  public void prePersist() {
      if (notification_date == null) {
        notification_date = LocalDateTime.now();
      }
  }
}
