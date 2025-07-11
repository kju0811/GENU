package dev.mvc.notification;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotificationRepository extends JpaRepository<Notification, Long>{

  /** 안본 알림만 반환 */
  @Query("SELECT n FROM Notification n "
      + "WHERE n.notification_readtype = 0 "
      + "AND n.member.member_no = :member_no")
  List<Notification> getReadtype0List(@Param("member_no") Long member_no);
  
  /** 알림내역 */
  @Query("SELECT n FROM Notification n "
      + "WHERE n.member.member_no = :member_no")
  List<Notification> getMemberNotificationList(@Param("member_no") Long member_no);
}
