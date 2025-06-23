package dev.mvc.fluctuation;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FluctuationRepository extends JpaRepository<Fluctuation, Long> {
  // 현재~3일전 까지의 뉴스를 찾아 리스트 반환
  @Query(value = """
      SELECT f.fluctuation_no, f.news_no, f.coin_no, f.fluctuation_date
      FROM fluctuation f
      WHERE f.fluctuation_date BETWEEN SYSDATE - 3 AND SYSDATE
        AND f.coin_no = :coin_no
      """, nativeQuery = true)
  List<Fluctuation> findByRdatePeriod(@Param("coin_no") Long coin_no);
}
