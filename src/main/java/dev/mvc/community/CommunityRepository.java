package dev.mvc.community;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import dev.mvc.coin.Coin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long> {
  @Query("SELECT c FROM Community c WHERE c.coin.coin_no = :coinNo ORDER BY c.communityDate DESC")
  Page<Community> findByCoinNo(@Param("coinNo") Long coinNo, Pageable pageable);
}
