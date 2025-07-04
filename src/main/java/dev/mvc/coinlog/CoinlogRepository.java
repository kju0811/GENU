package dev.mvc.coinlog;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CoinlogRepository extends JpaRepository<Coinlog, Long> {

  @Query(value = """
      SELECT DISTINCT
          TRUNC(cl.coinlog_time) as trade_date,
          MIN(cl.coinlog_price) OVER (
          PARTITION BY TRUNC(cl.coinlog_time)
          ) AS low,
          FIRST_VALUE(cl.coinlog_price) OVER (
              PARTITION BY TRUNC(cl.coinlog_time) 
              ORDER BY cl.coinlog_time
          ) AS open,
          LAST_VALUE(cl.coinlog_price) OVER (
              PARTITION BY TRUNC(cl.coinlog_time) 
              ORDER BY cl.coinlog_time 
              ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
          ) AS close,
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
}
