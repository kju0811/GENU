package dev.mvc.communitylike;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommunitylikeRepository extends JpaRepository<Communitylike, Long> {
}
