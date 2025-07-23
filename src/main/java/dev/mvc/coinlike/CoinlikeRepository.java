package dev.mvc.coinlike;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CoinlikeRepository extends JpaRepository<Coinlike, Long>{  
  @Query("SELECT c "
      + "FROM Coinlike c "
      + "WHERE c.member.member_no = :member_no")
  List<Coinlike> findByMemberCoinlikeList(@Param("member_no") Long member_no);
  
  @Query("SELECT c FROM Coinlike c "
      + "WHERE c.member.member_no = :member_no AND c.coin.coin_no = :coin_no")
  Optional<Coinlike> isMemberCoinlike(@Param("member_no") Long member_no, @Param("coin_no") Long coin_no);
}
