package dev.mvc.notice;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NoticeService {
  private final NoticeRepository noticeRepository;
  
  /** Create, INSERT~, UPDATE~ */
  public void save(Notice notice) {
    noticeRepository.save(notice); 
  }
  
  /** 알림 id에 해당하는 정보 반환 */
  public Optional<Notice> find_by_id(Long id) {
    return noticeRepository.findById(id);  // method/SQL 자동 생성
  }
  
  /** 알림 id에 해당하는 알림 삭제 */
  public void deleteEntity(Long id) {
    noticeRepository.deleteById(id);
  }
  
  /** 모든 레코드 출력 */
  public List<Notice> find_all() {
    return noticeRepository.findAll();  // method/SQL 자동 생성
  }
}
