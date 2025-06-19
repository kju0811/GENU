package dev.mvc.community;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long> {
  // 필요하면 커스텀 쿼리 추가 가능
}
