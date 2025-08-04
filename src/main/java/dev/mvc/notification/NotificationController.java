package dev.mvc.notification;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RequestMapping(value = "/notification")
@RestController
@RequiredArgsConstructor
public class NotificationController {
  private final NotificationService notificationService;
  
//  /**
//   * 알림 생성
//   * @param notice
//   * @return
//   */
//  @PostMapping(value="/create")
//  @ResponseBody
//  public ResponseEntity<Notification> create(@RequestBody Notification notification) {
//    notificationService.save(notification);
//    return ResponseEntity.ok().build();
//  }
  
//  /**
//   * 전체 목록
//   * GET 요청을 처리하여 모든 Entity 객체의 리스트를 반환
//   * http://localhost:9093/notification/find_all
//   * @return
//   */
//  @GetMapping(value = "/find_all")
//  public List<Notification> find_all() {
//    return notificationService.find_all();
//  }
  
  /**
   * DELETE 요청을 처리하여 특정 ID를 가진 Entity 객체를 삭제
   * http://localhost:9093/notification/21
   * @param id
   * @return
   */
  @DeleteMapping(value = "/{notification_no}")
  public ResponseEntity<Void> deleteEntity(@PathVariable("notification_no") Long id) {
    if (notificationService.find_by_id(id).isPresent()) { // Entity가 존재하면
      notificationService.deleteEntity(id); // 삭제
      return ResponseEntity.ok().build(); // 성공적으로 삭제된 경우 200 반환
    } else {
      return ResponseEntity.notFound().build(); // 찾지 못한 경우 404 반환
    }
  }
  
  /**
   * 해당 멤버의 안본 알림
   * http://localhost:9093/notification/find_by_readtype0/*
   * @return
   */
  @GetMapping(value = "/find_by_readtype0/{member_no}")
  public List<Notification> find_by_readtype0(@PathVariable("member_no") Long id) {
    return notificationService.find_by_readtype0(id);
  }
  
  /**
   * 해당 멤버의 알림 내역
   * http://localhost:9093/notification/find_by_MemberNotification/*
   * @return
   */
  @GetMapping(value = "/find_by_MemberNotification/{member_no}")
  public List<Notification> find_by_MemberNotification(@PathVariable("member_no") Long id) {
    return notificationService.find_by_MemberNotification(id);
  }
  
  /**
   * 알림 클릭 시 상세정보
   * http://localhost:9093/notification/clickNotification/*
   * @return
   */
  @PostMapping(value = "/clickNotification/{notification_no}")
  public Notification clickNotification(@PathVariable("notification_no") Long id) {
    return notificationService.clickNotification(id);
  }
  
//  /**
//   * 알림 생성
//   * @param notice
//   * @return
//   */
//  @PostMapping(value="/create")
//  @ResponseBody
//  public ResponseEntity<Notification> notificationCreate(@RequestBody NotificationDTO dto) {
//    notificationService.notificationCreate(dto);
//    return ResponseEntity.ok().build();
//  }
  
}
