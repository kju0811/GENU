package dev.mvc.notice;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import dev.mvc.deal.Deal;
import lombok.RequiredArgsConstructor;

@RequestMapping(value = "/notice")
@RestController
@RequiredArgsConstructor
public class NoticeController {
  private final NoticeService noticeService;
  
  /**
   * 알림 생성
   * @param notice
   * @return
   */
  @PostMapping(value="/create")
  @ResponseBody
  public ResponseEntity<Notice> create(@RequestBody Notice notice) {
    noticeService.save(notice);
    return ResponseEntity.ok().build();
  }
  
  /**
   * 전체 목록
   * GET 요청을 처리하여 모든 Entity 객체의 리스트를 반환
   * http://localhost:9093/notice/find_all
   * @return
   */
  @GetMapping(value = "/find_all")
  public List<Notice> find_all() {
    return noticeService.find_all();
  }
  
  /**
   * DELETE 요청을 처리하여 특정 ID를 가진 Entity 객체를 삭제
   * http://localhost:9093/notice/21
   * @param id
   * @return
   */
  @DeleteMapping(value = "/{notice_no}")
  public ResponseEntity<Void> deleteEntity(@PathVariable("notice_no") Long id) {
    if (noticeService.find_by_id(id).isPresent()) { // Entity가 존재하면
      noticeService.deleteEntity(id); // 삭제
      return ResponseEntity.ok().build(); // 성공적으로 삭제된 경우 200 반환
    } else {
      return ResponseEntity.notFound().build(); // 찾지 못한 경우 404 반환
    }
  }
  
  /**
   * 수정
   * PUT 요청을 처리하여 특정 ID를 가진 Entity 객체를 업데이트
   * http://localhost:9093/notice/21
   * @param id
   * @param entity
   * @return
   */
  @PutMapping(path = "/{notice_no}")
  public ResponseEntity<Notice> updateEntity(@PathVariable("notice_no") Long id, 
                                                                @RequestBody Notice notice) {
    // id를 이용한 레코드 조회 -> existingEntity 객체에 할당 -> {} 실행 값 저장 -> DBMS 저장 -> 상태 코드 200 출력
    return noticeService.find_by_id(id).<ResponseEntity<Notice>>map(existingNotice -> {
      existingNotice.setNotice_price(notice.getNotice_price());
      
      noticeService.save(existingNotice);
      return ResponseEntity.ok().build(); // 200 반환
    }).orElseGet(() -> ResponseEntity.notFound().build()); // 찾지 못한 경우 404 반환
  }
  
  /**
   * 해당 멤버의 알림 반환
   * @param member_no
   * @return
   */
  @GetMapping(value = "/member/{member_no}")
  public List<Notice> getMemberNotice(@PathVariable("member_no") Long member_no) {
    
    return noticeService.getMemberNotice(member_no);
  }
  
  /**
   * coin_no에 해당 하고 발송되는 않은 알림 반환
   * @param coin_no
   * @return
   */
  @GetMapping(value = "/coin/{coin_no}")
  public List<Notice> getPending(@PathVariable("coin_no") Long coin_no) {
    
    return noticeService.getPending(coin_no);
  }
  
}
