package dev.mvc.notification;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.mvc.notice.Notice;
import dev.mvc.notice.NoticeRepository;
import lombok.Builder;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {
  
  private final NotificationRepository notificationRepository;
  
  /** Create, insert~ */
  public void save(Notification notification) {
    notificationRepository.save(notification);
  }
  
  /** 종합알림 id에 해당하는 정보 반환 */
  public Optional<Notification> find_by_id(Long id) {
    return notificationRepository.findById(id);  // method/SQL 자동 생성
  }
  
  /** 종합알림 id에 해당하는 알림 삭제 */
  public void deleteEntity(Long id) {
    notificationRepository.deleteById(id);
  }
  
  /** 모든 레코드 출력 */
  public List<Notification> find_all() {
    return notificationRepository.findAll();  // method/SQL 자동 생성
  } 
  
  /** 해당 멤버의 안본 알림  */
  public List<Notification> find_by_readtype0(Long member_no) {
    return notificationRepository.getReadtype0List(member_no);
  }
  
  /** 해당 멤버의 알림 내역 */
  public List<Notification> find_by_MemberNotification(Long member_no) {
    return notificationRepository.getMemberNotificationList(member_no);
  }
  
  /** 알림을 클릭했을 때 타입을 본후로 바꾸는 메서드 */
  @Transactional
  public Notification clickNotification(Long id) {
    Optional<Notification> notification = notificationRepository.findById(id);
    if (notification.isPresent()) {
      Notification data = notification.get();
      data.setNotification_readtype(1); // 본후로 변경
      notificationRepository.save(data);
      return data;
      
    } else {
      throw new NoSuchElementException("해당 테이터는 비어있습니다.");
    }
  }
  
  /** 알림 생성 */
  public void notificationCreate(NotificationDTO dto) { // 내용, 생성 위치 저장
    Notification notification = Notification.builder()
        .notification_text(dto.getNotification_text())
        .notification_nametype(dto.getNotification_nametype())
        .member(dto.getMember())
        .build();
    
    notificationRepository.save(notification);
  }
  
}
