package dev.mvc.deal;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
  
  // 평단가 출력할 때 매도 주문을 넣어두면 현자산에선 빠지지 않는다. (거래가 되지않았기 때문에)
  @Query("SELECT COALESCE(SUM(d.deal_cnt), 0) "
      + "FROM Deal d "
      + "WHERE d.member.member_no = :member_no "
      + "AND d.coin.coin_no = :coin_no "
      + "AND d.deal_type = 2")
  Integer getSellbyCntOk(@Param("member_no") Long member_no, @Param("coin_no") Long coin_no);
  
  @Query(value = "SELECT COALESCE(SUM(d.deal_cnt), 0) "
      + "FROM deal d "
      + "WHERE d.deal_type = 1 "
      + "AND d.coin_no = :coin_no "
      + "AND d.deal_date BETWEEN "
      + "(SYSTIMESTAMP AT TIME ZONE 'Asia/Seoul') - INTERVAL '1' HOUR "
      + "AND (SYSTIMESTAMP AT TIME ZONE 'Asia/Seoul')", nativeQuery = true)
  Integer getTotalType1(@Param("coin_no") Long coin_no);

  @Query(value = "SELECT COALESCE(SUM(d.deal_cnt), 0) "
      + "FROM deal d "
      + "WHERE d.deal_type = 2 "
      + "AND d.coin_no = :coin_no "
      + "AND d.deal_date BETWEEN "
      + "(SYSTIMESTAMP AT TIME ZONE 'Asia/Seoul') - INTERVAL '1' HOUR "
      + "AND (SYSTIMESTAMP AT TIME ZONE 'Asia/Seoul')", nativeQuery = true)
  Integer getTotalType2(@Param("coin_no") Long coin_no);
  
  @Query("SELECT d "
      + "FROM Deal d "
      + "WHERE d.deal_type = 3 AND d.coin.coin_no = :coin_no")
  List<Deal> getType3(@Param("coin_no") Long coin_no);
  
  @Query("SELECT d "
      + "FROM Deal d "
      + "WHERE d.deal_type = 4 AND d.coin.coin_no = :coin_no")
  List<Deal> getType4(@Param("coin_no") Long coin_no);
  
  @Query(value = "SELECT d.deal_price, COALESCE(SUM(d.deal_cnt), 0) AS total_cnt "
      + "FROM Deal d "
      + "WHERE d.coin_no = :coin_no AND d.deal_type IN (3, 4) "
      + "GROUP BY d.deal_price "
      + "ORDER BY d.deal_price ", nativeQuery = true)
  List<Object[]> getOrderList(@Param("coin_no") Long coin_no);
  
  // deal_date를 기준으로 내림차순 정렬하여 ISSUE 페이징 목록을 출력하는 메소드
  @Query("SELECT d FROM Deal d "
      + "WHERE d.member.member_no = :member_no ORDER BY deal_date DESC")
  Page<Deal> findDealsByMember(@Param("member_no") Long member_no, Pageable pageable);
  
  // 페이징 + 검색 처리를 위해 Pageable 파라미터를 추가합니다.
  @Query("SELECT d FROM Deal d "
      + "WHERE d.member.member_no = :member_no AND "
      + "LOWER(d.coin.coin_name) LIKE LOWER(CONCAT('%', :coin_name, '%'))")
  Page<Deal> findDealsByMemberSearch(@Param("member_no") Long member_no, @Param("coin_name") String coin_name, Pageable pageable);
 
  // 멤버가 해당 코인에 주문한 거래내역 날짜 내림차 순 반환, 주문 체결X
  @Query("SELECT d FROM Deal d "
      + "WHERE d.member.member_no = :member_no "
      + "AND d.coin.coin_no = :coin_no "
      + "AND d.deal_type IN (3, 4) "
      + "ORDER BY deal_date DESC")
  List<Deal> findDealsByMemberCoin(@Param("member_no") Long member_no, @Param("coin_no") Long coin_no);
  
  // 멤버가 해당 코인에 주문한 2주간 거래내역 날짜 내림차 순 반환,
  @Query("SELECT d FROM Deal d " +
	       "WHERE d.member.member_no = :member_no " +
	       "AND d.deal_type IN (3, 4) " +
	       "AND d.deal_date >= :twoWeeksAgo " +
	       "ORDER BY d.deal_date DESC")
	List<Deal> findRecentDealsTwoweeks(@Param("member_no") Long memberNo,
	                           @Param("twoWeeksAgo") LocalDateTime twoWeeksAgo);
  
  // 보유 수량이 0이 된 마지막 시점
  @Query(value = """
      SELECT deal_date
      FROM (
        SELECT deal_date,
               SUM(CASE WHEN deal_type = 1 THEN deal_cnt WHEN deal_type = 2 THEN -deal_cnt ELSE 0 END)
                   OVER (ORDER BY deal_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_qty
        FROM Deal
        WHERE member_no = :member_no AND coin_no = :coin_no
      ) t
      WHERE running_qty = 0
      ORDER BY deal_date DESC
      FETCH FIRST 1 ROWS ONLY
      """, nativeQuery = true)
  LocalDateTime findLastZeroQuantityDate(@Param("member_no") Long member_no, @Param("coin_no") Long coin_no);
  
  // 평단가를 위해 가격과 갯수 반환
  @Query("SELECT d.deal_price, d.deal_cnt "
      + "FROM Deal d "
      + "WHERE d.member.member_no=:member_no AND d.coin.coin_no=:coin_no AND d.deal_type=1 "
      + "AND d.deal_date > :last_zero_date")
  List<Object[]> getAVGprice(@Param("member_no") Long member_no, @Param("coin_no") Long coin_no, @Param("last_zero_date") LocalDateTime lastZeroDate);
  
}