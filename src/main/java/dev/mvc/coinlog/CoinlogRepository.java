package dev.mvc.coinlog;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CoinlogRepository extends JpaRepository<Coinlog, Long> {

  @Query(value = """
      SELECT DISTINCT
          -- 날짜별로 그룹핑 (날짜만 추출: 시간 제외)
          TRUNC(cl.coinlog_time) as trade_date,
          
          -- 날짜별 최저가
          MIN(cl.coinlog_price) OVER (
          PARTITION BY TRUNC(cl.coinlog_time)
          ) AS low,
          
          -- 날짜별 첫 거래가 (open)
          FIRST_VALUE(cl.coinlog_price) OVER (
              PARTITION BY TRUNC(cl.coinlog_time) 
              ORDER BY cl.coinlog_time
          ) AS open,
          
          -- 날짜별 마지막 거래가 (close)
          LAST_VALUE(cl.coinlog_price) OVER (
              PARTITION BY TRUNC(cl.coinlog_time) 
              ORDER BY cl.coinlog_time 
              ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
          ) AS close,
          
          -- 날짜별 최고가
          MAX(cl.coinlog_price) OVER (
              PARTITION BY TRUNC(cl.coinlog_time)
          ) AS high
      FROM Coinlog cl
      WHERE cl.coin_no = :coin_no
          AND cl.coinlog_time >= :startDate
          AND cl.coinlog_time < :endDate
      ORDER BY TRUNC(cl.coinlog_time)
      """, nativeQuery = true)
  List<Object[]> getDailyOhlcData(@Param("coin_no") Long coin_no, 
                                 @Param("startDate") LocalDate startDate, 
                                 @Param("endDate") LocalDate endDate);
  
  // 오늘자 첫번째 금액
  @Query(value = """
      SELECT coinlog_price
      FROM coinlog
      WHERE TRUNC(coinlog_time) = TRUNC(SYSDATE) AND coin_no = :coin_no
      ORDER BY coinlog_time ASC
      FETCH FIRST 1 ROWS ONLY
  """, nativeQuery = true)
  Optional<Integer> findFirstPriceToday(@Param("coin_no") Long coin_no);
  
}
