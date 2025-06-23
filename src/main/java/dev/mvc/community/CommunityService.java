package dev.mvc.community;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

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

  /** 단건 조회 (Optional 반환) */
  public Optional<Community> findByCommunityNoOptional(Long community_no) {
    return communityRepository.findById(community_no);
  }

  /** 삭제 */
  public void deleteById(Long community_no) {
    communityRepository.deleteById(community_no);
  }
}
