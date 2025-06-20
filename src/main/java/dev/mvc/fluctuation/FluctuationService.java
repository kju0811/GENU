package dev.mvc.fluctuation;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FluctuationService {
  private final FluctuationRepository fluctuationRepository;
  
  /** Create, INSERT~, UPDATE~ */
  public void save(Fluctuation fluctuation) {
    fluctuationRepository.save(fluctuation); 
  }
  
  /** 코인변동 id에 해당하는 정보 반환 */
  public Optional<Fluctuation> find_by_id(Long id) {
    return fluctuationRepository.findById(id);  // method/SQL 자동 생성
  }
  
  /** 코인변동 id에 해당하는 코인변동 삭제 */
  public void deleteEntity(Long id) {
    fluctuationRepository.deleteById(id);
  }
  
  /** 모든 레코드 출력 */
  public List<Fluctuation> find_all() {
    return fluctuationRepository.findAll();  // method/SQL 자동 생성
  }
}
