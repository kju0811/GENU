package dev.mvc.notification;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import dev.mvc.notice.Notice;
import dev.mvc.notice.NoticeRepository;
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
  
}
