package dev.mvc.deal;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DealRepository extends JpaRepository<Deal, Long> {

  @Query("SELECT COALESCE(SUM(d.deal_cnt), 0) "
      + "from Deal d "
      + "where d.member.member_no=:member_no and d.coin.coin_no=:coin_no and d.deal_type=1")
  Integer getBuybyCnt(@Param("member_no") Long member_no, @Param("coin_no") Long coin_no);
  
  @Query("SELECT COALESCE(SUM(d.deal_cnt), 0) "
      + "FROM Deal d "
      + "WHERE d.member.member_no = :member_no "
      + "AND d.coin.coin_no = :coin_no "
      + "AND (d.deal_type = 2 OR d.deal_type = 4)")
  Integer getSellbyCnt(@Param("member_no") Long member_no, @Param("coin_no") Long coin_no);
  
  @Query("SELECT d "
      + "FROM Deal d "
      + "WHERE d.deal_type = 3 AND d.coin.coin_no = :coin_no")
  List<Deal> getType3(@Param("coin_no") Long coin_no);
  
  @Query("SELECT d "
      + "FROM Deal d "
      + "WHERE d.deal_type = 4 AND d.coin.coin_no = :coin_no")
  List<Deal> getType4(@Param("coin_no") Long coin_no);
}