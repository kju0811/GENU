package dev.mvc.coinlike;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CoinlikeRepository extends JpaRepository<Coinlike, Long>{  
  @Query("SELECT c "
      + "FROM Coinlike c "
      + "WHERE c.member.member_no = :member_no")
  List<Coinlike> findByMemberCoinlike(@Param("member_no") Long member_no);
}
