package dev.mvc.community;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import dev.mvc.coin.Coin;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommunityService {

  private final CommunityRepository communityRepository;

  /** 등록 또는 수정 */
  public Community save(Community community) {
    return communityRepository.save(community);
  }

  /** 전체 목록 조회 */
  public List<Community> findAll() {
    return communityRepository.findAll();
  }

  /** 커뮤니티 id에 해당하는 정보 반환 */
  public Optional<Community> findByCommunityNoOptional(Long communityNo) {
    return communityRepository.findById(communityNo);
}
  
  /** 커뮤니티 목록 페이징 */
  public Page<Community> findByCoinNo(Long coinNo, Pageable pageable) {
    return communityRepository.findByCoinNo(coinNo, pageable);
  }

  /** 삭제 */
  public void deleteById(Long communityNo) {
    communityRepository.deleteById(communityNo);
  }
}
